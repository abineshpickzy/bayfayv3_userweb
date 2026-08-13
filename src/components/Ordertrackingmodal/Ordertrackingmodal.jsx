import React, { useEffect, useRef, useState } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { UPDATE_ORDER_STATUS } from '../../store/actionTypes/trackOrder-actions';
import LiveTrackingMap from '../LiveTrackingMap/LiveTrackingMap';
import './Ordertrackingmodal.scss';
import shopIcon from '../../assets/images/delivery-shop.png';
import {fetchImage} from "../../utils/imageUtils";
import ApiEndpoints from "../../utils/ApiEndpoints";
import useHttp from "../../hooks/http";
import {extractPathFromGooglePolyline, findNearestPointOnPath} from "../../utils/Polylineutils";

// Titles mirror backend config.order keynames/titles (statuses 1-5; 6-9 are
// verified/cancelled/rejected/denied and aren't part of this happy-path timeline).
// Used ONLY as a fallback for orders where the backend hasn't returned any
// notify/msg entries yet (e.g. brand new order, first tick).
const STATUS_STEPS = [
    { matchStatus: 1, title: 'New Order', description: 'Your order has been placed successfully.' },
    { matchStatus: 2, title: 'Order Accepted', description: 'Shop accepted your order and started preparing/packaging!' },
    { matchStatus: 3, title: 'Ready For Shipping', description: 'Order is ready to pickup from store for delivery ' },
    { matchStatus: 4, title: 'Order On The Way', description: 'Delivery associate picked up the order and is on the way to your delivery location.' },
    { matchStatus: 5, title: 'Order Delivered', description: 'Your order has been delivered.' }
];

// Associate's own status (separate from order status) — comes from
// order_info[].associateInfo.status in the socket payload.
const ASSOCIATE_STATUS_LABELS = {
    0: 'Not Started',
    1: 'Started - On the way to shop',
    2: 'Reached Shop',
    3: 'Picked Up the Order - On the way to delivery location',
    4: 'Delivered'
};

// Only re-fetch the route once the associate has drifted this far from the
// currently drawn polyline — mirrors mobile's verifyDeliveryAssociateRoute()
// (200m there; 80m here per request), instead of polling on a timer.
const ROUTE_DEVIATION_THRESHOLD_METERS = 60;

// per-render array scanning.
const OrderTrackingModal = ({ show, order, onClose }) => {

    const liveTrackingData = useSelector(state => state.trackOrderReducer.liveTrackingData);
    const dispatch = useDispatch();
    const [shopImage, setShopImage] = useState(null);
    const [trackOrderData, setTrackOrderData] = useState(null);
    const [associateImage, setAssociateImage] = useState(null);
    const [showDeliveredPopup, setShowDeliveredPopup] = useState(false);

    // New: real backend-driven status timeline + real road route + nearby deliveries
    const [notifyList, setNotifyList] = useState([]);
    const [otherDeliveries, setOtherDeliveries] = useState([]);
    const [routePath, setRoutePath] = useState([]);
    const initialRouteDataRef = useRef(null); // raw `route` field from the initial track call
    const initialRouteConsumedRef = useRef(false);
    const routeStatusRef = useRef(null); // associateStatus the current routePath was drawn for
    const routePathIndexRef = useRef(0); // progress index into routePath, for forward-only deviation scanning
    const routeFetchInFlightRef = useRef(false);
    const lastNotifyFetchRef = useRef({ associateStatus: null, orderStatus: null });
    // Always-current refs so route/notify callbacks never read stale closure values
    const associatePositionRef = useRef(null);
    const shopPositionRef = useRef(null);
    const homePositionRef = useRef(null);
    const routePathRef = useRef([]);

    const apiEndpoints = new ApiEndpoints();
    const { sendRequest } = useHttp();

    useEffect(() => {
    setShowDeliveredPopup(false);
}, [order?._id]);

    useEffect(() => {
        let isCancelled = false;
        if (order?.shop_icon) {
            fetchImage(`/category/view/img?img=${order.shop_icon}&format=jpeg&width=300&height=300`)
                .then(response => {
                    const base64 = btoa(
                        new Uint8Array(response.data).reduce(
                            (data, byte) => data + String.fromCharCode(byte), ''
                        )
                    );
                    !isCancelled && setShopImage("data:;base64," + base64);
                })
                .catch(err => console.log(err));
        }
        if (order?._id) {
            const { url, method, body } = apiEndpoints.getApiEndpoints().track.trackDelivery(order._id);
            sendRequest(url, method, body, null, null, (res) => {
                if (!isCancelled && res.data) {
                    setTrackOrderData(res.data);
                    setOtherDeliveries(res.data.other_delivery || []);

                    // The pre-computed route (if the backend already had one handy)
                    // arrives as a top-level `route` field, sibling of `data`.
                    if (res.route) {
                        initialRouteDataRef.current = res.route;
                        initialRouteConsumedRef.current = false;
                    }

                    if (res.data.avatar) {
                        fetchImage(`/order/track/image/view?img=${res.data.avatar}&format=jpeg&width=100&height=100`)
                            .then(response => {
                                const base64 = btoa(
                                    new Uint8Array(response.data).reduce(
                                        (data, byte) => data + String.fromCharCode(byte), ''
                                    )
                                );
                                !isCancelled && setAssociateImage("data:;base64," + base64);
                            })
                            .catch(err => console.log("here :" , err));
                    }
                }
            });
        }
        return () => { isCancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [order?._id]);


useEffect(() => {
    const status = liveTrackingData?.[order?._id]?.orderStatus;
    if (status === 5) {
        setShowDeliveredPopup(true);
        if (order?._id) {
            dispatch({ type: UPDATE_ORDER_STATUS, payload: { orderId: order._id, status: 5 } });
        }
    }
}, [liveTrackingData, order?._id]);

useEffect(() => {
    const delivered = notifyList.some(entry => entry.title === 'Order Delivered');
    if (delivered) {
        setShowDeliveredPopup(true);
        if (order?._id) {
            dispatch({ type: UPDATE_ORDER_STATUS, payload: { orderId: order._id, status: 5 } });
        }
    }
}, [notifyList]);

    // Reset per-order local state whenever the tracked order changes / modal closes.
    useEffect(() => {
        if (!order?._id) {
            setNotifyList([]);
            setOtherDeliveries([]);
            setRoutePath([]);
            initialRouteDataRef.current = null;
            initialRouteConsumedRef.current = false;
            routeStatusRef.current = null;
            routePathIndexRef.current = 0;
            routeFetchInFlightRef.current = false;
        }
    }, [order?._id]);

    const liveData = order?._id ? liveTrackingData?.[order._id] : null;
    const associateLocation = liveData?.associateLocation;
    const associateStatus = liveData?.associateStatus;
    const effectiveOrderStatus = liveData?.orderStatus ?? order?.status;
    const pingSeq = liveData?.pingSeq ?? 0;

    const currentStepIndex = STATUS_STEPS.reduce(
        (acc, step, idx) => (effectiveOrderStatus >= step.matchStatus ? idx : acc), 0
    );
    const hasAnyLocationData = associateLocation?.coordinates
        || order?.shop_location?.coordinates
        || order?.location?.coordinates;

    const associatePosition = associateLocation?.coordinates
        ? { lat: associateLocation.coordinates[1], lng: associateLocation.coordinates[0] }
        : associateLocation?.lat != null
            ? { lat: associateLocation.lat, lng: associateLocation.lng }
            : null;
    const shopPosition = order?.shop_location?.coordinates
        ? { lat: order.shop_location.coordinates[1], lng: order.shop_location.coordinates[0] }
        : null;
    const homePosition = order?.location?.coordinates
        ? { lat: order.location.coordinates[1], lng: order.location.coordinates[0] }
        : null;

    // Keep refs in sync every render so effects always read fresh positions
    associatePositionRef.current = associatePosition;
    shopPositionRef.current = shopPosition;
    homePositionRef.current = homePosition;
    routePathRef.current = routePath;

    // ---- Notify list: refetch on order open + any status change + every 15s fallback ----
    useEffect(() => {
        if (!order?._id) return;
        const fetchNotify = () => {
            const { url, method, body } = apiEndpoints.getApiEndpoints().track.notifyMsg(order._id);
            sendRequest(url, method, body, null, null, (res) => {
                const notify = res?.data?.track?.notify;
                if (notify) setNotifyList(notify);
            });
        };
        fetchNotify();
        const interval = setInterval(fetchNotify, 15000);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [order?._id, associateStatus, effectiveOrderStatus]);

    // ---- Route: refetch on status change or associate location movement ----
    useEffect(() => {
        if (!order?._id) return;

        const ap = associatePositionRef.current;
        const sp = shopPositionRef.current;
        const hp = homePositionRef.current;

        const headingToShop = (associateStatus === 1 || associateStatus === 2) && ap && sp;
        const headingToDelivery = associateStatus === 3 && hp;

        if (!headingToShop && !headingToDelivery) {
            setRoutePath([]);
            routePathIndexRef.current = 0;
            routeStatusRef.current = associateStatus;
            return;
        }

        const source = headingToDelivery ? (ap || sp) : ap;
        const destination = headingToDelivery ? hp : sp;
        if (!source || !destination) return;

        const doFetch = (src, dest) => {
            if (routeFetchInFlightRef.current) return;
            routeFetchInFlightRef.current = true;
            const { url, method, body } = apiEndpoints.getApiEndpoints().track.fetchRoute(order._id, src, dest);
            sendRequest(url, method, body, null, null, (res) => {
                routeFetchInFlightRef.current = false;
                if (res?.data) {
                    const path = extractPathFromGooglePolyline(res.data);
                    setRoutePath(path);
                    routePathRef.current = path;
                    routePathIndexRef.current = 0;
                }
            });
        };

        const legChanged = routeStatusRef.current !== associateStatus;
        if (legChanged) {
            routeStatusRef.current = associateStatus;
            routePathIndexRef.current = 0;
            // status 2 = still at shop, reuse the status-1 route already drawn
            if (associateStatus === 2 && routePathRef.current.length > 0) return;
            if (!initialRouteConsumedRef.current && initialRouteDataRef.current) {
                const path = extractPathFromGooglePolyline(initialRouteDataRef.current);
                setRoutePath(path);
                routePathRef.current = path;
                initialRouteConsumedRef.current = true;
                return;
            }
            doFetch(source, destination);
            return;
        }

        // Same leg + associate moved: deviation check (status 1/2/3)
        if ((associateStatus === 1 || associateStatus === 3) && routePathRef.current.length > 0) {
            const nearest = findNearestPointOnPath(routePathRef.current, source, routePathIndexRef.current);
            if (nearest) {
                if (nearest.distanceMeters > ROUTE_DEVIATION_THRESHOLD_METERS) {
                    doFetch(source, destination);
                } else {
                    routePathIndexRef.current = nearest.index;
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [associateStatus, effectiveOrderStatus, associatePosition?.lat, associatePosition?.lng]);

    if (!show || !order) return null;

    // ---- Presentation only: fold the two status sources (real notify log vs
    // the hardcoded fallback) into one shared shape so the timeline below
    // renders identically either way. No change to which source is chosen or
    // what counts as completed/current — same conditions as before, just
    // expressed as data instead of two separate JSX branches. ----
    const timelineItems = notifyList.length > 0
        ? [...notifyList].reverse().map((entry, idx) => ({
            key: `${entry.title}-${idx}`,
            title: entry.title,
            description: entry.message,
            completed: true,
            current: idx === 0
        }))
        : STATUS_STEPS.map((step, idx) => ({
            key: step.title,
            title: step.title,
            description: step.description,
            completed: idx <= currentStepIndex,
            current: idx === currentStepIndex
        }));

    const associateStatusLabel = liveData
        ? (ASSOCIATE_STATUS_LABELS[associateStatus] ?? 'Not Assigned')
        : order.assistant_info
            ? (ASSOCIATE_STATUS_LABELS[order.assistant_info.status] || 'Not Assigned')
            : 'Not Assigned';

    return (
        <div className='order-tracking-modal-backdrop' onClick={onClose}>
            <div className='order-tracking-modal' onClick={e => e.stopPropagation()}>
                <button className='order-tracking-modal-close' onClick={onClose} aria-label='Close'>
                    <i className='far fa-times' />
                </button>

                <div className='order-tracking-modal-body d-flex'>
                    <div className='order-tracking-map-pane' style={{ position: 'relative', width: '100%', height: '100%' }}>
                        {/* Keep the map safely mounted at all times so Google never charges you twice */}
                        <LiveTrackingMap
                            associateLocation={associateLocation ?? trackOrderData?.associate?.location}
                            associateStatus={associateStatus ?? trackOrderData?.status}
                            orderStatus={effectiveOrderStatus}
                            shopLocation={order.shop_location}
                            deliveryLocation={order.location}
                            routePath={routePath}
                            otherDeliveries={otherDeliveries}
                            pingSeq={pingSeq}
                        />

                        {/* Safely visually cover the map with CSS if the data is missing */}
                        {!hasAnyLocationData && (
                            <div className='order-tracking-map-placeholder d-flex align-items-center justify-content-center'>
                                <span className='order-tracking-map-placeholder-text'>Location details unavailable</span>
                            </div>
                        )}
                    </div>

                    <div className='order-tracking-side-panel'>
                        <div className='order-tracking-shop-card d-flex align-items-center'>
                            <img src={shopImage || shopIcon} className='order-tracking-shop-icon' alt={order.shop?.name || 'shop'} />
                            <div className='order-tracking-shop-info'>
                                <span className='order-tracking-shop-name'>{order.shop?.display_name}</span>
                                <span className='order-tracking-order-id'>Order #{order.order_id}</span>
                            </div>
                        </div>

                        <div className='order-tracking-associate-status-badge'>
                            <span className='order-tracking-associate-status-dot' />
                            <span>Associate: {associateStatusLabel}</span>
                        </div>

                        <div className='order-tracking-status-title'>Order Status</div>

                        <div className='order-tracking-timeline'>
                            {timelineItems.map((item, idx) => (
                                <div
                                    key={item.key}
                                    className={`order-tracking-timeline-item ${item.current ? 'is-current' : ''} ${item.completed ? 'is-completed' : ''}`}
                                >
                                    <div className='order-tracking-timeline-rail'>
                                        <span className='order-tracking-timeline-dot'>
                                            {item.completed ? <i className='fas fa-check' /> : null}
                                        </span>
                                        {idx !== timelineItems.length - 1 && (
                                            <span className='order-tracking-timeline-line' />
                                        )}
                                    </div>
                                    <div className='order-tracking-timeline-content'>
                                        <span className='order-tracking-status-step-title'>{item.title}</span>
                                        <span className='order-tracking-status-step-desc'>{item.description}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {trackOrderData?.mobile && (
                            <div className='order-tracking-associate-card'>
                                <div className='order-tracking-associate-avatar-wrap'>
                                    <img
                                        src={associateImage || 'https://www.bayfay.com/static/media/logo-final-512x512.c2141fa1a8f0a1deb3ab.png'}
                                        className='order-tracking-associate-avatar'
                                        alt='associate'
                                    />
                                </div>
                                <div className='order-tracking-associate-info'>
                                    <span className='order-tracking-associate-name'>
                                        {trackOrderData ? `${trackOrderData.first_name || ''} ${trackOrderData.last_name || ''}`.trim() || 'Delivery Boy' : 'Delivery Boy'}
                                    </span>
                                    {trackOrderData?.mobile && (
                                        <span className='order-tracking-associate-mobile'>
                                            +{trackOrderData.mobile.dialing_code} {trackOrderData.mobile.number}
                                        </span>
                                    )}
                                    <span className='order-tracking-associate-label'>BayFay Delivery Partner</span>
                                </div>
                                {trackOrderData?.mobile && (
                                    <a
                                        href={`tel:${trackOrderData.mobile.dialing_code}${trackOrderData.mobile.number}`}
                                        className='order-tracking-associate-call-btn'
                                        aria-label='Call delivery partner'
                                    >
                                        <i className='fas fa-phone' />
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showDeliveredPopup && (
                <div className='order-delivered-popup-backdrop' onClick={e => e.stopPropagation()}>
                    <div className='order-delivered-popup'>
                        <div className='order-delivered-popup-icon-wrap'>
                            <i className='fas fa-check-circle order-delivered-popup-icon' />
                        </div>
                        <div className='order-delivered-popup-title'>Order Delivered</div>
                        <p className='order-delivered-popup-desc'>Your order has been delivered successfully.</p>
                        <button
                            className='order-delivered-popup-ok'
                            onClick={() => {
                                setShowDeliveredPopup(false);
                                onClose();
                            }}
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderTrackingModal;