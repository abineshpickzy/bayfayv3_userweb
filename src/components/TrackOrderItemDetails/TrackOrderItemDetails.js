import React, {useEffect, useState} from 'react';
import ApiEndpoints from "../../utils/ApiEndpoints";
import useHttp from "../../hooks/http";
import {useSelector} from "react-redux";
import {fetchImage} from "../../utils/imageUtils";
import './TrackOrderItemDetails.scss';
import img from "../../assets/images/100x100.png";
import ImageLoader from "../ImageLoader/ImageLoader";
import moment from "moment";
import TrackProductItem from "../TrackProductItem/TrackProductItem";

const TrackOrderItemDetails = ({order, goBack, billingDetails, openDetailsModal, updateProductStatus}) => {
    const apiEndpoints = new ApiEndpoints();
    const {sendRequest} = useHttp();

    const [image, setImage] = useState(null);
    const [statusDate, setStatusDate] = useState(null);

    const productsDetails = useSelector(state => state.trackOrderReducer.productsDetails);

    useEffect(() => {
        if (productsDetails && statusDate === null) {
            switch (order.status) {
                case 1:
                    return setStatusDate(productsDetails.order?.ordered);
                case 2:
                    return setStatusDate(productsDetails.order?.accepted);
                case 3:
                    return setStatusDate(productsDetails.order?.ready_to_ship);
                case 4:
                    return setStatusDate(productsDetails.order?.shipping);
                case 5:
                    return setStatusDate(productsDetails.order?.delivered);
                default:
                    return setStatusDate(undefined);
            }
        }
    }, [productsDetails]);

    useEffect(() => {
        let isCancelled = false;
        getProductsDetails();
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

    const getProductsDetails = () => {
        const {url, method, body, success, error} =
            apiEndpoints
                .getApiEndpoints()
                .track
                .products(order.category_id, order.store_id, order._id);
        sendRequest(url, method, body, success, error)
    };

    return (
        <div className='track-products-details'>
            <div className='p-2'>
                <button className="btn btn-light go-back-btn" onClick={goBack}>
                    <i className="fal fa-long-arrow-left font-size-25 color-gray"/>
                </button>
            </div>
            <div className="d-flex my-1">
                <div className="d-flex flex-column align-items-center flex-shrink-0">
                    <div className='p-2'>
                        {image ? <img src={image} alt="Test" className="track-order-item-shop-image"/> :
                            <ImageLoader cssClass={'wh80px br-15px'} customSize={true}/>}
                    </div>
                </div>
                <div className="d-flex flex-column align-content-center align-content-center flex-grow-1">
                <span
                    className='to-shop-name pt-1'>{billingDetails && billingDetails.shop.name}</span>
                    <span className="to-shop-address">
                        {billingDetails && billingDetails.shop.address}
                    </span>
                    <div className='d-flex mt-1 font-size-2 silver-text flex-column'>
                        <span className='mb-1 font-weight-bold'>
                            #{order.order_id} | ₹
                            {(billingDetails?.order?.prices?.net_price + ((billingDetails?.order?.prices?.delivery) ? billingDetails.order.prices.delivery : 0)) ? (billingDetails.order.prices.net_price + ((billingDetails?.order?.prices?.delivery) ? billingDetails.order.prices.delivery : 0) - ((billingDetails?.order?.offer.offer_type === 2) ? billingDetails.order.offer.offerAmount : 0)).toFixed(2) : '0.00'}
                        </span>
                        <span className='mb-1 color-purple font-italic'>
                            <span className='mr-2 silver-text'>Order status:</span>
                            {order.status === 1 ? 'New Order' : ''}
                            {order.status === 2 ? 'Packaging' : ''}
                            {order.status === 3 ? 'Dispatched' : ''}
                            {order.status === 4 ? 'Shipping' : ''}
                            {order.status === 5 ? 'Delivered' : ''}
                            <span>
                                {statusDate ? ` | ${moment(statusDate?.toString()).format('ddd, MMM DD, YYYY, HH:mm A')}` : ''}
                            </span>
                            </span>
                    </div>
                </div>
                <div className="d-flex flex-column align-items-end flex-shrink-0 mt-2 px-3">
                    <span
                        className="font-size-3 silver-text">
                        {moment(order.date).format('ddd, MMM DD, YYYY, HH:mm A')}
                    </span>
                    <span className="cursor-pointer d-flex align-items-center mt-3" onClick={() => {
                        openDetailsModal({
                            ...billingDetails,
                            shopLocation: order.shop_location
                        })
                    }}>
                        <span className="track-order-blue mr-2 font-size-3 font-weight-bold"> Billing details </span> <i
                        className="far fa-chevron-right text-secondary"/>
                    </span>
                </div>
            </div>

            <div className='divider-dashed my-3 divider-dashed-757575'/>

            <div className='track-products-scroll-container'>
                {!productsDetails ?
                    <div className='w-100 h-100 d-flex align-items-center justify-content-center'>
                        <div className="spinner-border text-dark" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div> :
                    productsDetails.products?.map(p => (
                        <TrackProductItem key={p.id} product={p} order={order}
                                          updateProductStatus={updateProductStatus}/>
                    ))}
            </div>
        </div>
    );
};

export default TrackOrderItemDetails;
