import React, { useEffect, useState } from 'react';
import Aux from "../../utils/auxilary";

const OtpVerification = ({ show, clickBackdrop, onLogin, phoneNumber, resendOTP, onPrevious }) => {

    const [otpCode, setOtpCode] = useState(null);
    const [invalidCode, setInvalidCode] = useState(false);

    useEffect(() => {
        if (show) {
            setOtpCode('');
        }
    }, [show]);

    const setCode = event => setOtpCode(event.target.value);

    const onLoginClick = () => {
        const invalidCode = !otpCode || otpCode.length !== 6;
        if (!invalidCode) {
            onLogin(otpCode);
        } else {
            setInvalidCode(true);
        }
    };

    return (
        <Aux>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Verify phone number</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                            onClick={clickBackdrop}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body w-500px">
                        <div className='text-secondary px-5'>
                            Log in using the OTP sent to {phoneNumber}
                        </div>
                        <div className="form-group mb-1 mt-2">
                            <input type="text" className="form-control" id="lastNameInput" onChange={setCode}
                                aria-describedby="lastName" placeholder="Enter 6 digit OTP" />
                            <small id="lastNameInput"
                                className={`form-text transparent-text error ${invalidCode ? 'visible' : 'hidden'}`}>
                                Invalid code.</small>
                        </div>
                        <div className='mt-3'>
                            <span className='link' onClick={resendOTP}>Resend OTP</span>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-light" data-dismiss="modal"
                            onClick={onPrevious}>Previous
                        </button>
                        <button type="button" className="btn btn-primary" onClick={onLoginClick}>Login</button>
                    </div>
                </div>
            </div>
        </Aux>
    );
};

export default OtpVerification;
