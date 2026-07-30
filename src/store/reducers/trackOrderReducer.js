import {
    CANCEL_ORDER_TITLES_FETCH_SUCCESS, CLEAR_PRODUCTS_DETAILS, CLEAR_TRACKING_ORDERS,
    GET_PRODUCTS_DETAILS, GET_TRACKING_ORDERS_COUNT_ERROR, GET_TRACKING_ORDERS_COUNT_SUCCESS,
    GET_TRACKING_ORDERS_ERROR,
    GET_TRACKING_ORDERS_SUCCESS, REMOVE_ORDER,
    REPLACEMENT_TITLES_FETCH_SUCCESS,
    SHOP_REVIEW_TITLES_FETCH_SUCCESS
} from "../actionTypes/trackOrder-actions";

const initialState = {
    trackOrders: [],
    error: null,
    productsDetails: null,
    shopReviewTitles: null,
    replacementTitles: [],
    cancelOrderTitles: [],
    ordersCount: 0
};

const trackOrderReducer = (state = initialState, action) => {

    switch (action.type) {
        case GET_TRACKING_ORDERS_SUCCESS:
            return getTrackOrdersSuccess(state, action);
        case GET_TRACKING_ORDERS_ERROR:
            return getTrackOrdersError(state, action);
        case GET_TRACKING_ORDERS_COUNT_SUCCESS:
            return {
                ...state,
                ordersCount: action.payload.count
            };
        case REMOVE_ORDER:
            return removeOrder(state, action);
        case GET_TRACKING_ORDERS_COUNT_ERROR:
            return {
                ...state,
                ordersCount: 0
            };
        case CLEAR_TRACKING_ORDERS:
            return {
                ...state,
                trackOrders: []
            };
        case GET_PRODUCTS_DETAILS:
            return getProductsDetails(state, action);
        case SHOP_REVIEW_TITLES_FETCH_SUCCESS:
            return {
                ...state,
                shopReviewTitles: action.payload.data
            };
        case REPLACEMENT_TITLES_FETCH_SUCCESS:
            return {
                ...state,
                replacementTitles: action.payload.data.titles
            };
        case CANCEL_ORDER_TITLES_FETCH_SUCCESS:
            return {
                ...state,
                cancelOrderTitles: action.payload.data.titles
            };
        case CLEAR_PRODUCTS_DETAILS:
            return {
                ...state,
                productsDetails: null
            };
        default:
            return state;
    }
};

const getTrackOrdersSuccess = (state, action) => {
    const trackOrders = [...state.trackOrders, ...action.payload.data];
    return {
        ...state,
        trackOrders,
        error: null
    }
};

const getTrackOrdersError = (state, action) => {
    return {
        ...state,
        trackOrders: [],
        error: action.payload
    }
};

const getProductsDetails = (state, action) => {
    return {
        ...state,
        productsDetails: action.payload.data
    }
};

const removeOrder = (state, action) => {
    const orders = [...state.trackOrders];
    const trackOrders = orders.filter(o => o.orders[0]._id !== action.payload);
    return {
        ...state,
        trackOrders
    }
};

export default trackOrderReducer;
