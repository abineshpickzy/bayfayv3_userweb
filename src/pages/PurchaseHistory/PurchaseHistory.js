import React, {useEffect, useState} from 'react';
import NavigationMenu from "../../components/NavigationMenu/NavigationMenu";
import useHttp from "../../hooks/http";
import ApiEndpoints from "../../utils/ApiEndpoints";
import OrderHistoryItems from "../../components/OrderHistoryItems/OrderHistoryItems";
import BillingDetailsModal from "../../components/BillingDetailsModal/BillingDetailsModal";
import {useSelector} from "react-redux";
import OrderHistoryProductsDetails from "../../components/OrderHistoryProductsDetails/OrderHistoryProductsDetails";
import {CLEAR_ORDER_HISTORY, CLEAR_ORDER_HISTORY_PRODUCTS_DETAILS} from "../../store/actionTypes/ordersHistory-actions";
import useSyncDispatch from "../../hooks/dispatch";
import StoreReviewDialog from "../../components/StoreReviewDialog/StoreReviewDialog";
import SuccessModal from "../../components/SuccessModal/SuccessModal";
import CodPaymentDialog from "../../components/CODPaymentDialog/CODPaymentDialog";
import RequestSpinner from "../../components/RequestSpinner/RequestSpinner";

const ORDERS = 'ORDERS';
const ITEM_ORDER_DETAILS = 'ITEM_ORDER_DETAILS';

const PurchaseHistory = () => {
    const {sendRequest} = useHttp();
    const apiEndpoints = new ApiEndpoints();
    const {sendDispatch} = useSyncDispatch();

    const [activeView, setActiveView] = useState(ORDERS);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [details, setDetails] = useState(null);
    const [loadingNextPage, setLoadingNextPage] = useState(false);
    const [shouldLoadOrders, setShouldLoadOrders] = useState(false);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [page, setPage] = useState(1);
    const [order, setOrder] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [message, setMessage] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [productsStatuses, setProductsStatuses] = useState({});
    const [showCODPaymentModal, setShowCODPaymentModal] = useState(false);
    const [orderVerifying, setOrderVerifying] = useState(false);

    const ordersCount = useSelector(state => state.ordersHistoryReducer.count);
    const ordersLoaded = useSelector(state => state.ordersHistoryReducer.purchaseOrders?.length);
    const productsDetails = useSelector(state => state.ordersHistoryReducer.productsDetails);

    useEffect(() => {
        getOrdersCount();
        fetchReplacementTitles();
        fetchCancelOrderTitles();
    }, []);

    useEffect(() => {
        if (page > 1) {
            setLoadingNextPage(true);
        }
        setLoadingOrders(true);
        fetchOrdersHistory(page);
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

    const fetchShopReviewTitles = (order) => {
        const {url, method, body, success, error} =
            apiEndpoints
                .getApiEndpoints()
                .order
                .shopReviewsTitles(order._id, order?.store_id);
        sendRequest(url, method, body, success, error);
    };

    const fetchOrdersHistory = (page) => {
        const {url, method, body, success, error} =
            apiEndpoints
                .getApiEndpoints()
                .ordersHistory
                .fetchOrdersHistory(page);
        sendRequest(url, method, body, success, error, _ => {
            setShouldLoadOrders(false);
            setLoadingNextPage(false);
            setLoadingOrders(false);
        });
    };

    const getOrdersCount = () => {
        const {url, method, body, success, error} = apiEndpoints.getApiEndpoints().ordersHistory.ordersHistoryCount();
        sendRequest(url, method, body, success, error);
    };

    const openItemDetails = (order) => {
        setProductsStatuses({});
        sendDispatch(CLEAR_ORDER_HISTORY_PRODUCTS_DETAILS);
        window.scrollTo(0, 0);
        setOrder(order);
        setActiveView(ITEM_ORDER_DETAILS);
    };

    const onBillingDetailsClose = () => {
        setIsDetailsModalOpen(false);
        document.body.classList.remove('remove-scroll');
        document.body.classList.add('scroll-y-auto');
    };

    const openDetailsModal = (details) => {
        setDetails(details);
        document.body.classList.remove('scroll-y-auto');
        document.body.classList.add('remove-scroll');
        setIsDetailsModalOpen(true);
    };

    const loadNextPage = () => {
        if (!shouldLoadOrders) {
            setShouldLoadOrders(true);
        }
    };

    const openReviewModal = order => {
        fetchShopReviewTitles(order);
        setOrder(order);
        const shouldShowReviewDialog = Object.values(productsStatuses).find(s => s !== 1);
        if (!shouldShowReviewDialog || order.isDirect) {
            setShowReviewModal(true);
        }
    };

    const showSuccessMessage = message => {
        setMessage(message);
        setShowSuccessModal(true);
    };

    const updateProductStatus = (productId, status) => {
        setProductsStatuses(prevState => {
            const temp = {...prevState};
            temp[productId] = status;
            return {...temp};
        })
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
                .ordersHistory
                .verifyOrder(order.category_id, order._id, order.store_id);
        sendRequest(url, method, body, success, error, response => {
            callback && callback();
            setOrderVerifying(false);
        });
    };

    const onSubmit = () => {
        fetchShopReviewTitles(order);
        verifyOrder(() => {
            const shouldShowReviewDialog = Object.values(productsStatuses).find(s => s !== 1);
            if (!shouldShowReviewDialog) {
                setShowReviewModal(true);
            } else {
                if (!order?.isDirect) {
                    loadFirstPage();
                    setActiveView(ORDERS);
                }
            }
        })
    };

    const loadFirstPage = () => {
        sendDispatch(CLEAR_ORDER_HISTORY);
        setPage(1);
    };

    return (
        <div className='payment-page-container'>
            <NavigationMenu selectedMenuItem={2}/>
            {
                activeView === ORDERS ?
                    <OrderHistoryItems openDetailsModal={openDetailsModal} loadNextPage={loadNextPage}
                                       openReviewModal={openReviewModal} loadingOrders={loadingOrders}
                                       loadingNextPage={loadingNextPage} openItemDetails={openItemDetails}/> : null}
            {activeView === ITEM_ORDER_DETAILS ?
                <div className='w-65'>
                    <OrderHistoryProductsDetails order={order} goBack={() => setActiveView(ORDERS)}
                                                 openDetailsModal={openDetailsModal}
                                                 productsDetails={productsDetails}
                                                 verifyOrder={verifyOrder}
                                                 updateProductStatus={updateProductStatus}/>
                    {order?.status === 5 && productsDetails ?
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
            <StoreReviewDialog show={showReviewModal} clickBackdrop={() => {
                if (!order?.isDirect) {
                    loadFirstPage();
                }
                setShowReviewModal(false);
            }}
                               showSuccessMessage={showSuccessMessage}
                               isPurchaseHistory={true}
                               isEdit={order?.isDirect}
                               orderId={order?._id}/>
            <CodPaymentDialog show={showCODPaymentModal} clickBackdrop={onCODDialogClose} order={order}/>
            <SuccessModal show={showSuccessModal} clickBackdrop={() => {
                setShowSuccessModal(false);
                if (!order?.isDirect) {
                    loadFirstPage();
                }
                setOrder(null);
                if (activeView === ITEM_ORDER_DETAILS) {
                    setActiveView(ORDERS);
                }
            }}
                          message={message}/>
            {orderVerifying ? <RequestSpinner/> : null}
        </div>

    );
};

export default PurchaseHistory;
