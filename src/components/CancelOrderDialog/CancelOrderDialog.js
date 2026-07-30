import React, {useEffect, useState} from 'react';
import RequestSpinner from "../RequestSpinner/RequestSpinner";
import ModalWrapper from "../ModalWrapper/ModalWrapper";
import ApiEndpoints from "../../utils/ApiEndpoints";
import useHttp from "../../hooks/http";
import './CancelOrderDialog.scss';
import {useSelector} from "react-redux";
import {Utils} from "../../utils/Utils";
import {REMOVE_ORDER} from "../../store/actionTypes/trackOrder-actions";
import useSyncDispatch from "../../hooks/dispatch";

const CancelOrderDialog = ({show, clickBackdrop, order, showSuccessModal}) => {
    const apiEndpoints = new ApiEndpoints();
    const {sendRequest, isLoading} = useHttp();
    const [step, setStep] = useState(1);
    const {sendDispatch} = useSyncDispatch();

    const [selectedType, setSelectedType] = useState('');
    const [isSelectedTypeInvalid, setIsSelectedTypeInvalid] = useState(false);
    const [additionalMessage, setAdditionalMessage] = useState('');
    const [invalidMessage, setInvalidMessage] = useState(false);

    const cancelOrderTitles = useSelector(state => state.trackOrderReducer.cancelOrderTitles);

    useEffect(() => {
        if (show) {
            setSelectedType('');
            setAdditionalMessage('');
            setStep(1);
            setInvalidMessage(false);
            setIsSelectedTypeInvalid(false);
        }
    }, [show]);

    const cancelOrder = (toBayFayCash) => {
        if (order.is_escalated_order) {
            cancelEscalatedOrder();
        } else {
            cancelNonEscalatedOrder(toBayFayCash);
        }
    };

    const cancelNonEscalatedOrder = (toBayFayCash) => {
        const {url, method, body, success, error} =
            apiEndpoints
                .getApiEndpoints()
                .order
                .cancelOrder(order?._id, toBayFayCash, selectedType, additionalMessage);
            sendRequest(url, method, body, success, error, response => {
            sendDispatch(REMOVE_ORDER, order._id);
            if (response.success) {
                showSuccessModal(response.message);
            }
            clickBackdrop();
        });
    };

    const cancelEscalatedOrder = () => {
        const {url, method, body, success, error} =
        apiEndpoints
        .getApiEndpoints()
        .order
        .cancelEscalatedOrder(order?._id, selectedType, additionalMessage);
        sendRequest(url, method, body, success, error, response => {
                    sendDispatch(REMOVE_ORDER, order._id);
                    if (response.success) {
                        showSuccessModal(response.message);
                    }
                    clickBackdrop();
                });
    };

    const validateAndProceed = () => {
        const validType = selectedType?.toString().length > 0;
        let validMessage = true;
        if (selectedType.toString().toLowerCase() === 'other') {
            validMessage = additionalMessage?.toString().trim().length > 0;
            setInvalidMessage(!validMessage);
        }
        setIsSelectedTypeInvalid(!validType);
        if (validType && validMessage) {
            if (order?.payment_type === 1) {
                setStep(2);
            } else {
                cancelOrder(false);
            }
        }
    };

    return (
        <ModalWrapper show={show} clickBackdrop={clickBackdrop}>
            <div className="modal-dialog cancel-order-dialog" role="document">
                <div className="modal-content">
                    <div className={`modal-header ${step === 1 ? 'border-bottom' : 'no-border'}`}>
                        {step === 1 ?
                            <h5 className="modal-title color-black text-center w-100">Are you sure you want to cancel
                                this order?</h5> : null}
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                                onClick={clickBackdrop}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className={`modal-body w-500px ${step === 2 ? 'pt-0' : ''}`}>
                        {step === 1 ?
                            <div className='p-1'>
                                {cancelOrderTitles.map(title => (
                                    <div className="form-check w-100 mb-2 d-flex" key={title}>
                                        <input className="form-check-input cursor-pointer" type="radio"
                                               name="gridRadios"
                                               id={title}
                                               checked={selectedType === title}
                                               onChange={() => setSelectedType(title)}/>
                                        <label className="form-check-label ml-2 cursor-pointer" htmlFor={title}
                                               onClick={() => setSelectedType(title)}>
                                            {Utils.snakeCaseToUpperCase(title)}
                                        </label>
                                    </div>
                                ))}
                                {isSelectedTypeInvalid ?
                                    <span
                                        className='font-size-2 text-danger invalid-field d-inline-block'>Please select a reason</span> : null}
                                <textarea rows="5"
                                          className={`w-100 mt-2 additional-message`}
                                          value={additionalMessage}
                                          onChange={e => setAdditionalMessage(e.target.value)}/>
                                {invalidMessage ?
                                    <span
                                        className='font-size-2 text-danger invalid-field d-inline-block'>Please type a message</span> : null}
                            </div> : null}
                        {
                            step === 2 ?
                                <div className='d-flex flex-column step-2 px-5'>
                                    <span className='text-center refund-text'>
                                        Click below button to credit immediately in your BayFay Cash Wallet and again you can order from different shop.
                                    </span>
                                    <button className='btn btn-primary refund-bay-fay-cash-btn w-100 mt-2'
                                            onClick={() => cancelOrder(true)}>
                                        Refund to BayFay Cash
                                    </button>
                                    <span className='mt-4 text-center refund-text'>
                                        Bank transfer may take 5 to 7 business days to get credited.
                                    </span>
                                    <span className='mt-1 text-center refund-text-small'>
                                        Note: Cancellation fee may apply.
                                    </span>

                                    <button className='btn btn-outline-danger w-100 mt-2 mb-4 refund-to-bank-acc-btn'
                                            onClick={() => cancelOrder(false)}>
                                        Refund to Bank Account
                                    </button>
                                </div> : null
                        }
                    </div>
                    {step === 1 ? <div className="modal-footer cancel-order-footer">
                        <button type="button" className="btn btn-light" data-dismiss="modal"
                                onClick={clickBackdrop}>
                            No
                        </button>
                        <button type="button" className="btn btn-primary" onClick={validateAndProceed}>
                            Cancel Order
                        </button>
                    </div> : null}
                </div>
            </div>
            {isLoading && <RequestSpinner/>}
        </ModalWrapper>
    );
};

export default CancelOrderDialog;
