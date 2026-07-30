import React from 'react';
import CSSTransition from "react-transition-group/CSSTransition";
import './BillingDetailsModal.scss';
import {useSelector} from "react-redux";

const animationTiming = {
    enter: 1000,
    exit: 1000
};

const BillingDetailsModal = (props) => {
    const {closeModal, show, details} = props;

    const username = useSelector(state => state.authReducer.username);

    const getProductCode = (product) => {
        return (
            <div key={product.id} className='mb-2 d-flex px-4 mt-2 font-size-3'>
                <div className='d-flex flex-row justify-content-start align-items-start w-75'>
                    <i className="fal fa-check color-green mt-1 mr-3"/>
                    <div className='text-left vb-product-qty d-flex justify-content-between pr-2 align-items-center'>
                        <span
                            className='mr-2 text-truncate w-85 track-order-black-color'>{product.product_name} | {product.unit}</span>
                        <span className='w-15 track-order-black-color'>X {product.qty}</span><i className="mt-1 mr-3"/>
                    </div>
                </div>
                <div className='flex-shrink-0 w-25 text-right silver-text flex-shrink-0'>
                    ₹ {(product.selling_price?.toFixed(2) * product.qty)}
                </div>
            </div>
        )
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
                    className="position-fixed apply-promo-container apply-promo-container-modal d-flex flex-column billing-details-modal"
                    onClick={e => e.stopPropagation()}>

                    <div className="closeModalIcon d-flex justify-content-start position-absolute">
                        <button className='btn close-apply-promo border-0 bg-white' onClick={closeModal}>
                            <i className="fal fa-times font-size-15"/>
                        </button>
                    </div>

                    <div className='d-flex mt-4'>
                        <div className="d-flex flex-column align-items-center ml-1 px-4 mt-5">
                        <span className="font-size-25 d-flex flex-column align-items-center mt-4">
                            <i className="fa fa-building track-order-blue-color"/>
                            <div className='path'>
                                <small className="small font-size-2 ml-2 path-color">
                                    {details?.order?.distance}km
                                </small>
                                {details?.order?.status === 7 ?
                                    <span className='cancelled-order billing-cancelled-order'>
                                    Cancelled by customer
                                </span> : null}
                                {details?.order?.status === 9 ?
                                    <span className='cancelled-order billing-cancelled-order'>
                                    Cancelled by BayFay Admin
                                </span> : null}
                            </div>
                            <i className="far fa-user track-order-orange-color"/>
                        </span>
                        </div>

                        <div className="d-flex flex-column align-items-start flex-grow-1 pl-4 mt-1">
                            <span className='billing-details-title'>Billing details</span>
                            <span className="font-weight-bold font-size-2 mb-2 color-gray">Order id: #{details?.order?.order_id}</span>
                            <span className="font-size-3 font-weight-bold track-order-black-color">{details?.shop?.name}</span>
                            <span className='font-size-2 silver-text'>{details?.shop?.address}</span>
                            <span
                                className=" font-size-3 font-weight-bold margin-top-80 track-order-black-color">{username}</span>
                            <span className="d-flex flex-column font-size-2 silver-text">
                                <span>{details && details.order?.address?.street}</span>
                                <span>{details && details.order?.address?.area}</span>
                                <span>{details && details.order?.address?.zipcode}</span>
                            </span>
                        </div>
                    </div>

                    <div className="container mt-3">
                        <div className="divider-dashed custom-dashed-divider-color"/>
                    </div>

                    <div className="d-flex flex-column mt-2">
                        {details?.products?.map(product => getProductCode(product))}
                    </div>

                    <div className="container my-1">
                        <div className="divider separator-9e9e9e"/>
                    </div>

                    <div className="d-flex flex-column mt-1 font-size-3">
                        <div className="d-flex align-items-start px-4 py-1 track-order-black-color">
                            <i className="fake-icon"/>
                            <span className="d-flex flex-grow-1">Item Total</span>
                            <span>₹ {details?.order?.prices ? (details.order.prices.gross_price + (details.discount_amount || 0)).toFixed(2) : '0.00'}</span>
                        </div>

                        {details?.discount_amount && details.discount_amount > 0 ?
                            <div className="d-flex align-items-start color-gray px-4 py-1">
                                <i className="fake-icon"/>
                                <span className="d-flex flex-grow-1">Total Discount</span>
                                <span>- ₹ {details && details.discount_amount?.toFixed(2)}</span>
                            </div> : null}

                        {details?.order?.prices?.delivery > 0 ?
                            <div className="d-flex align-items-start color-gray px-4 py-1">
                                <i className="fake-icon"/>
                                <span className="d-flex flex-grow-1">Delivery Fee</span>
                                <span>₹ {details && details.order.prices.delivery?.toFixed(2)}</span>
                            </div> : null}

                        {details?.order?.prices?.packaging_price > 0 || details?.order?.prices?.onlyTax > 0 ?
                            <div className="d-flex align-items-start color-gray px-4 py-1">
                                <i className="fake-icon"/>
                                <div className='d-flex flex-grow-1'>
                                    <span>Taxes & Charges</span>
                                    <div className="btn-group dropup taxes-info">
                                        <button type="button" className="btn btn-light bg-white p-0 ml-3"
                                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <i className="fal fa-question-circle text-secondary align-self-center cursor-pointer"/>
                                        </button>
                                        <div className="dropdown-menu width-150px px-2 font-size-2">
                                                <span className='d-flex flex-column text-secondary'>
                                                    {details?.order.prices.packaging_price > 0 ?
                                                        <span className='mb-1 d-flex justify-content-between'>
                                                            <span className='flex-grow-1 line-height-initial'>Shop Packaging charge:</span>
                                                            <span
                                                                className='flex-shrink-0 text-right'>₹{details?.order.prices.packaging_price?.toFixed(2)}</span>
                                                        </span> : null}
                                                    {details?.order.prices.onlyTax > 0 ?
                                                        <span className='d-flex justify-content-between'>
                                                            <span className='flex-grow-1'>Tax: </span>
                                                            <span
                                                                className='flex-shrink-0 text-right'>₹{details?.order.prices.onlyTax?.toFixed(2)}</span>
                                                        </span> : null}
                                                </span>
                                        </div>
                                    </div>
                                </div>
                                <span>₹ {details?.order?.prices ? ((details.order.prices.packaging_price || 0) + (details.order.prices.onlyTax || 0))?.toFixed(2) : '0.00'}</span>
                            </div> : null}
                    </div>


                    <div className="container">
                        <hr className="background-black font-weight-bold"/>
                    </div>

                    <div className="d-flex flex-column mt-1 font-size-3">
                        <div className="d-flex align-items-start font-weight-bold font-size-3 px-4 py-1">
                            <i className="fake-icon"/>
                            <span className="d-flex flex-column flex-grow-1 color-black">Total Bill
                                <small className="font-size-2 color-gray">
                                    {details?.order?.payment_type === 2 ? '' : `Paid via ${details?.order?.mode_name}`}
                                </small>
                            </span>
                            <span>₹ {details?.order?.prices ? (details.order.prices.net_price + (details.order.prices.delivery || 0)).toFixed(2) : '0.00'}</span>
                        </div>

                        {details?.order?.offer?.offer_type ?
                            <div className="d-flex align-items-start font-size-3 px-4 py-1">
                                <i className="fake-icon"/>
                                <span className="d-flex flex-grow-1 color-black">
                                {details?.order?.offer?.offer_type === 1 ? 'Cashback' : null}
                                    {details?.order?.offer?.offer_type === 2 ? 'Discount' : null}
                            </span>
                                <span>{details?.order?.offer?.offer_type === 2 ? '-' : ''} ₹ {details?.order?.offer?.offerAmount}</span>
                            </div> : null}
                    </div>

                    <div className="container">
                        <hr className="background-black font-weight-bold"/>
                    </div>

                    <div className="d-flex flex-column mt-1">
                        <div className="d-flex align-items-start font-weight-bold font-size-3 px-4 py-1">
                            <i className="fake-icon color-black"/>
                            <span className="d-flex flex-grow-1">
{ (details?.order?.payment_type === 2 && details?.order?.is_escalated_order === true) ? ('Total Paid') : ((details?.order?.payment_type === 2 && details?.order?.status != 6) ? 'Amount to Pay' : 'Total Paid') }
                            </span>
                            <span>₹ {details?.order?.prices ? (details.order.prices.net_price + (details.order.prices.delivery || 0) - (details?.order?.offer?.offer_type === 2 ? (details.order.offer.offerAmount || 0) : 0)).toFixed(2) : '0.00'}</span>
                        </div>
                        <div className="d-flex align-items-start font-weight-bold font-size-6 px-4 py-1">
<span className="d-flex flex-grow-1 color-red">{ (details?.order?.payment_type === 2 && details?.order?.is_escalated_order === true) ? '( COD )Replacement / Undelivered' : "" }{ (details?.order?.payment_type === 1 && details?.order?.is_escalated_order === true) ? 'Replacement / Undelivered' : "" } </span>
                        </div>
                    </div>
                </div>
            </CSSTransition>
        </div>
    );
};
export default BillingDetailsModal;
