import React, {useEffect, useState} from 'react';
import './ChangePasswordModal.scss';
import ModalWrapper from "../ModalWrapper/ModalWrapper";
import ApiEndpoints from "../../utils/ApiEndpoints";
import useHttp from "../../hooks/http";
import RequestSpinner from "../RequestSpinner/RequestSpinner";

const md5 = require("md5");

const ChangePasswordModal = ({show, clickBackdrop, onChangePasswordSuccess}) => {
    const apiEndpoints = new ApiEndpoints();
    const {sendRequest, isLoading} = useHttp();

    const [oldPassword, setOldPassword] = useState('');
    const [invalidOldPassword, setInvalidOldPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [invalidNewPassword, setInvalidNewPassword] = useState(false);

    useEffect(() => {
        if (show) {
            setNewPassword('');
            setOldPassword('');
            setInvalidNewPassword(false);
            setInvalidOldPassword(false);
        }
    }, [show]);

    const changePassword = () => {
        const isOldPasswordValid = oldPassword?.length > 0;
        const isNewPasswordValid = newPassword?.length > 0;
        setInvalidNewPassword(!isNewPasswordValid);
        setInvalidOldPassword(!isOldPasswordValid);
        if (isOldPasswordValid && isNewPasswordValid) {
            const {url, method, body, success, error} =
                apiEndpoints
                    .getApiEndpoints()
                    .user
                    .changePassword(md5(oldPassword), md5(newPassword));
            sendRequest(url, method, body, success, error, response => {
                if (response.success) {
                    clickBackdrop();
                    onChangePasswordSuccess(response.message);
                }
            })
        }
    };

    return (
        <ModalWrapper show={show} clickBackdrop={clickBackdrop} showFirst={true}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">
                            Change Password
                        </h5>
                        <button type="button" className="close" aria-label="Close" onClick={clickBackdrop}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body text-center">
                        <span>
                            For security of your account enter your old password
                        </span>
                        <div className='d-flex flex-column mt-2'>
                            <div className="form-group mb-0">
                                <input type="password" className="form-control"
                                       placeholder="Old Password"
                                       onChange={e => setOldPassword(e?.target?.value)}
                                       value={oldPassword}/>
                                {invalidOldPassword ? <small
                                    className='form-text ml-2 text-danger text-left'>
                                    Old Password is required.
                                </small> : null}
                            </div>
                            <div className="form-group mb-0 mt-2">
                                <input type="password" className="form-control"
                                       placeholder="New Password"
                                       onChange={e => setNewPassword(e?.target?.value)}
                                       value={newPassword}/>
                                {invalidNewPassword ? <small
                                    className='form-text ml-2 text-danger text-left'>
                                    New Password is required.
                                </small> : null}
                            </div>
                        </div>

                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-light" onClick={clickBackdrop}>Cancel</button>
                        <button type="button" className="btn btn-primary" onClick={changePassword}>Save</button>
                    </div>
                </div>
            </div>
            {isLoading && <RequestSpinner/>}
        </ModalWrapper>
    );
};

export default ChangePasswordModal;
