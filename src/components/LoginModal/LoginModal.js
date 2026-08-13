import React, {useEffect, useState} from 'react';
import ModalWrapper from "../ModalWrapper/ModalWrapper";
import ApiEndpoints from "../../utils/ApiEndpoints";
import useHttp from "../../hooks/http";
import Geolocation from "react-geolocation";
import {phoneNumberPrefix} from "../../utils/constants";
import RequestSpinner from "../RequestSpinner/RequestSpinner";
import OtpVerification from "../OTPVerification/OTPVerification";
import ForgotPassword from "../ForgotPassword/ForgotPassword";
import useSyncDispatch from "../../hooks/dispatch";
import {API_SUCCESS} from "../../store/actionTypes/global-actions";
import CartUtils from "../../utils/CartUtils";

const md5 = require("md5");

const NORMAL_VIEW = 'NORMAL_VIEW';
const OTP_CODE_VIEW = 'OTP_CODE_VIEW';
const FORGOT_PASSWORD_VIEW = 'FORGOT_PASSWORD_VIEW';

const LoginModal = ({show, clickBackdrop, openSignUp}) => {

    const {sendDispatch} = useSyncDispatch();

    const apiEndpoints = new ApiEndpoints();
    const [view, setView] = useState(NORMAL_VIEW);
    const [rememberMe, setRememberMe] = useState(true);
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState(phoneNumberPrefix);
    const [requestSent, setRequestSent] = useState(false);
    const [coordinates, setCoordinates] = useState({lat: 0, lng: 0});
    const [otpCodeRequest, setOtpCodeRequest] = useState(false);
    const [forgotPasswordVerifyRequest, setForgotPasswordVerifyRequest] = useState(false);

    const [errors, setErrors] = useState({
        invalidPhoneNumber: false,
        invalidPassword: false,
        otpCode: false
    });

    useEffect(() => {
        if (show) {
            setErrors({
                invalidPassword: false,
                invalidPhoneNumber: false
            });
            setPhoneNumber('');
            setPassword('');
            setView(NORMAL_VIEW);
        }
    }, [show]);

    const {sendRequest, isLoading, error, clearError} = useHttp();

    useEffect(() => {
        if (otpCodeRequest && !isLoading) {
            setOtpCodeRequest(false);
            if (!error) {
                setErrors(prev => ({...prev, invalidPhoneNumber: false}));
                setView(OTP_CODE_VIEW);
            }
        }
    }, [otpCodeRequest, isLoading, error]);

    useEffect(() => {
        if (forgotPasswordVerifyRequest && !isLoading) {
            setForgotPasswordVerifyRequest(false);
            if (!error) {
                setErrors(prev => ({...prev, invalidPhoneNumber: false}));
                setView(FORGOT_PASSWORD_VIEW);
            }
        }
    }, [forgotPasswordVerifyRequest, isLoading, error]);

    useEffect(() => {
        if (requestSent && !isLoading) {
            setRequestSent(false);
            if (!error) {
                clickBackdrop();
            }
        }
    }, [requestSent, isLoading, error]);

    const changeRememberMe = () => {
        setRememberMe(prevVal => !prevVal);
    };

    const onPhoneNumberChange = event => {
        setPhoneNumber(`${event.target.value}`);
    };

    const onPasswordChange = event => {
        setPassword(event.target.value);
    };

    const setCurrentLocation = result => {
        setCoordinates({lat: result.coords.latitude, lng: result.coords.longitude});
    };

    const sendOtpCode = () => {
        const invalidPhoneNumber = !phoneNumber || phoneNumber.length !== 10;
        if (!invalidPhoneNumber) {
            clearError();
            const apiBody = {
                mobile: {
                    dialing_code: phoneNumberPrefix,
                    number: phoneNumber
                }
            };
            const {url, method, body, success, error} = apiEndpoints.getApiEndpoints().login.otp(apiBody);
            sendRequest(url, method, body, success, error);
            setOtpCodeRequest(true);
        } else {
            setErrors(prevValue => {
                return {
                    ...prevValue,
                    invalidPhoneNumber: invalidPhoneNumber
                }
            });
        }
    };

    const clearCart = () => {
        const {url, method, body, success, error} =
            apiEndpoints
                .getApiEndpoints()
                .cart
                .clearCart();
        sendRequest(url, method, body, success, error, () => {
            CartUtils.removeShopsIds();
            CartUtils.removeMostRecentShop();
            CartUtils.removeMostRecentAddresses();
        });
    };

    const forgotPasswordVerify = () => {
        clearError();
        const invalidPhoneNumber = !phoneNumber || phoneNumber.length !== 10;
        if (!invalidPhoneNumber) {
            const apiBody = {
                mobile: {
                    dialing_code: phoneNumberPrefix,
                    number: phoneNumber
                }
            };
            const {url, method, body, success, error} = apiEndpoints.getApiEndpoints().login.forgotPasswordVerify(apiBody);
            sendRequest(url, method, body, success, error);
            setForgotPasswordVerifyRequest(true);
        } else {
            setErrors(prevValue => {
                return {
                    ...prevValue,
                    invalidPhoneNumber: invalidPhoneNumber
                }
            });
        }
    };

    const changePassword = (otpCode, password) => {
        const apiBody =
            {
                "mobile": {
                    "dialing_code": 91,
                    "number": phoneNumber
                },
                "otp": otpCode,
                "password": md5(password)
            };
        const {url, method, body, success, error} = apiEndpoints.getApiEndpoints().login.resetPassword(apiBody);
        sendRequest(url, method, body, success, error, changePasswordSuccess);
    };

    const changePasswordSuccess = () => {
        setPhoneNumber('');
        setPassword('');
        setView(NORMAL_VIEW);
        sendDispatch(API_SUCCESS, 'Password successfully changed!');
    };

    const loginWithOtp = (otpCode) => {
        const apiBody = {
            "mobile": {
                "dialing_code": 91,
                "number": phoneNumber
            },
            "otp": otpCode,
            "device_details": {
                "type": 3,
                "token": "eebe9d0aa28aa5e6"
            },
            "current_location": {
                "type": "Point",
                "coordinates": [
                    coordinates.lat,
                    coordinates.lng
                ]
            }
        };
        const {url, method, body, success, error} = apiEndpoints.getApiEndpoints().login.loginWithOtp(apiBody);
        sendRequest(url, method, body, success, error, clearCart);
        setRequestSent(true);
    };

    const login = () => {
        const invalidPassword = !password || password.length === 0;
        const invalidPhoneNumber = !phoneNumber || phoneNumber.length !== 10;
        setErrors({
            invalidPhoneNumber,
            invalidPassword
        });
        if (!invalidPassword && !invalidPhoneNumber) {
            const mobile = {
                dialing_code: "91",
                number: phoneNumber
            };
            const current_location = {
                type: "Point",
                coordinates: [
                    coordinates.lng, coordinates.lat
                ]
            };
            if (mobile && password) {
                clearError();
                const {url, method, body, success, error} =
                    apiEndpoints.getApiEndpoints().login.user(mobile, md5(password), current_location);
                sendRequest(url, method, body, success, error, () => {
                    getUserProfile();
                    getRazzorSettings();
                    clearCart();
                });
                setRequestSent(true);
            }
        }
    };

    const getUserProfile = () => {
        const {url, method, body, success, error} = apiEndpoints.getApiEndpoints().user.getUserProfile();
        sendRequest(url, method, body, success, error);
    };

    const getRazzorSettings = () => {
        const {url, method, body, success, error} = apiEndpoints.getApiEndpoints().razor.getRazorSettings();
        sendRequest(url, method, body, success, error, null, () => {});
    };

    const closeModal = () => {
        clickBackdrop();
    };

    return (
        <ModalWrapper show={show} clickBackdrop={() => {}}>
            <Geolocation
                onSuccess={setCurrentLocation}
                enableHighAccuracy={true}
            />
            {view === NORMAL_VIEW && <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Login</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                                onClick={closeModal}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body w-500px">
                        <div className='text-secondary px-5'>
                            Enter your mobile number and password to login into the app
                        </div>
                        <div className='mt-2'>
                            <div className="input-group mb-1 mr-sm-2">
                                <div className="input-group-prepend">
                                    <div className="input-group-text">+91</div>
                                </div>
                                <input className="form-control"
                                       id="inlineFormInputGroupUsername2"
                                       type="number"
                                       value={phoneNumber}
                                       placeholder="10 digit mobile number"
                                       onChange={onPhoneNumberChange}/>
                            </div>
                            <small id="phoneNumber"
                                   className={`mb-1 form-text transparent-text error ${errors.invalidPhoneNumber ? 'visible' : 'hidden'}`}>
                                Invalid phone number.
                            </small>
                            <input type="password" id="inputPassword5" className="form-control mt-2"
                                   onChange={onPasswordChange}
                                   aria-describedby="passwordHelpBlock" placeholder='Password'/>
                            <small id="inputPassword5"
                                   className={`mb-1 form-text transparent-text error ${errors.invalidPassword ? 'visible' : 'hidden'}`}>
                                Password is required.
                            </small>
                            <div className='d-flex justify-content-between mt-2'>
                                <span className='link text-decoration-none' onClick={sendOtpCode}>
                                    Login using OTP
                                </span>
                                <span className='link text-decoration-none' onClick={forgotPasswordVerify}>Forgot Password</span>
                            </div>
                            <div className='d-flex justify-content-start mt-3'>
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" checked={rememberMe}
                                           onChange={changeRememberMe} id="defaultCheck1"/>
                                    <label className="form-check-label" htmlFor="defaultCheck1">
                                        Remember me
                                    </label>
                                </div>
                            </div>
                            <div className='d-flex justify-content-center mt-2'>
                                <span className='link text-decoration-none' onClick={openSignUp}>New User</span>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-light" data-dismiss="modal"
                                onClick={closeModal}>Cancel
                        </button>
                        <button type="button" className="btn btn-primary" onClick={login}>Login</button>
                    </div>
                </div>
            </div>}
            {view === OTP_CODE_VIEW &&
            <OtpVerification
                clickBackdrop={closeModal}
                resendOTP={sendOtpCode}
                onLogin={loginWithOtp}
                onPrevious={() => {
                    setView(NORMAL_VIEW)
                }}/>}
            {view === FORGOT_PASSWORD_VIEW &&
            <ForgotPassword phoneNumber={phoneNumber}
                            clickBackdrop={closeModal}
                            show={show}
                            resendOTP={forgotPasswordVerify}
                            onChangePassword={changePassword}
                            onPrevious={() => setView(NORMAL_VIEW)}/>
            }
            {isLoading && requestSent && <RequestSpinner/>}
            {isLoading && otpCodeRequest && <RequestSpinner/>}
            {isLoading && forgotPasswordVerifyRequest && <RequestSpinner/>}
        </ModalWrapper>
    );
};

export default LoginModal;
