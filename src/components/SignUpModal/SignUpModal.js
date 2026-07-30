import React, {useEffect, useState} from 'react';
import ModalWrapper from "../ModalWrapper/ModalWrapper";
import {phoneNumberPrefix} from "../../utils/constants";
import {EMAIL_REGEX} from "../../utils/regEx";
import RequestSpinner from "../RequestSpinner/RequestSpinner";
import useHttp from "../../hooks/http";
import Geolocation from "react-geolocation";
import ApiEndpoints from "../../utils/ApiEndpoints";
import OtpVerification from "../OTPVerification/OTPVerification";

const md5 = require("md5");

const SIGN_UP_SCREEN = 'SIGN_UP_SCREEN';
const OTP_VERIFICATION_SCREEN = 'OTP_VERIFICATION_SCREEN';

const SignUpModal = ({show, clickBackdrop}) => {
    const apiEndpoints = new ApiEndpoints();
    const [signUpRequestSent, setRequestSent] = useState(false);
    const [otpRequestSent, setOtpRequestSent] = useState(false);
    const {sendRequest, isLoading, error, clearError} = useHttp();

    useEffect(() => {
        if (signUpRequestSent && !isLoading && !error) {
            clickBackdrop();
        }
    }, [signUpRequestSent, isLoading]);

    useEffect(() => {
        if (show) {
            clearError();
            setActiveView(SIGN_UP_SCREEN);
            setRequestSent(false);
            setOtpRequestSent(false);
            setErrors({
                invalidFirstName: false,
                invalidLastName: false,
                invalidPassword: false,
                invalidPhoneNumber: false,
                invalidEmail: false,
                invalidOtp: false
            });
            setPassword('');
            setPhoneNumber('');
            setFirstName('');
            setLastName('');
            setEmail('');
        }
    }, [show]);

    const [activeView, setActiveView] = useState(SIGN_UP_SCREEN);
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');

    const [errors, setErrors] = useState({
        invalidFirstName: false,
        invalidLastName: false,
        invalidPassword: false,
        invalidPhoneNumber: false,
        invalidEmail: false,
        invalidOtp: false
    });

    const onPhoneNumberChange = event => setPhoneNumber(`${event.target.value}`);
    const onPasswordChange = event => setPassword(event.target.value);
    const onFirstNameChange = event => setFirstName(event.target.value);
    const onLastNameChange = event => setLastName(event.target.value);
    const onEmailChange = event => setEmail(event.target.value);

    const [coordinates, setCoordinates] = useState({lat: 0, lng: 0});

    const setCurrentLocation = result => {
        setCoordinates({lat: result.coords.latitude, lng: result.coords.longitude});
    };

    const onNext = () => {
        if (validateForm()) {
            setOtpRequestSent(true);
            const apiBody = {
                "mobile":
                    {
                        "dialing_code": 91,
                        "number": +phoneNumber
                    },
                "email": email
            };
            const {url, method, body, success, error} = apiEndpoints.getApiEndpoints().signUp.verify(apiBody);
            sendRequest(url, method, body, success, error, onOTPSent);
        }
    };

    const onOTPSent = () => {
        clearError();
        setActiveView(OTP_VERIFICATION_SCREEN);
    };

    const resendOtpCode = () => {
        onNext();
    };

    const onPrevious = () => {
        setActiveView(SIGN_UP_SCREEN);
    };

    const signUp = (otpCode) => {
        signUpUser(otpCode);
    };

    const signUpUser = (otpCode) => {
        clearError();
        const apiBody = getBody(otpCode);
        const {url, method, body, success, error} = apiEndpoints.getApiEndpoints().signUp.signUp(apiBody);
        sendRequest(url, method, body, success, error);
        setRequestSent(true);
    };

    const getBody = otpCode => {
        return {
            "first_name": firstName,
            "last_name": lastName,
            "mobile": {
                "dialing_code": 91,
                "number": +phoneNumber
            },
            "otp": otpCode,
            "email": {
                "id": email
            },
            "password": md5(password),
            "device_details": {
                "type": 1,
                "token": "eebe9d0aa28aa5e6"
            },
            "current_location": {
                "type": "Point",
                "coordinates": [
                    coordinates.lat,
                    coordinates.lng
                ]
            }
        }
    };

    const validateForm = () => {
        const invalidFirstName = !firstName || firstName.length === 0;
        const invalidLastName = !lastName || lastName.length === 0;
        const invalidPassword = !password || password.length === 0;
        const invalidPhoneNumber = !phoneNumber || phoneNumber.length !== 10;
        const invalidEmail = !email || !EMAIL_REGEX.test(email);
        if (!invalidFirstName && !invalidLastName && !invalidPhoneNumber && !invalidEmail && !invalidPassword) {
            return true;
        } else {
            setErrors({
                invalidFirstName,
                invalidLastName,
                invalidPassword,
                invalidPhoneNumber,
                invalidEmail,
            });
            return false
        }
    };

    return (
        <ModalWrapper show={show} clickBackdrop={()=>{}}>
            <Geolocation
                onSuccess={setCurrentLocation}
                enableHighAccuracy={true}
            />
            {activeView === SIGN_UP_SCREEN ? <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            {activeView === SIGN_UP_SCREEN ? "Signup" : "Verify phone number"}
                        </h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                                onClick={clickBackdrop}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body w-500px">
                        <div className='text-secondary px-5 mb-3'>
                            {activeView === SIGN_UP_SCREEN ? "Enter the below details to create an account" :
                                "Login using the OTP sent to: " + phoneNumberPrefix + phoneNumber}
                        </div>
                        <div className="form-group mb-1">
                            <input type="text" className="form-control" id="firstNameInput"
                                   onChange={onFirstNameChange}
                                   value={firstName}
                                   aria-describedby="firstName" placeholder="First name"/>
                            <small id="firstNameInput"
                                   className={`form-text transparent-text error ${errors.invalidFirstName ? 'visible' : 'hidden'}`}>First
                                name is
                                required.</small>
                        </div>
                        <div className="form-group mb-1">
                            <input type="text" className="form-control" id="lastNameInput"
                                   onChange={onLastNameChange}
                                   value={lastName}
                                   aria-describedby="lastName" placeholder="Last name"/>
                            <small id="lastNameInput"
                                   className={`form-text transparent-text error ${errors.invalidLastName ? 'visible' : 'hidden'}`}>
                                Last name is required.</small>
                        </div>
                        <div className="input-group mb-1 mr-sm-2">
                            <div className="input-group-prepend">
                                <div className="input-group-text">+91</div>
                            </div>
                            <input className="form-control"
                                   id="phoneNumber"
                                   type="number"
                                   value={phoneNumber}
                                   placeholder="10 digit mobile number"
                                   onChange={onPhoneNumberChange}/>
                        </div>
                        <small id="phoneNumber"
                               className={`mb-1 form-text transparent-text error ${errors.invalidPhoneNumber ? 'visible' : 'hidden'}`}>
                            Invalid phone number.
                        </small>
                        <input type="password"
                               id="inputPassword5"
                               className="form-control mb-1"
                               onChange={onPasswordChange}
                               value={password}
                               aria-describedby="passwordHelpBlock"
                               placeholder='Password'/>
                        <small id="inputPassword5"
                               className={`mb-1 form-text transparent-text error ${errors.invalidPassword ? 'visible' : 'hidden'}`}>
                            Password is required.
                        </small>

                        <div className="form-group">
                            <input type="email"
                                   className="form-control"
                                   id="email"
                                   onChange={onEmailChange}
                                   value={email}
                                   aria-describedby="email"
                                   placeholder="Email id"/>
                            <small id="phoneNumber"
                                   className={`form-text transparent-text error ${errors.invalidEmail ? 'visible' : 'hidden'}`}>Invalid
                                email.</small>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-light" data-dismiss="modal"
                                onClick={clickBackdrop}>Cancel
                        </button>
                        <button type="button" className="btn btn-primary" onClick={onNext}>Next</button>
                    </div>
                </div>
            </div> : <OtpVerification show={show} phoneNumber={phoneNumber} resendOTP={resendOtpCode}
                                      clickBackdrop={clickBackdrop}
                                      onLogin={signUp} onPrevious={onPrevious}/>}
            {isLoading && (signUpRequestSent || otpRequestSent) && <RequestSpinner/>}
        </ModalWrapper>
    );
};

export default SignUpModal;
