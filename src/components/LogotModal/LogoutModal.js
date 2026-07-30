import React from 'react';
import ModalWrapper from "../ModalWrapper/ModalWrapper";
import RequestSpinner from "../RequestSpinner/RequestSpinner";
import ApiEndpoints from "../../utils/ApiEndpoints";
import useHttp from "../../hooks/http";
import CartUtils from "../../utils/CartUtils";
import {LocationUtils} from "../../utils/LocationUtils";
import history from "../../utils/history";
import useSyncDispatch from "../../hooks/dispatch";
import {CLEAR_USER_PROFILE} from "../../store/actionTypes/auth-actions";

const LogoutModal = ({show, clickBackdrop}) => {
    const apiEndpoints = new ApiEndpoints();
    const {sendRequest, isLoading} = useHttp();
    const {sendDispatch} = useSyncDispatch();

    const logout = () => {
        const {url, method, success, error} = apiEndpoints.getApiEndpoints().logout.logout();
        sendRequest(url, method, null, success, error, () => {
            clickBackdrop();
            CartUtils.setNumberOfItems(0);
            CartUtils.removeMostRecentAddresses();
            CartUtils.removeShopsIds();
            CartUtils.removeMostRecentShop();
            LocationUtils.clearUserSavedAddressAndType();
            sendDispatch(CLEAR_USER_PROFILE);
            history.push('/home');
        });
    };

    return (
        <ModalWrapper show={show} clickBackdrop={clickBackdrop}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Logout</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                                onClick={clickBackdrop}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body w-500px">
                        <h4>Are you sure you want to logout?</h4>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-light" data-dismiss="modal"
                                onClick={clickBackdrop}>Cancel
                        </button>
                        <button type="button" className="btn btn-primary" onClick={logout}>Logout</button>
                        {isLoading && <RequestSpinner/>}
                    </div>
                </div>
            </div>
        </ModalWrapper>
    );
};

export default LogoutModal;
