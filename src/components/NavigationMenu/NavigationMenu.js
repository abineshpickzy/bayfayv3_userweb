import React, {useEffect} from 'react';
import './NavigationMenu.scss';
import history from '../../utils/history';
import useSyncDispatch from "../../hooks/dispatch";
import {CLEAR_TRACKING_ORDERS} from "../../store/actionTypes/trackOrder-actions";
import {CLEAR_ORDER_HISTORY} from "../../store/actionTypes/ordersHistory-actions";
import {useSelector} from "react-redux";
import useHttp from "../../hooks/http";
import ApiEndpoints from "../../utils/ApiEndpoints";

const NavigationMenu = ({selectedMenuItem}) => {
    const {sendRequest} = useHttp();
    const apiEndpoints = new ApiEndpoints();
    const {sendDispatch} = useSyncDispatch();

    const ordersCount = useSelector(state => state.trackOrderReducer.ordersCount);

    useEffect(() => {
        sendDispatch(CLEAR_TRACKING_ORDERS);
        sendDispatch(CLEAR_ORDER_HISTORY);
        getOrdersCount();
    }, [selectedMenuItem]);

    const getOrdersCount = () => {
        const {url, method, body, success, error} = apiEndpoints.getApiEndpoints().track.ordersCount();
        sendRequest(url, method, body, success, error);
    };

    return (
        <div className='flex-shrink-0 mr-4 navigation-menu py-4 pl-2'>
            <div className='navigation-menu-item-container'>
                <div
                    className={`navigation-menu-item ${selectedMenuItem === 1 ? 'navigation-menu-item-selected' : ''}`}
                    onClick={() => {
                        history.push("/track-order")
                    }}>
                <span className='d-flex w-40px justify-content-center mr-2 flex-shrink-0'>
                    <i className="fas fa-map-marker-alt font-size-15"/>
                </span>
                    <span className='d-flex justify-content-between flex-grow-1'>
                        <span>Track Order</span>
                        <span className='orders-count'>{ordersCount}</span>
                    </span>
                </div>
                <div
                    className={`navigation-menu-item ${selectedMenuItem === 2 ? 'navigation-menu-item-selected' : ''}`}
                    onClick={() => history.push("/purchase-history")}>
                    <span className='d-flex w-40px justify-content-center mr-2'>
                        <i className="far fa-clipboard-list font-size-15"/>
                    </span>
                    <span>Purchase History</span>
                </div>
                <div
                    className={`navigation-menu-item ${selectedMenuItem === 3 ? 'navigation-menu-item-selected' : ''}`}
                    onClick={() => {
                        history.push("/payments");
                    }}>
                <span className='d-flex w-40px justify-content-center mr-2'>
                    <img src={require('../../assets/images/payments.png')} alt="payments"
                         className='navigation-menu-img'/>
                </span>
                    <span>Payments</span>
                </div>
                <div
                    className={`navigation-menu-item ${selectedMenuItem === 4 ? 'navigation-menu-item-selected' : ''}`}
                    onClick={() => history.push("/profile")}>
                    <span className='d-flex w-40px justify-content-center mr-2'>
                        <img src={require('../../assets/images/Profile&setting.png')} alt="profile&settings"
                             className='navigation-menu-img'/>
                    </span>
                    <span>Profile and Settings</span>
                </div>
                 {/* <div
                    className={`navigation-menu-item ${selectedMenuItem === 5 ? 'navigation-menu-item-selected' : ''}`}
                    onClick={() => setSelectedMenuItem(5)}>
                    <span className='d-flex w-40px justify-content-center mr-2'>
                        <img src={require('../../assets/images/support.png')} alt="support"
                             className='navigation-menu-img'/>
                    </span>
                    <span>Support</span>
                </div>  */}
            </div>
        </div>
    );
};

export default NavigationMenu;
