import {
    CLEAR_ORDER_HISTORY,
    CLEAR_ORDER_HISTORY_PRODUCTS_DETAILS, GET_HISTORY_PRODUCTS_DETAILS,
    ORDER_HISTORY_COUNT_ERROR,
    ORDER_HISTORY_COUNT_SUCCESS,
    ORDERS_HISTORY_FETCH_ERROR,
    ORDERS_HISTORY_FETCH_SUCCESS, PRODUCT_REVIEW_TITLES_FETCH_SUCCESS
} from "../actionTypes/ordersHistory-actions";

const initialState = {
    purchaseOrders: [],
    count: 10,
    productsDetails: null,
    productReviewTitles: null
};

const ordersHistoryReducer = (state = initialState, action) => {
    switch (action.type) {
        case ORDERS_HISTORY_FETCH_SUCCESS:
            return ordersHistoryFetchSuccess(state, action);
        case ORDERS_HISTORY_FETCH_ERROR:
            return {
                ...state,
                purchaseOrders: []
            };
        case CLEAR_ORDER_HISTORY:
            return {
                ...state,
                purchaseOrders: []
            };
        case ORDER_HISTORY_COUNT_SUCCESS:
            return {
                ...state,
                count: action.payload.count
            };
        case ORDER_HISTORY_COUNT_ERROR:
            return {
                ...state,
                count: 0
            };
        case CLEAR_ORDER_HISTORY_PRODUCTS_DETAILS:
            return {
                ...state,
                productsDetails: null
            };
        case GET_HISTORY_PRODUCTS_DETAILS:
            return getProductsDetails(state, action);
        case PRODUCT_REVIEW_TITLES_FETCH_SUCCESS:
            return {
                ...state,
                productReviewTitles: action.payload.data,
            };
        default:
            return state;
    }
};

const ordersHistoryFetchSuccess = (state, action) => {
    const purchaseOrders = [...state.purchaseOrders, ...action.payload.data];
    return {
        ...state,
        purchaseOrders
    }
};

const getProductsDetails = (state, action) => {
    return {
        ...state,
        productsDetails: action.payload.data
    }
};

export default ordersHistoryReducer;
