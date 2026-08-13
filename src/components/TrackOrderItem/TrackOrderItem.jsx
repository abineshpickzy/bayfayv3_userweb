import React, {useEffect, useState} from 'react';
import './TrackOrderItem.scss';
import img from '../../assets/images/100x100.png';
import horn from '../../assets/images/horn.png';
import map from '../../assets/images/map-icon.png';
import moment from 'moment';
import ApiEndpoints from "../../utils/ApiEndpoints";
import useHttp from "../../hooks/http";
import {fetchImage} from "../../utils/imageUtils";
import ImageLoader from "../ImageLoader/ImageLoader";
import BuzzCounter from "../BuzzCounter/BuzzCounter";
import {TrackOrderUtils} from "../../utils/TrackOrderUtils";
import {useSelector} from "react-redux";

const TrackOrderItem = ({
                            order, openDetailsModal, openHelpModal, setIsLoading, openCancelOrderModal, buzzUp,
                            openContactDialog, openItemDetails, openTrackOrderModal
                        }) => {
    const apiEndpoints = new ApiEndpoints();
    const {sendRequest} = useHttp();
    const [billingDetails, setBillingDetails] = useState(null);
    const [image, setImage] = useState(null);
    const [lastTimeBuzzed, setLastTimeBuzzed] = useState(TrackOrderUtils.getLastTimeBuzzed(order._id));

    const isGuest = useSelector(state => state.authReducer.isGuest);

    useEffect(() => {
        let isCancelled = false;
        if (isGuest === false) {
            getOrderBillingDetails(isCancelled);
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
        }
        return () => {
            isCancelled = true;
        }
    }, [isGuest]);

    const getOrderBillingDetails = () => {
        setIsLoading(true);
        const {url, method, body} = apiEndpoints.getApiEndpoints().track.details(order.store_id, order.category_id, order._id);
        sendRequest(url, method, body, null, null, (details) => {
            setIsLoading(false);
            setBillingDetails(details.data);
        });
    };

    const showContactInfo = () => {
        let content = `<div><span>Contact number:</span> <span>${order.shop.mobile.primary.dialing_code} ${order.shop.mobile.primary.number}</span></div>`;
        if (order?.shop?.mobile?.secondary) {
            content = content.concat(`<div><span>Contact number:</span> <span>${order.shop.mobile.secondary.dialing_code} ${order.shop.mobile.secondary.number}</span></div>`)
        }
        openContactDialog(content);
    };

    const openProductsDetails = () => {
        openItemDetails(order, billingDetails);
    };

    const onBuzz = () => {
        if (order.status !== 5) {
            if (TrackOrderUtils.checkIfCanBuzz(order._id)) {
                buzzUp(order._id);
                setLastTimeBuzzed(moment(new Date()).format('DD/MM/YYYY HH:mm:ss'));
            }
        }
    };

    const onTrackOrder = () => {
        openTrackOrderModal(order);
    };

    return (
        <div className="track-order-item d-flex flex-column justify-content-between">
            <div className="d-flex mb-1">
                <div className="d-flex flex-column align-items-center flex-shrink-0">
                    <div className='p-2'>
                        {image ? <img src={image} alt="Test" className="track-order-item-shop-image"/> :
                            <ImageLoader cssClass={'wh80px br-15px'} customSize={true}/>}
                    </div>
                    <div className='position-relative'>
                        <img src={horn} className="horn-img-size mb-2" alt="buzz" onClick={onBuzz}/>
                        {order.status !== 5 && TrackOrderUtils.checkIfCanBuzz(order._id) ? null :
                            <div className='disabled-buzz'/>}
                    </div>
                    <BuzzCounter lastTimeBuzzed={lastTimeBuzzed} orderId={order._id}/>
                </div>

                <div className="d-flex flex-column align-content-center align-content-center flex-grow-1 mt-2">
                    <span
                        className='to-shop-name'>{billingDetails && billingDetails.shop.name}</span>
                    <span className="to-shop-address">
                        {billingDetails && billingDetails.shop.address}
                    </span>
                    <div className='d-flex pl-3 mt-2 font-size-2 silver-text'>
                        <div className='d-flex flex-column'>
                            <span className='mb-1 text-right mr-2 font-weight-bold'>Order id:</span>
                            <span className='mb-1 text-right mr-2'>Order placed on:</span>
                            <span className='mb-1 text-right mr-2 font-italic'>Order Status:</span>
                        </div>
                        <div className='d-flex flex-column'>
                            <span className='mb-1 font-weight-bold'>{order.order_id}</span>
                            <span className='mb-1'>{moment(order.date).format('ddd, MMM DD, YYYY, HH:mm A')}</span>
                            <span className='mb-1 order-status-color font-italic'>
                                {order.status === 1 ? 'New Order' : ''}
                                {order.status === 2 ? 'Packaging' : ''}
                                {order.status === 3 ? 'Dispatched' : ''}
                                {order.status === 4 ? 'Shipping' : ''}
                                {order.status === 5 ? 'Delivered' : ''}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="d-flex flex-column align-items-end justify-content-between flex-shrink-0 mt-2 px-3">
                    <span
                        className="font-weight-bold font-size-3 silver-text pr-4 total-paid-label">
{ (billingDetails?.order?.payment_type === 2 && billingDetails?.order?.is_escalated_order === true) ? ('Total Paid: ') : ((billingDetails?.order?.payment_type === 2 && billingDetails?.order?.status != 6) ? 'Amount to Pay:' : 'Total Paid: ') }

                        ₹ {(billingDetails?.order?.prices?.net_price + ((billingDetails?.order?.prices?.delivery) ? billingDetails.order.prices.delivery : 0)) ? (billingDetails.order.prices.net_price + ((billingDetails?.order?.prices?.delivery) ? billingDetails.order.prices.delivery : 0) - ((billingDetails?.order?.offer.offer_type === 2) ? billingDetails.order.offer.offerAmount : 0)).toFixed(2) : '0.00'}</span>
                    <span className="cursor-pointer d-flex align-items-center" onClick={openProductsDetails}>
                        <span className="track-order-blue mr-2 font-size-3 font-weight-bold"> Products </span> <i
                        className="far fa-chevron-right right-arrow-color"/>
                    </span>
                    <span className="cursor-pointer d-flex align-items-center" onClick={() => {
                        openDetailsModal({
                            ...billingDetails,
                            shopLocation: order.shop_location
                        })
                    }}>
                        <span className="track-order-blue mr-2 font-size-3 font-weight-bold"> Billing details </span> <i
                        className="far fa-chevron-right right-arrow-color"/>
                    </span>

                    {order.shop_location?.coordinates ? (
                        <a href={`https://www.google.com/maps/dir/?api=1&destination=${order.shop_location.coordinates[1]},${order.shop_location.coordinates[0]}`}
                            target="_blank" rel='noreferrer'>
                            <img src={map} className="map-img-size cursor-pointer ml-4" />
                        </a>
                    ) : null}
                </div>
            </div>

            <div className="divider w-70 m-auto custom-divider-bg"/>

            <div className="d-flex justify-content-center my-3 w-100 track-order-buttons">
                <button className="btn btn-outline-primary px-3 py-1 mx-3 contact-shop-btn" onClick={showContactInfo}>
                    Contact Shop
                </button>

                <button className="btn color-white font-weight-bold px-2 py-1 mx-3 help-btn"
                        onClick={() => openHelpModal(order)}>
                    Help
                </button>

                {order.status < 5 ? (
                    <button className="btn btn-outline-primary px-3 py-1 mx-3 "
                            onClick={onTrackOrder}>
                        Track Order
                    </button>
                ) : null}

                {order.status !== 5 ? <button className="btn btn-outline-danger py-1 mx-3 cancel-order-btn"
                    onClick={() => openCancelOrderModal(order)}>
                    Cancel Order
                </button> : null}
            </div>
        </div>
    );
};
export default TrackOrderItem;