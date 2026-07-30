import React, {useEffect, useState} from 'react';
import './OrderHistoryItems.scss';
import {useSelector} from "react-redux";
import OrderHistoryItem from "../OrderHistoryItem/OrderHistoryItem";
import Loader from "../Loader/Loader";

const OrderHistoryItems = ({openDetailsModal, loadNextPage, loadingNextPage, openItemDetails, openReviewModal, loadingOrders}) => {

    const purchaseOrders = useSelector(state => state.ordersHistoryReducer.purchaseOrders);

    const [loading, setIsLoading] = useState(false);

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

    return (
        <div className="d-flex flex-column mt-4 w-100">
            {purchaseOrders.flatMap(order => order.orders).map(order => {
                return <OrderHistoryItem order={order}
                                         openReviewModal={openReviewModal}
                                         openItemDetails={openItemDetails}
                                         openDetailsModal={openDetailsModal}
                                         setIsLoading={loading => setIsLoading(loading)}
                                         key={order._id}/>
            })}
            {purchaseOrders?.length === 0 && !(loading || loadingOrders) ?
                <div
                    className='font-size-1-4rem w-100 d-flex justify-content-center font-weight-bold empty-container-label silver-text'>
                    You will see a history of your past orders here
                </div> : null}
            {loadingNextPage ? <div className='next-page-loader'>
                <div className="spinner-border text-dark" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div> : null}
            {(loading || loadingOrders) && <Loader/>}
        </div>
    );
};

export default OrderHistoryItems;
