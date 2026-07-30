import React, {useEffect, useState} from 'react';

const ForgotPassword = ({show, resendOTP, clickBackdrop, phoneNumber, onPrevious, onChangePassword}) => {
    const [otpCode, setOtpCode] = useState(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [invalidPassword, setInvalidPassword] = useState(false);
    const [invalidConfirmPassword, setInvalidConfirmPassword] = useState({
        required: false,
        notMatch: false
    });

    const [invalidCode, setInvalidCode] = useState(false);

    useEffect(() => {
        if (show) {
            setOtpCode('');
        }
    }, [show]);

    const setCode = event => setOtpCode(event.target.value);
    const onConfirmPasswordInputChange = event => setConfirmPassword(event.target.value);
    const onPasswordInputChange = event => setPassword(event.target.value);

    const onPasswordChange = () => {
        const invalidPassword = !password || password.length === 0;
        const invalidConfirmPasswordRequired = !confirmPassword || confirmPassword.length === 0;
        const invalidConfirmPasswordNotMatch = password !== confirmPassword;
        const invalidCode = !otpCode || otpCode.length !== 6;
        setInvalidCode(invalidCode);
        setInvalidPassword(invalidPassword);
        setInvalidConfirmPassword({
            required: invalidConfirmPasswordRequired,
            notMatch: invalidConfirmPasswordNotMatch
        });
        if (!invalidPassword && !invalidConfirmPasswordRequired && !invalidConfirmPasswordNotMatch && !invalidCode) {
            onChangePassword(otpCode, password);
        }
    };

    return (
        <div className="modal-dialog" role="document">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Reset Password</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                            onClick={clickBackdrop}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body w-500px">
                    <div className='text-secondary px-5'>
                        Reset password using the OTP sent to {phoneNumber}
                    </div>
                    <div className="form-group mb-1 mt-3">
                        <input type="text" className="form-control" id="lastNameInput" onChange={setCode}
                               aria-describedby="lastName" placeholder="Enter 6 digit OTP"/>
                        <small id="lastNameInput"
                               className={`form-text transparent-text error ${invalidCode ? 'visible' : 'hidden'}`}>
                            Invalid code.</small>
                    </div>
                    <div className='mt-2'>
                        <span className='link' onClick={resendOTP}>Resend OTP</span>
                    </div>
                    <input type="password" id="inputPassword5" className="form-control mt-3"
                           onChange={onPasswordInputChange}
                           aria-describedby="passwordHelpBlock" placeholder='Password'/>
                    <small id="inputPassword5"
                           className={`mb-1 form-text transparent-text error ${invalidPassword ? 'visible' : 'hidden'}`}>
                        Password is required.
                    </small>
                    <input type="password" id="inputPassword5" className="form-control mt-2"
                           onChange={onConfirmPasswordInputChange}
                           aria-describedby="passwordHelpBlock" placeholder='Confirm Password'/>
                    <small id="inputPassword5"
                           className={`mb-1 form-text transparent-text error 
                           ${invalidConfirmPassword.required ? 'visible' : 'hidden'}
                           ${!invalidConfirmPassword.required && invalidConfirmPassword.notMatch} ? 'd-none' : 'd-block'`}>
                        Password is required.
                    </small>
                    <small id="inputPassword5"
                           className={`mb-1 form-text transparent-text error 
                           ${invalidConfirmPassword.notMatch && !invalidConfirmPassword.required ? 'visible' : 'hidden'}`}>
                        Password not match.
                    </small>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-light" data-dismiss="modal"
                            onClick={onPrevious}>Previous
                    </button>
                    <button type="button" className="btn btn-primary" onClick={onPasswordChange}>Done</button>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
