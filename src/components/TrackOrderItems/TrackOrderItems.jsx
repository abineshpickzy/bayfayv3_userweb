import React, {useEffect, useState} from 'react';
import TrackOrderItem from "../TrackOrderItem/TrackOrderItem";
import {useSelector} from "react-redux";
import useHttp from "../../hooks/http";
import ApiEndpoints from "../../utils/ApiEndpoints";
import Loader from "../Loader/Loader";
import CancelOrderDialog from "../CancelOrderDialog/CancelOrderDialog";
import TrackOrderHelp from "../TrackOrderHelp/TrackOrderHelp";
import SuccessModal from "../SuccessModal/SuccessModal";
import ShopContactDialog from "../ShopContactDialog/ShopContactDialog";
import {TrackOrderUtils} from "../../utils/TrackOrderUtils";
import AlertDialog from "../AlertDialog/AlertDialog";

const TrackOrderItems = ({openItemDetails, openDetailsModal, loadNextPage, loadingNextPage, loadingOrders}) => {
    const apiEndpoints = new ApiEndpoints();
    const {sendRequest, isLoading} = useHttp();

    const [showTrackOrderHelp, setShowTrackOrderHelp] = useState(false);
    const [isCancelOrderModalOpen, setIsCancelOrderModalOpen] = useState(false);
    const [order, setOrder] = useState('');
    const [loading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [showContactDialog, setShowContactDialog] = useState(false);
    const [contactData, setContactData] = useState('');
    const [showAlertDialog, setShowAlertDialog] = useState(false);

    const trackOrders = useSelector(state => state.trackOrderReducer.trackOrders);

    useEffect(() => {
        window.scrollTo(0, 0);
        document.addEventListener('scroll', handleScroll);

        return () => {
            document.removeEventListener('scroll', handleScroll);
        }
    }, []);

    const handleScroll = () => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500) {
            loadNextPage();
        }
    };

    const openCancelOrderModal = order => {
        if (order.status >= order.cancel_selected_stage) {
            setShowAlertDialog(true);
        } else {
            setOrder(order);
            setIsCancelOrderModalOpen(true);
        }
    };

    const openHelpModal = (order) => {
        document.body.classList.remove('scroll-y-auto');
        document.body.classList.add('remove-scroll');
        setOrder(order);
        setShowTrackOrderHelp(true);
    };

    const closeHelpModal = () => {
        setShowTrackOrderHelp(false);
        document.body.classList.remove('remove-scroll');
        document.body.classList.add('scroll-y-auto');
    };

    const openContactDialog = data => {
        setContactData(data);
        setShowContactDialog(true);
    };

    const buzzUp = (orderId) => {
        if (TrackOrderUtils.checkIfCanBuzz(orderId)) {
            const {url, method, body, success, error} = apiEndpoints.getApiEndpoints().order.buzz(orderId);
            sendRequest(url, method, body, success, error, response => {
                if (response.success) {
                    TrackOrderUtils.setBuzzOrder(orderId);
                    setMessage(response.message);
                    setShowSuccessDialog(true);
                }
            });
        }
    };

    const showCancelSuccessModal = message => {
        setMessage(message);
        setShowSuccessDialog(true);
    };

    return (
        <div className="d-flex flex-column mt-4 w-100">
            {trackOrders.flatMap(order => order.orders).map(order => {
                return <TrackOrderItem order={order}
                                       key={order._id}
                                       setIsLoading={loading => setIsLoading(loading)}
                                       id={order._id}
                                       buzzUp={buzzUp}
                                       openItemDetails={openItemDetails}
                                       openContactDialog={openContactDialog}
                                       openHelpModal={openHelpModal}
                                       openCancelOrderModal={openCancelOrderModal}
                                       openDetailsModal={openDetailsModal}/>
            })}
            {loadingNextPage ? <div className='next-page-loader'>
                <div className="spinner-border text-dark" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div> : null}
            {trackOrders?.length === 0 && !(isLoading || loading || loadingOrders) ?
                <div
                    className='font-size-1-4rem w-100 d-flex justify-content-center font-weight-bold empty-container-label silver-text'>
                    You will see a current orders here
                </div> : null}
            <TrackOrderHelp show={showTrackOrderHelp} closeModal={closeHelpModal} orderId={order._id}/>
            <CancelOrderDialog show={isCancelOrderModalOpen} clickBackdrop={() => setIsCancelOrderModalOpen(false)}
                               order={order} showSuccessModal={showCancelSuccessModal}/>
            <SuccessModal show={showSuccessDialog} clickBackdrop={() => setShowSuccessDialog(false)} message={message}/>
            <ShopContactDialog clickBackdrop={() => setShowContactDialog(false)} show={showContactDialog}
                               content={contactData}/>
            <AlertDialog title={'Cancel order'} message={CAN_NOT_CANCEL_ORDER_MESSAGE} confirmButtonText={'Ok'}
                         show={showAlertDialog} clickBackdrop={() => setShowAlertDialog(false)} hideRejectButton={true}
                         onConfirm={() => setShowAlertDialog(false)}/>
            {(isLoading || loading || loadingOrders) && <Loader/>}
        </div>
    );
};
export default TrackOrderItems;

const CAN_NOT_CANCEL_ORDER_MESSAGE = 'You can\'t cancel the order from here once shop started to prepare your order. If you still want to cancel, kindly contact shop or BayFay support to cancel your order';
