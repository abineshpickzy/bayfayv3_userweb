import React, {useEffect, useState} from 'react';
import './OrderHistoryItem.scss';
import img from "../../assets/images/100x100.png";
import ImageLoader from "../ImageLoader/ImageLoader";
import moment from "moment";
import ApiEndpoints from "../../utils/ApiEndpoints";
import useHttp from "../../hooks/http";
import {fetchImage} from "../../utils/imageUtils";

const OrderHistoryItem = ({order, openDetailsModal, setIsLoading, openItemDetails, openReviewModal}) => {
    const apiEndpoints = new ApiEndpoints();
    const {sendRequest} = useHttp();

    const [image, setImage] = useState(null);
    const [billingDetails, setBillingDetails] = useState(null);
    const [statusDate, setStatusDate] = useState(null);

    useEffect(() => {
        let isCancelled = false;
        getOrderBillingDetails();
        if (order?.shop_icon) {
            fetchImage(`/category/view/img?img=${order.shop_icon}&format=jpeg&width=300&height=300`)
                .then(response => {
                    const base64 = btoa(
                        new Uint8Array(response.data).reduce(
                            (data, byte) => data + String.fromCharCode(byte),
                            ''
                        ),
                    );
                    const imageBase64 = "data:;base64," + base64;
                    !isCancelled && setImage(imageBase64);
                })
                .catch(err => console.log(err));
        }

        return () => {
            isCancelled = true;
        }
    }, []);

    const openProductsDetails = () => {
        openItemDetails(order, billingDetails);
    };

    const getOrderBillingDetails = () => {
        setIsLoading(true);
        const {url, method, body} = apiEndpoints.getApiEndpoints().ordersHistory.details(order.store_id, order.category_id, order._id);
        sendRequest(url, method, body, null, null, (details) => {
            setIsLoading(false);
            setBillingDetails(details.data);
        }, () => setIsLoading(false));
    };

    useEffect(() => {
        if (billingDetails && statusDate === null) {
            switch (order.status) {
                case 1:
                    return setStatusDate(billingDetails.order?.ordered);
                case 2:
                    return setStatusDate(billingDetails.order?.accepted);
                case 3:
                    return setStatusDate(billingDetails.order?.ready_to_ship);
                case 4:
                    return setStatusDate(billingDetails.order?.shipping);
                case 5:
                    return setStatusDate(billingDetails.order?.delivered);
                case 6:
                    return setStatusDate(billingDetails.order?.verified);
                case 7:
                    return setStatusDate(billingDetails.order?.cancelled);
                case 8:
                    return setStatusDate(billingDetails.order?.rejected);
                case 9:
                    return setStatusDate(billingDetails.order?.denied);
                default:
                    return setStatusDate(undefined);
            }
        }
    }, [billingDetails]);

    const getDiff = (replacementDate) => {
        const r = moment(replacementDate);
        const d = moment(new Date());
        const diff = r.diff(d, "days");
        return diff;
    };

    return (
        <div className="track-order-item d-flex flex-column justify-content-between">
            <div className="d-flex mb-3">
                <div className="d-flex flex-column align-items-center flex-shrink-0">
                    <div className='p-2'>
                        {image ? <img src={image} alt="Test" className="track-order-item-shop-image"/> :
                            <ImageLoader cssClass={'wh80px br-15px'} customSize={true}/>}
                    </div>
                </div>

                <div className="d-flex flex-column align-content-center align-content-center flex-grow-1 mt-2">
                    <span
                        className='to-shop-name'>{billingDetails?.shop?.name}</span>
                    <span className="to-shop-address">
                        {order?.shop?.address}
                    </span>
                    <div className='d-flex pl-3 mt-2 font-size-2 silver-text'>
                        <div className='d-flex flex-column'>
                            <span className='mb-1 text-right mr-2 font-weight-bold'>Order id:</span>
                            <span className='mb-1 text-right mr-2'>Order placed on:</span>
                            <span className='mb-1 text-right mr-2 font-italic'>
                                Order
                                {order.status === 1 ? ' New Order ' : ''}
                                {order.status === 2 ? ' Packaging ' : ''}
                                {order.status === 3 ? ' Dispatched ' : ''}
                                {order.status === 4 ? ' Shipping ' : ''}
                                {order.status === 5 ? ' Delivered ' : ''}
                                {order.status === 6 ? ' Verified ' : ''}
                                {order.status === 7 ? ' Cancelled ' : ''}
                                {order.status === 8 ? ' Rejected ' : ''}
                                {order.status === 9 ? ' Denied ' : ''}
                                on:
                            </span>
                        </div>
                        <div className='d-flex flex-column'>
                            <span className='mb-1 font-weight-bold'>
                                #{order.order_id}
                                {order.status === 7 || order.status === 9 ? <span className='cancelled-order'>( Cancelled )</span> : null}
                            </span>
                            <span className='mb-1'>{moment(order.date).format('ddd, MMM DD, YYYY, HH:mm A')}</span>
                            <span
                                className={`mb-1 font-italic ${order.status === 7 ? 'cancelled-date' : 'delivered-date'}`}>
                                {moment(statusDate?.toString()).format('ddd, MMM DD, YYYY, HH:mm A')}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="d-flex flex-column align-items-end justify-content-between flex-shrink-0 mt-2 px-3">
                    <span
                        className="font-weight-bold font-size-3 silver-text pr-4 total-paid-label">
                        Total Paid: ₹ {order?.amount?.toFixed(2)}</span>
                    <span className="cursor-pointer d-flex align-items-center" onClick={openProductsDetails}>
                        <span className="track-order-blue mr-2 font-size-3 font-weight-bold"> Products </span> <i
                        className="far fa-chevron-right right-arrow-color"/>
                    </span>
                    <span className="cursor-pointer d-flex align-items-center" onClick={() => {
                        openDetailsModal({
                            ...billingDetails,
                            shopLocation: order?.shop.address
                        })
                    }}>
                        <span className="track-order-blue mr-2 font-size-3 font-weight-bold"> Billing details </span> <i
                        className="far fa-chevron-right right-arrow-color"/>
                    </span>
                    <span className='font-size-3 silver-text'>
                       <span className='font-italic mr-2'>Products Count:</span>
                       <span className='font-weight-bold'>{billingDetails?.products.length}</span>
                   </span>
                </div>
            </div>

            <div className="divider w-70 m-auto custom-divider-bg"/>

            <div className='w-100 d-flex font-size-3 py-2 align-items-center'>
                <span className='replacement-label'>Replacement</span>
                {(order.status === 6 || order.status === 5) && getDiff(order.shop.replacement) > 0 ? <span
                        className='replacement-date'>{getDiff(order.shop.replacement)} more day(s) left</span> :
                    <span className='silver-text'>N/A</span>}
                {order.status === 6 && getDiff(order.shop.replacement) > 0 ?
                    <button className="btn btn-primary write-store-review-btn"
                            onClick={() => openReviewModal({...order, isDirect: true})}>Write Store Review</button> : null}
            </div>
        </div>
    );
};

export default OrderHistoryItem;
