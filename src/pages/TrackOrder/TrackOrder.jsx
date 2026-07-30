import React, {useEffect, useState} from 'react';
import NavigationMenu from "../../components/NavigationMenu/NavigationMenu";
import TrackOrderItems from "../../components/TrackOrderItems/TrackOrderItems";
import TrackOrderItemDetails from "../../components/TrackOrderItemDetails/TrackOrderItemDetails";
import BillingDetailsModal from "../../components/BillingDetailsModal/BillingDetailsModal";
import './TrackOrder.scss';
import {useSelector} from "react-redux";
import history from "../../utils/history";
import CodPaymentDialog from "../../components/CODPaymentDialog/CODPaymentDialog";
import StoreReviewDialog from "../../components/StoreReviewDialog/StoreReviewDialog";
import useHttp from "../../hooks/http";
import ApiEndpoints from "../../utils/ApiEndpoints";
import useSyncDispatch from "../../hooks/dispatch";
import {CLEAR_PRODUCTS_DETAILS, CLEAR_TRACKING_ORDERS, REMOVE_ORDER} from "../../store/actionTypes/trackOrder-actions";
import RequestSpinner from "../../components/RequestSpinner/RequestSpinner";

const ORDERS = 'ORDERS';
const ITEM_ORDER_DETAILS = 'ITEM_ORDER_DETAILS';

const TrackOrder = () => {
    const {sendRequest} = useHttp();
    const apiEndpoints = new ApiEndpoints();
    const {sendDispatch} = useSyncDispatch();

    const [activeView, setActiveView] = useState(ORDERS);
    const [order, setOrder] = useState(null);
    const [billingDetails, setBillingDetails] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [showCODPaymentModal, setShowCODPaymentModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [details, setDetails] = useState(null);
    const [productsStatuses, setProductsStatuses] = useState({});
    const [orderVerifying, setOrderVerifying] = useState(false);
    const [page, setPage] = useState(1);
    const [shouldLoadOrders, setShouldLoadOrders] = useState(false);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [loadingNextPage, setLoadingNextPage] = useState(false);

    const isGuest = useSelector(state => state.authReducer.isGuest);
    const productsDetails = useSelector(state => state.trackOrderReducer.productsDetails);
    const ordersCount = useSelector(state => state.trackOrderReducer.ordersCount);
    const ordersLoaded = useSelector(state => state.trackOrderReducer.trackOrders?.length);

    useEffect(() => {
        if (isGuest === true) {
            history.push('/home');
        } else {
            fetchReplacementTitles();
            fetchCancelOrderTitles();
            getOrdersCount();
        }
    }, [isGuest]);

    useEffect(() => {
        if (!isGuest) {
            if (page > 1) {
                setLoadingNextPage(true);
            }
            setLoadingOrders(true);
            getOrders(page);
        }
    }, [page]);

    useEffect(() => {
        if (shouldLoadOrders && !loadingOrders && ordersCount > ordersLoaded) {
            setPage(prevState => prevState + 1);
        }
    }, [shouldLoadOrders]);

    const fetchReplacementTitles = () => {
        const {url, method, body, success, error} =
            apiEndpoints
                .getApiEndpoints()
                .track
                .getReplacementTitles();
        sendRequest(url, method, body, success, error);
    };

    const fetchCancelOrderTitles = () => {
        const {url, method, body, success, error} =
            apiEndpoints
                .getApiEndpoints()
                .track
                .getCancelOrderTitles();
        sendRequest(url, method, body, success, error);
    };

    const updateProductStatus = (productId, status) => {
        setProductsStatuses(prevState => {
            const temp = {...prevState};
            temp[productId] = status;
            return {...temp};
        })
    };

    const fetchShopReviewTitles = () => {
        const {url, method, body, success, error} =
            apiEndpoints
                .getApiEndpoints()
                .order
                .shopReviewsTitles(order._id, order.store_id);
        sendRequest(url, method, body, success, error);
    };

    const openItemDetails = (order, billingDetails) => {
        setProductsStatuses({});
        sendDispatch(CLEAR_PRODUCTS_DETAILS);
        window.scrollTo(0, 0);
        setOrder(order);
        setBillingDetails(billingDetails);
        setActiveView(ITEM_ORDER_DETAILS);
    };

    const openDetailsModal = (details) => {
        setDetails(details);
        document.body.classList.remove('scroll-y-auto');
        document.body.classList.add('remove-scroll');
        setIsDetailsModalOpen(true);
    };

    const getOrders = () => {
        const {url, method, body, success, error} = apiEndpoints.getApiEndpoints().track.orders(page);
        sendRequest(url, method, body, success, error, _ => {
            setShouldLoadOrders(false);
            setLoadingNextPage(false);
            setLoadingOrders(false);
        });
    };

    const getOrdersCount = () => {
        const {url, method, body, success, error} = apiEndpoints.getApiEndpoints().track.ordersCount();
        sendRequest(url, method, body, success, error);
    };

    const onBillingDetailsClose = () => {
        setIsDetailsModalOpen(false);
        document.body.classList.remove('remove-scroll');
        document.body.classList.add('scroll-y-auto');
    };

    const onCODDialogClose = () => {
        setShowCODPaymentModal(false);
        const shouldShowReviewDialog = Object.values(productsStatuses).find(s => s !== 1);
        if (!shouldShowReviewDialog) {
            setShowReviewModal(true);
        } else {
            setActiveView(ORDERS);
        }
    };

    const verifyOrder = (callback) => {
        setOrderVerifying(true);
        const {url, method, body, success, error} =
            apiEndpoints
                .getApiEndpoints()
                .track
                .verifyOrder(order.category_id, order._id, order.store_id);
        sendRequest(url, method, body, success, error, response => {
            callback();
            setOrderVerifying(false);
        });
    };

    const onSubmit = () => {
        fetchShopReviewTitles();
        verifyOrder(() => {
            if (order?.payment_type === 2) {
                setShowCODPaymentModal(true);
            } else {
                const shouldShowReviewDialog = Object.values(productsStatuses).find(s => s !== 1);
                if (!shouldShowReviewDialog) {
                    setShowReviewModal(true);
                } else {
                    removeOrderFromList();
                    setActiveView(ORDERS);
                }
            }
        })
    };

    const removeOrderFromList = () => {
        sendDispatch(REMOVE_ORDER, order._id);
    };

    const loadNextPage = () => {
        if (!shouldLoadOrders) {
            setShouldLoadOrders(true);
        }
    };

    const loadFirstPage = () => {
        sendDispatch(CLEAR_TRACKING_ORDERS);
        setPage(1);
    };

    return (
        <div className='payment-page-container'>
            <NavigationMenu selectedMenuItem={1}/>
            {
                activeView === ORDERS ?
                    <TrackOrderItems openDetailsModal={openDetailsModal} openItemDetails={openItemDetails}
                                     loadFirstPage={loadFirstPage} loadNextPage={loadNextPage}
                                     loadingOrders={loadingOrders}
                                     loadingNextPage={loadingNextPage}/> : null
            }
            {
                activeView === ITEM_ORDER_DETAILS ?
                    <div className='w-65'>
                        <TrackOrderItemDetails order={order} goBack={() => setActiveView(ORDERS)}
                                               openDetailsModal={openDetailsModal}
                                               updateProductStatus={updateProductStatus}
                                               billingDetails={billingDetails}/>
                        {order.status === 5 && productsDetails ?
                            <div className='py-3 d-flex align-items-center justify-content-center'>
                                <button className='btn btn-primary order-submit-btn order-submit-btn-colors'
                                        onClick={onSubmit}
                                        disabled={Object.values(productsStatuses).includes(0)}>
                                    Submit
                                </button>
                            </div> : null}
                    </div> : null
            }
            <BillingDetailsModal show={isDetailsModalOpen}
                                 details={details}
                                 closeModal={onBillingDetailsClose}/>
            <CodPaymentDialog show={showCODPaymentModal} clickBackdrop={onCODDialogClose} order={order}/>
            <StoreReviewDialog show={showReviewModal} removeOrderFromList={removeOrderFromList} clickBackdrop={() => {
                setShowReviewModal(false);
                setActiveView(ORDERS);
            }}
                               isPurchaseHistory={false}
                               orderId={order?._id}/>
            {orderVerifying ? <RequestSpinner/> : null}
        </div>
    );
};
export default TrackOrder;
