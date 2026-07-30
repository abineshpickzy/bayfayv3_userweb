import React, { useEffect, useState } from 'react';
import './EditProfile.scss';
import CSSTransition from "react-transition-group/CSSTransition";
import { useSelector } from "react-redux";
import Aux from "../../utils/auxilary";
import ApiEndpoints from "../../utils/ApiEndpoints";
import useHttp from "../../hooks/http";
import RequestSpinner from "../RequestSpinner/RequestSpinner";
import SuccessModal from "../SuccessModal/SuccessModal";
import ErrorModal from "../ErrorModal/ErrorModal";
import ChangePasswordModal from "../ChangePasswordModal/ChangePasswordModal";

const animationTiming = {
    enter: 1000,
    exit: 1000
};

const EditProfile = ({ closeModal, show, updateUserDetailsSuccess, updateUserDetailsError, getUserProfile,
    validateEmail, resetValidateEmailFlag }) => {
    const apiEndpoints = new ApiEndpoints();
    const { sendRequest, isLoading } = useHttp();

    const [mobileNumber, setMobileNumber] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [invalidMobileNumber, setInvalidMobileNumber] = useState(false);
    const [invalidFirstName, setInvalidFirstName] = useState(false);
    const [invalidLastName, setInvalidLastName] = useState(false);
    const [mobilePhoneEditing, setMobilePhoneEditing] = useState(false);
    const [firstNameEditing, setFirstNameEditing] = useState(false);
    const [lastNameEditing, setLastNameEditing] = useState(false);
    const [disableSaveButton, setDisableSaveButton] = useState(true);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [invalidEmail, setInvalidEmail] = useState(false);
    const [emailVerifying, setEmailVerifying] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);
    const [emailEditing, setEmailEditing] = useState(false);
    const [otp, setOtp] = useState('');
    const [invalidOTP, setInvalidOTP] = useState(false);
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

    const userProfile = useSelector(state => state.authReducer.userProfile);

    useEffect(() => {
        if (userProfile) {
            const disabled = firstName === userProfile.first_name && lastName === userProfile.last_name && userProfile.mobile.number === mobileNumber && userProfile.email.id === email;
            if (disabled !== disableSaveButton) {
                setDisableSaveButton(disabled);
            }
        }
    }, [firstName, lastName, mobileNumber, userProfile, email]);

    useEffect(() => {
        if (show) {
            setInvalidLastName(false);
            setInvalidFirstName(false);
            setInvalidMobileNumber(false);
            setMobilePhoneEditing(false);
            setFirstNameEditing(false);
            setLastNameEditing(false);
            setInvalidEmail(false);
            setEmailEditing(false);
            setOtp('');
            setEmailVerifying(false);
            setEmailVerified(false);
            if (validateEmail) {
                sendEmailOTP();
                setEmailVerifying(true);
                resetValidateEmailFlag();
            }
        }
    }, [show]);

    useEffect(() => {
        if (userProfile && !mobileNumber) {
            setMobileNumber(userProfile.mobile.number);
            setFirstName(userProfile.first_name);
            setLastName(userProfile.last_name);
            setEmail(userProfile.email.id);
        }
    }, [userProfile, show]);

    const updateUserDetails = () => {
        const isInvalidMobileNumber = !mobileNumber || mobileNumber?.length === 0;
        const isInvalidFirstName = !firstName || firstName?.length === 0;
        const isInvalidLastName = !lastName || lastName?.length === 0;
        const isEmailInvalid = !email || email?.length === 0;
        setInvalidMobileNumber(isInvalidMobileNumber);
        setInvalidFirstName(isInvalidFirstName);
        setInvalidLastName(isInvalidLastName);
        setInvalidEmail(isEmailInvalid);
        if (!isInvalidLastName && !isInvalidMobileNumber && !isInvalidFirstName && !isEmailInvalid) {
            const { url, method, body, success, error } =
                apiEndpoints
                    .getApiEndpoints()
                    .user
                    .updateUserProfile(firstName, lastName, mobileNumber, email, userProfile);
            sendRequest(url, method, body, success, error, response => {
                if (response.success) {
                    updateUserDetailsSuccess(response.message);
                } else {
                    updateUserDetailsError(response.message);
                }
            })
        }
    };

    const sendEmailOTP = () => {
        const { url, method, body, success, error } =
            apiEndpoints
                .getApiEndpoints()
                .user
                .sendEmailOTP();
        sendRequest(url, method, body, success, error, response => {
            setMessage(response.message);
            if (response.success) {
                setEmailVerifying(true);
                setShowSuccessModal(true);
            } else {
                setShowErrorModal(true);
            }
        })
    };

    const verifyOTP = () => {
        const isOTPInvalid = otp?.length === 0;
        setInvalidOTP(isOTPInvalid);
        if (!isOTPInvalid) {
            const { url, method, body, success, error } =
                apiEndpoints
                    .getApiEndpoints()
                    .user
                    .verifyEmailOTP(otp);
            sendRequest(url, method, body, success, error, response => {
                setMessage(response.message);
                if (response.success) {
                    setEmailVerified(true);
                    setShowSuccessModal(true);
                    getUserProfile();
                } else {
                    setShowErrorModal(true);
                }
            })
        }
    };

    const displayChangePasswordModal = () => {
        setShowChangePasswordModal(true);
    };

    const onChangePasswordSuccess = message => {
        setMessage(message);
        setShowSuccessModal(true);
    };

    return (
        <div onClick={closeModal}
            className={`promo-code-container billing-details-container ${show ? 'promo-code-container-open' : 'promo-code-container-closed'}`}>
            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={show}
                timeout={animationTiming}
                classNames={{
                    enter: '',
                    enterActive: 'modalOpen',
                    exit: 'modalClosed',
                    exitActive: 'modalClosed'
                }}>
                <div
                    className="position-fixed apply-promo-container apply-promo-container-modal d-flex flex-column help-modal"
                    onClick={e => e.stopPropagation()}>
                    <div className="closeModalIcon d-flex justify-content-start position-absolute close-help-modal">
                        <button className='btn border-0 bg-white' onClick={closeModal}>
                            <i className="fal fa-times font-size-15" />
                        </button>
                    </div>
                    <div>
                        <span className='edit-profile-title mb-2 '>Edit Profile</span>
                        <div className='d-flex justify-content-end pr-2 mb-2'>
                            <button className="btn edit-profile-btn" onClick={updateUserDetails}
                                disabled={disableSaveButton}>
                                Save
                            </button>
                        </div>
                        <div className='d-flex flex-column pl-2'>
                            <div className='d-flex my-2'>
                                <span className='flex-shrink-0 field-icon-holder'>
                                    <i className="fas fa-mobile-android-alt field-icon" />
                                </span>
                                <div className='flex-grow-1 silver-text pr-3'>
                                    <span className='field-label'>Mobile Phone</span>
                                    <div className='d-flex align-items-center'>
                                        {!mobilePhoneEditing ?
                                            <Aux>
                                                <span>
                                                    {userProfile?.mobile.number}
                                                </span>
                                                {userProfile?.mobile?.is_verified ?
                                                    <img src={require('../../assets/images/verified.png')}
                                                        alt="verified" title={'Mobile Number Verified'}
                                                        className='verified-icon ml-4' /> : null}
                                            </Aux> :
                                            <div className="form-group mb-1">
                                                <input type="number" className="form-control"
                                                    placeholder="Enter Mobile Number"
                                                    onChange={e => setMobileNumber(e?.target?.value)}
                                                    value={mobileNumber} />
                                                <small
                                                    className={`form-text ml-2 text-danger ${invalidMobileNumber ? 'visible' : 'hidden'}`}>
                                                    Mobile Number is required.
                                                </small>
                                            </div>}
                                    </div>
                                </div>
                            </div>
                            <div className="divider" />

                            <div className='d-flex my-2'>
                                <span className='flex-shrink-0 field-icon-holder'>
                                    <i className="fas fa-user field-icon" />
                                </span>
                                <div className='flex-grow-1 silver-text pr-3'>
                                    <span className='field-label'>First Name</span>
                                    <div className='d-flex justify-content-between align-items-center'>
                                        {firstNameEditing ?
                                            <div className="form-group mb-1">
                                                <input type="text" className="form-control"
                                                    placeholder="Enter First Name"
                                                    onChange={e => setFirstName(e?.target?.value)}
                                                    value={firstName} />
                                                <small
                                                    className={`form-text ml-2 text-danger ${invalidFirstName ? 'visible' : 'hidden'}`}>
                                                    First name is required.
                                                </small>
                                            </div> : <Aux>
                                                <span>
                                                    {userProfile?.first_name}
                                                </span>
                                                <button className="btn btn-light edit-field-btn"
                                                    onClick={() => setFirstNameEditing(true)}>
                                                    <i className="fal fa-pen font-size-15" />
                                                </button>
                                            </Aux>}
                                    </div>
                                </div>
                            </div>
                            <div className="divider" />

                            <div className='d-flex my-2'>
                                <span className='flex-shrink-0 field-icon-holder'>
                                    <i className="fas fa-user field-icon" />
                                </span>
                                <div className='flex-grow-1 silver-text pr-3'>
                                    <span className='field-label'>Last Name</span>
                                    <div className='d-flex justify-content-between align-items-center'>
                                        {lastNameEditing ?
                                            <div className="form-group mb-1">
                                                <input type="text" className="form-control"
                                                    placeholder="Enter Last Name"
                                                    onChange={e => setLastName(e?.target?.value)}
                                                    value={lastName} />
                                                <small
                                                    className={`form-text ml-2 text-danger ${invalidLastName ? 'visible' : 'hidden'}`}>
                                                    Last name is required.
                                                </small>
                                            </div> :
                                            <Aux>
                                                <span>
                                                    {userProfile?.last_name}
                                                </span>
                                                <button className="btn btn-light edit-field-btn"
                                                    onClick={() => setLastNameEditing(true)}>
                                                    <i className="fal fa-pen font-size-15" />
                                                </button>
                                            </Aux>}
                                    </div>
                                </div>
                            </div>
                            <div className="divider" />

                            <div className='d-flex my-2'>
                                <span className='flex-shrink-0 field-icon-holder'>
                                    <i className="fal fa-envelope field-icon" />
                                </span>
                                <div className='silver-text pr-3 flex-grow-1'>
                                    <span className='field-label'>Email Id</span>
                                    <div className='d-flex justify-content-between align-items-center'>
                                        {
                                            emailEditing ?
                                                <div className="form-group mb-1">
                                                    <input type="text" className="form-control"
                                                        placeholder="Enter Last Name"
                                                        onChange={e => setEmail(e?.target?.value)}
                                                        value={email} />
                                                    <small
                                                        className={`form-text ml-2 text-danger ${invalidEmail ? 'visible' : 'hidden'}`}>
                                                        Email is required.
                                                    </small>
                                                </div> :
                                                <Aux>
                                                    <span className='email-id-label text-truncate'>
                                                        {userProfile?.email.id}
                                                    </span>
                                                    {!userProfile?.email?.is_verified && !emailVerifying ?
                                                        <button className="btn btn-light verify-email-btn"
                                                            onClick={sendEmailOTP}>Verify
                                                        </button> : null}
                                                    {userProfile?.email?.is_verified ?
                                                        <img src={require('../../assets/images/verified.png')}
                                                            alt="verified"
                                                            title={'Email Verified'}
                                                            className='verified-icon' /> : null}
                                                    <button className="btn btn-light edit-field-btn"
                                                        onClick={() => setEmailEditing(true)}>
                                                        <i className="fal fa-pen font-size-15" />
                                                    </button>
                                                </Aux>
                                        }
                                    </div>
                                </div>
                            </div>
                            {emailVerifying && !emailVerified ?
                                <div className='d-flex justify-content-center align-items-start'>
                                    <div className="form-group mb-0 width-170px">
                                        <input type="number" className="form-control otp-input"
                                            placeholder="OTP"
                                            onChange={e => setOtp(e?.target?.value)}
                                            value={otp} />
                                        <small
                                            className={`form-text ml-2 text-danger ${invalidOTP ? 'visible' : 'hidden'}`}>
                                            Please enter valid otp code.
                                        </small>
                                    </div>
                                    <button className="btn btn-light ml-2 verify-email-btn" onClick={verifyOTP}>Verify
                                    </button>
                                </div> : null}
                            <div className="divider" />

                            <div className='d-flex my-2'>
                                <span className='flex-shrink-0 field-icon-holder'>
                                    <i className="fal fa-key field-icon" />
                                </span>
                                <div className='flex-grow-1 silver-text pr-3'>
                                    <button className="btn btn-light verify-email-btn my-2"
                                        onClick={displayChangePasswordModal}>Change Password
                                    </button>
                                </div>
                            </div>
                            <div className="divider" />
                        </div>
                    </div>
                    {isLoading ? <RequestSpinner /> : null}
                    <SuccessModal show={showSuccessModal} clickBackdrop={() => setShowSuccessModal(false)}
                        message={message} />
                    <ErrorModal show={showErrorModal} clickBackdrop={() => setShowErrorModal(false)} message={message} />
                    <ChangePasswordModal clickBackdrop={() => setShowChangePasswordModal(false)}
                        show={showChangePasswordModal}
                        onChangePasswordSuccess={onChangePasswordSuccess} />
                </div>
            </CSSTransition>
        </div>
    );
};

export default EditProfile;
