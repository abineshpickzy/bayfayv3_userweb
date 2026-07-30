import React, {useState} from 'react';
import {phoneNumberPrefix} from "../../utils/constants";
import {EMAIL_REGEX} from "../../utils/regEx";

const SignUp = ({clickBackdrop, onNext}) => {
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState(phoneNumberPrefix);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({
        invalidFirstName: false,
        invalidLastName: false,
        invalidPassword: false,
        invalidPhoneNumber: false,
        invalidEmail: false,
    });

    const onPhoneNumberChange = event => setPhoneNumber(`${event.target.value}`);
    const onPasswordChange = event => setPassword(event.target.value);
    const onFirstNameChange = event => setFirstName(event.target.value);
    const onLastNameChange = event => setLastName(event.target.value);
    const onEmailChange = event => setEmail(event.target.value);

    const validateFormAndProceed = () => {
        const invalidFirstName = !firstName || firstName.length === 0;
        const invalidLastName = !lastName || lastName.length === 0;
        const invalidPassword = !password || password.length === 0;
        const invalidPhoneNumber = !phoneNumber || phoneNumber.length !== 10;
        const invalidEmail = !email || !EMAIL_REGEX.test(email);
        if (!invalidFirstName && !invalidLastName && !invalidPhoneNumber && !invalidEmail && !invalidPassword) {
            onNext({
                firstName,
                lastName,
                phoneNumber,
                email,
                password
            });
        } else {
            setErrors({
                invalidFirstName,
                invalidLastName,
                invalidPassword,
                invalidPhoneNumber,
                invalidEmail,
            })
        }
    };

    return (
        <div className="modal-dialog" role="document">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Signup</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                            onClick={clickBackdrop}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body w-500px">
                    <div className='text-secondary px-5 mb-3'>
                        Enter the bellow details to create an account
                    </div>
                    <div className="form-group mb-1">
                        <input type="text" className="form-control" id="firstNameInput" onChange={onFirstNameChange}
                               aria-describedby="firstName" placeholder="First name"/>
                        <small id="firstNameInput"
                               className={`form-text transparent-text error ${errors.invalidFirstName ? 'visible' : 'hidden'}`}>First
                            name is
                            required.</small>
                    </div>
                    <div className="form-group mb-1">
                        <input type="text" className="form-control" id="lastNameInput" onChange={onLastNameChange}
                               aria-describedby="lastName" placeholder="Last name"/>
                        <small id="lastNameInput"
                               className={`form-text transparent-text error ${errors.invalidLastName ? 'visible' : 'hidden'}`}>
                            Last name is required.</small>
                    </div>
                    <div className="input-group mb-1 mr-sm-2">
                        <div className="input-group-prepend">
                            <div className="input-group-text">+91</div>
                        </div>
                        <input className="form-control" id="phoneNumber" type="number"
                               placeholder="10 digit mobile number" onChange={onPhoneNumberChange}/>
                    </div>
                    <small id="phoneNumber"
                           className={`mb-1 form-text transparent-text error ${errors.invalidPhoneNumber ? 'visible' : 'hidden'}`}>Invalid
                        phone
                        number.</small>
                    <input type="password" id="inputPassword5" className="form-control mb-1"
                           onChange={onPasswordChange}
                           aria-describedby="passwordHelpBlock" placeholder='Password'/>
                    <small id="inputPassword5"
                           className={`mb-1 form-text transparent-text error ${errors.invalidPassword ? 'visible' : 'hidden'}`}>Password
                        is required.</small>

                    <div className="form-group">
                        <input type="email" className="form-control" id="email" onChange={onEmailChange}
                               aria-describedby="email" placeholder="Email id"/>
                        <small id="phoneNumber"
                               className={`form-text transparent-text error ${errors.invalidEmail ? 'visible' : 'hidden'}`}>Invalid
                            email.</small>
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-light" data-dismiss="modal"
                            onClick={clickBackdrop}>Cancel
                    </button>
                    <button type="button" className="btn btn-primary" onClick={validateFormAndProceed}>Next</button>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
