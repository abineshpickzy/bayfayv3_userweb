import React, { useEffect, useState } from 'react';
import ModalWrapper from "../ModalWrapper/ModalWrapper";
import './ViewBillingModal.scss';
import { getItemsTotalPrice, getProductSumPrice } from "../../utils/productUtils";
import ApiEndpoints from "../../utils/ApiEndpoints";
import useHttp from "../../hooks/http";
import RequestSpinner from "../RequestSpinner/RequestSpinner";
import { useSelector } from "react-redux";
import Aux from "../../utils/auxilary";

const ViewBillingModal = ({ show, clickBackdrop, cartItems, categoryId }) => {
    const apiEndpoints = new ApiEndpoints();
    const { sendRequest, isLoading } = useHttp();

    const [itemsTotal, setItemsTotal] = useState(0);

    const billing = useSelector(state => state.orderReducer.billing);

    useEffect(() => {
        if (show) {
            const _itemsTotal = getItemsTotalPrice(cartItems);
            setItemsTotal(Math.round(_itemsTotal * 100) / 100);
            getBilling();
        }
    }, [show]);

    const getBilling = () => {
        const { url, method, body, success, error } =
            apiEndpoints
                .getApiEndpoints()
                .order
                .viewBilling(categoryId);
        sendRequest(url, method, body, success, error);
    };

    const renderCartItems = () => {
        return Array.from(cartItems).map(([key, item]) => (
            <div key={key} className='mb-2 d-flex'>
                <div className='d-flex flex-row justify-content-start align-items-start w-80'>
                    <div className='green-circle' />
                    <div className='text-left vb-product-qty d-flex justify-content-between pr-2 align-items-center'>
                        <span className='mr-2 text-truncate w-85'>{item.item.productInfo.product_name}</span>
                        <span className='w-15'>X {item.quantity}</span>
                    </div>
                </div>
                <div className='flex-shrink-0 w-20 text-right'>
                    ₹ {getProductSumPrice(item)}
                </div>
            </div>
        ))
    };

    return (
        <ModalWrapper show={show} clickBackdrop={clickBackdrop}>
            <div className="modal-dialog text-dark-grey" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">View Billing</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                            onClick={clickBackdrop}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body w-500px">
                        {!isLoading ?
                            <Aux>
                                <div className='p-1'>
                                    {renderCartItems()}
                                </div>
                                <div className='divider my-2' />
                                <div className='padding-left-28px'>
                                    <div className='d-flex justify-content-between'>
                                        <span className='font-italic'>Item total:</span>
                                        <span>₹ {itemsTotal}</span>
                                    </div>
                                    <div className='d-flex justify-content-between'>
                                        <span className='font-italic'>Delivery charges:</span>
                                        <span>₹ {billing?.prices?.delivery}</span>
                                    </div>
                                    <div className='d-flex justify-content-between'>
                                        <span>
                                            <span className='font-italic'>Taxes & Charges</span>
                                            <div className="btn-group dropup">
                                                <button type="button" className="btn btn-light bg-white p-0 ml-3"
                                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                    <i className="fal fa-question-circle text-secondary align-self-center cursor-pointer" />
                                                </button>
                                                <div className="dropdown-menu width-150px px-2 font-size-2">
                                                    <span className='d-flex flex-column text-secondary'>
                                                        <span className='mb-1 d-flex justify-content-between'>
                                                            <span className='flex-grow-1 line-height-initial'>Shop Packaging charge:</span>
                                                            <span
                                                                className='flex-shrink-0 text-right'>₹{billing?.prices?.packaging_price?.toFixed(2)}</span>
                                                        </span>
                                                        <span className='d-flex justify-content-between'>
                                                            <span className='flex-grow-1'>Tax: </span>
                                                            <span
                                                                className='flex-shrink-0 text-right'>₹{billing?.prices?.onlyTax?.toFixed(2)}</span>
                                                        </span>
                                                    </span>
                                                </div>
                                            </div>
                                        </span>
                                        <span>₹ {billing?.prices?.taxes?.toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className='divider my-2' />
                                <div className='d-flex justify-content-between padding-left-28px'>
                                    <span className='font-weight-bold'>To Pay</span>
                                    <span>₹ {billing?.prices?.net_price}</span>
                                </div>
                            </Aux> : <div className='loading-container' />}
                    </div>
                    <div className="modal-footer d-flex justify-content-center">
                        <button type="button" className="btn btn-light border-grey px-4" onClick={clickBackdrop}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
            {isLoading && <RequestSpinner />}
        </ModalWrapper>
    );
};

export default ViewBillingModal;
