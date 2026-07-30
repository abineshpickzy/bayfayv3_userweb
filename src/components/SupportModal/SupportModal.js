import React, {useEffect, useState} from 'react';
import ModalWrapper from "../ModalWrapper/ModalWrapper";
import {EMAIL_REGEX} from "../../utils/regEx";
import ApiEndpoints from "../../utils/ApiEndpoints";
import useHttp from "../../hooks/http";
import Loader from "../Loader/Loader";
import './SupportModal.scss';
import {API_SUCCESS, SHOW_LOGIN_MODAL} from "../../store/actionTypes/global-actions";
import useSyncDispatch from "../../hooks/dispatch";
import {useSelector} from "react-redux";

const SupportModal = ({show, clickBackdrop, withCall}) => {
    const apiEndpoints = new ApiEndpoints();
    const {sendRequest, isLoading} = useHttp();
    const {sendDispatch} = useSyncDispatch();

    const [title, setTitle] = useState('');
    const [titleInvalid, setTitleInvalid] = useState(false);
    const [email, setEmail] = useState('');
    const [emailInvalid, setEmailInvalid] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [invalidPhoneNumber, setInvalidPhoneNumber] = useState(false);
    const [message, setMessage] = useState('');
    const [invalidMessage, setInvalidMessage] = useState(false);
    const isGuest = useSelector(state => state.authReducer.isGuest);

    useEffect(() => {
        if (show) {
            setTitle('');
            setTitleInvalid(false);
            setEmail('');
            setEmailInvalid(false);
            setPhoneNumber('');
            setInvalidPhoneNumber(false);
            setMessage('');
            setInvalidMessage(false);
        }
    }, [show]);

    const send = () => {
        if (isGuest) {
            sendDispatch(SHOW_LOGIN_MODAL);
            clickBackdrop();
            return
        }
        const titleValid = title?.trim().length > 0;
        const emailValid = EMAIL_REGEX.test(email);
        const phoneValid = phoneNumber?.toString().trim().length > 0;
        const messageValid = message?.trim().length > 0;
        setInvalidMessage(!messageValid);
        setInvalidPhoneNumber(!phoneValid);
        setEmailInvalid(!emailValid);
        setTitleInvalid(!titleValid);
        if (titleValid && emailValid && phoneValid && messageValid) {
            const {url, method, body, success, error} =
                apiEndpoints
                    .getApiEndpoints()
                    .orderSupport
                    .ask(title, email, phoneNumber, message);
            sendRequest(url, method, body, success, error, response => {
                if (response.success) {
                    sendDispatch(API_SUCCESS, response.message);
                    clickBackdrop();
                }
            })
        }
    };

    return (
        <ModalWrapper show={show} clickBackdrop={clickBackdrop} showFirst={true}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header d-flex align-items-center">
                        <h5 className="modal-title text-center w-100 pl-4" id="exampleModalLabel">
                            Support
                        </h5>
                        <button type="button" className="close" aria-label="Close" onClick={clickBackdrop}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className={`modal-body w-500px pt-0 ${withCall ? 'blue-input pb-0' : ''}`}>
                        <div className="form-group mt-3">
                            <input type="text" className="form-control" placeholder="Enter title"
                                   onChange={e => setTitle(e?.target?.value)} value={title}/>
                            {titleInvalid ?
                                <small className="form-text ml-2 text-danger text-left">
                                    Title is required.
                                </small> : null}
                        </div>
                        <div className="form-group mt-3">
                            <input type="email" className="form-control" placeholder="Enter Email id"
                                   onChange={e => setEmail(e?.target?.value)} value={email}/>
                            {emailInvalid ? <small className="form-text ml-2 text-danger text-left">
                                Email is required.</small> : null}
                        </div>
                        <div className="form-group mt-3">
                            <input type="number" className="form-control" placeholder="Enter Phone Number"
                                   onChange={e => setPhoneNumber(e?.target?.value)} value={phoneNumber}/>
                            {invalidPhoneNumber ?
                                <small className="form-text ml-2 text-danger text-left">
                                    Phone number is required.</small> : null}
                        </div>
                        <textarea rows="5"
                                  className={`w-100 mt-2 additional-message border-color-9e9e9e`}
                                  value={message}
                                  onChange={e => setMessage(e.target.value)}/>
                        {invalidMessage ?
                            <span
                                className='font-size-2 text-danger invalid-field d-inline-block'>
                                Message is required.
                            </span> : null}
                        {withCall ? <span className='voice-support-message'>
                            Voice support available from 10am to 7pm
                        </span> : null}
                    </div>
                    <div
                        className={`modal-footer d-flex dropup ${withCall ? 'justify-content-between' : 'justify-content-center'}`}>
                        {withCall ?
                            <button type="button" className="btn btn-light call-btn width-150px border-radius-0"
                                    id='call-btn' data-toggle="dropdown" aria-expanded="false">
                                Call
                            </button> : null}
                        <div className="dropdown-menu width-150px px-2 font-size-3 text-center ml-5"
                             aria-labelledby="call-btn">
                            91 93614 50340
                        </div>
                        <button type="button" className="btn btn-primary send-btn width-150px border-radius-0"
                                onClick={send}>Send
                        </button>
                    </div>
                </div>
            </div>
            {isLoading ? <Loader/> : null}
        </ModalWrapper>
    );
};

export default SupportModal;
