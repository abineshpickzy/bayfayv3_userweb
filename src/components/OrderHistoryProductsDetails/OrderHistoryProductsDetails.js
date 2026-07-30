import React, {useEffect, useState} from 'react';
import './OrderHistoryProductsDetails.scss';
import {fetchImage} from "../../utils/imageUtils";
import img from "../../assets/images/100x100.png";
import ImageLoader from "../ImageLoader/ImageLoader";
import moment from "moment";
import PurchaseHistoryProductItem from "../PurchaseHistoryProductItem/PurchaseHistoryProductItem";
import ProductReviewDialog from "../ProductReviewDialog/ProductReviewDialog";
import SuccessModal from "../SuccessModal/SuccessModal";
import ApiEndpoints from "../../utils/ApiEndpoints";
import useHttp from "../../hooks/http";

const OrderHistoryProductsDetails = ({order, goBack, productsDetails, openDetailsModal, updateProductStatus, verifyOrder}) => {
    const apiEndpoints = new ApiEndpoints();
    const {sendRequest} = useHttp();

    const [image, setImage] = useState(null);
    const [statusDate, setStatusDate] = useState(null);
    const [product, setProduct] = useState(null);
    const [showProductReviewModal, setShowProductReviewModal] = useState(false);
    const [message, setMessage] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [loadingFailed, setLoadingFailed] = useState(false);

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

    useEffect(() => {
        if (productsDetails && statusDate === null) {
            switch (order.status) {
                case 5:
                    return setStatusDate(productsDetails.order?.delivered);
                case 6:
                    return setStatusDate(productsDetails.order?.accepted);
                case 7:
                    return setStatusDate(productsDetails.order?.cancelled);
                case 8:
                    return setStatusDate(productsDetails.order?.rejected);
                case 9:
                    return setStatusDate(productsDetails.order?.denied);
                default:
                    return setStatusDate(undefined);
            }
        }
    }, [productsDetails]);

    const fetchShopReviewTitles = (product) => {
        const {url, method, body, success, error} =
            apiEndpoints
                .getApiEndpoints()
                .ordersHistory
                .productReviewTitles(order.category_id, order._id, product.id);
        sendRequest(url, method, body, success, error);
    };

    const writeProductReview = p => {
        fetchShopReviewTitles(p);
        setProduct(p);
        setShowProductReviewModal(true);
    };

    const getProductsDetails = () => {
        const {url, method, body, success, error} =
            apiEndpoints
                .getApiEndpoints()
                .ordersHistory
                .details(order.store_id, order.category_id, order._id);
        sendRequest(url, method, body, success, error, null, () => setLoadingFailed(true));
    };

    const showSuccessMessage = msg => {
        setMessage(msg);
        setShowSuccessModal(true);
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
                    className='to-shop-name pt-1'>{productsDetails && productsDetails.shop.name}</span>
                    <span className="to-shop-address">
                        {productsDetails && productsDetails.shop.address}
                    </span>
                    <div className='d-flex mt-1 font-size-2 silver-text flex-column'>
                        <span className='mb-1 font-weight-bold'>
                            #{order.order_id} | ₹
                            {(productsDetails?.order?.prices?.net_price + ((productsDetails?.order?.prices?.delivery) ? productsDetails.order.prices.delivery : 0)) ? (productsDetails.order.prices.net_price + ((productsDetails?.order?.prices?.delivery) ? productsDetails.order.prices.delivery : 0) - ((productsDetails?.order?.offer.offer_type === 2) ? productsDetails.order.offer.offerAmount : 0)).toFixed(2) : '0.00'}
                        </span>
                        <span className={`mb-1 font-italic ${order.status === 7 ? 'cancelled-date' : 'color-purple'}`}>
                            <span className='mr-2 silver-text'>Order status:</span>
                            {order.status === 1 ? 'New Order' : ''}
                            {order.status === 2 ? 'Packaging' : ''}
                            {order.status === 3 ? 'Dispatched' : ''}
                            {order.status === 4 ? 'Shipping' : ''}
                            {order.status === 5 ? 'Delivered' : ''}
                            {order.status === 6 ? 'Verified' : ''}
                            {order.status === 7 ? 'Cancelled' : ''}
                            {order.status === 8 ? 'Rejected' : ''}
                            {order.status === 9 ? 'Denied' : ''}
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
                            ...productsDetails,
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
                {(!productsDetails && !loadingFailed) ?
                    <div className='w-100 h-100 d-flex align-items-center justify-content-center'>
                        <div className="spinner-border text-dark" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div> :
                    loadingFailed ?
                    <div className='w-100 d-flex align-items-center justify-content-center font-size-3 text-secondary'>
                        Unable to load products
                    </div> :
                    productsDetails.products?.map(p => (
                        <PurchaseHistoryProductItem key={p.id} product={p} order={order}
                                                    verifyOrder={verifyOrder}
                                                    writeProductReview={writeProductReview}
                                                    getProductsDetails={getProductsDetails}
                                                    deliveredDate={productsDetails.order?.delivered}
                                                    updateProductStatus={updateProductStatus}/>
                    ))}

            </div>
            <ProductReviewDialog show={showProductReviewModal} clickBackdrop={() => setShowProductReviewModal(false)}
                                 order={order} product={product} showSuccessMessage={showSuccessMessage} isEdit={true}/>
            <SuccessModal show={showSuccessModal} clickBackdrop={() => setShowSuccessModal(false)} message={message}/>
        </div>
    );
};

export default OrderHistoryProductsDetails;
