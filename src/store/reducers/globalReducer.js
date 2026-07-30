import {
    API_ERROR,
    API_SUCCESS,
    CLEAR_CLOSE_PAYMENT_SCREEN,
    CLOSE_PAYMENT_SCREEN,
    GEOLOCATION_ERROR_SHOW,
    HIDE_CART_WARNING_DIALOG,
    HIDE_LOGIN_MODAL,
    HIDE_NO_NEARBY_SHOPS_WARNING, OFFERS_FETCH_SUCCESS,
    RESET_API_ERROR,
    RESET_API_SUCCESS, SCRATCH_CARD_COUNT_SUCCESS, SCRATCH_CARD_FETCH_ERROR, SCRATCH_CARD_FETCH_SUCCESS,
    SET_DELIVERY_GEO_LOCATION,
    SET_DELIVERY_LOCATION_ADDRESS,
    SET_PRODUCT_SEARCH_ADDRESS,
    SET_PRODUCT_SEARCH_GEO_LOCATION,
    SHOW_CART_WARNING_DIALOG,
    SHOW_LOGIN_MODAL
} from "../actionTypes/global-actions";
import {LocationUtils} from "../../utils/LocationUtils";

const initialState = {
    deliveryLocationCoordinates: {lat: 0, lng: 0},
    productSearchLocationCoordinates: {lat: 0, lng: 0},
    deliveryLocationAddress: {
        area: null,
        street: null,
        zipCode: null,
        landmark: null
    },
    productSearchLocation: {
        area: null,
        street: null,
        zipCode: null,
        landmark: null
    },
    showLogin: false,
    apiError: {
        show: false,
        error: null
    },
    apiSuccess: {
        show: false,
        message: null
    },
    offers: [],
    geoLocationErrorShowed: false,
    showCartWarningDialog: false,
    closePaymentDialog: false,
    showNoNearbyShopsWarning: true,
    scratchCount: 0,
    scratchCard: null,
    offersCount: 0
};

const globalReducer = (state = initialState, action) => {

    switch (action.type) {
        case SET_DELIVERY_GEO_LOCATION:
            LocationUtils.saveMostRecentDeliveryCoordinates(action.payload);
            return {
                ...state,
                deliveryLocationCoordinates: action.payload
            };
        case SET_PRODUCT_SEARCH_GEO_LOCATION:
            LocationUtils.saveMostRecentProductSearchCoordinates(action.payload);
            return {
                ...state,
                productSearchLocationCoordinates: action.payload
            };
        case SET_DELIVERY_LOCATION_ADDRESS:
            return {
                ...state,
                deliveryLocationAddress: action.payload
            };
        case SET_PRODUCT_SEARCH_ADDRESS:
            return {
                ...state,
                productSearchLocation: action.payload
            };
        case GEOLOCATION_ERROR_SHOW:
            return {
                ...state,
                geoLocationErrorShowed: true
            };
        case API_ERROR:
            return apiError(state, action);
        case API_SUCCESS:
            return apiSuccess(state, action);
        case RESET_API_SUCCESS:
            return resetApiSuccess(state);
        case RESET_API_ERROR:
            return resetApiError(state);
        case SHOW_LOGIN_MODAL:
            return {
                ...state,
                showLogin: true
            };
        case HIDE_LOGIN_MODAL:
            return {
                ...state,
                showLogin: false
            };
        case SHOW_CART_WARNING_DIALOG:
            return {
                ...state,
                showCartWarningDialog: true
            };
        case CLOSE_PAYMENT_SCREEN:
            return {
                ...state,
                closePaymentDialog: true
            };
        case CLEAR_CLOSE_PAYMENT_SCREEN:
            return {
                ...state,
                closePaymentDialog: false
            };
        case HIDE_CART_WARNING_DIALOG:
            return {
                ...state,
                showCartWarningDialog: false
            };
        case HIDE_NO_NEARBY_SHOPS_WARNING:
            return {
                ...state,
                showNoNearbyShopsWarning: false
            };
        case OFFERS_FETCH_SUCCESS:
            return {
                ...state,
                offers: action.payload.data,
                offersCount: action.payload.data.length
            };
        case SCRATCH_CARD_COUNT_SUCCESS:
            return {
                ...state,
                scratchCount: action.payload.count
            };
        case SCRATCH_CARD_FETCH_SUCCESS:
            return {
                ...state,
                scratchCard: action.payload.data
            };
        case SCRATCH_CARD_FETCH_ERROR:
            return {
                ...state,
                scratchCard: null
            };
        default:
            return state;
    }
};

const apiError = (state, action) => {
    return {
        ...state,
        apiError: {
            show: true,
            error: action.payload.response?.data?.message ? action.payload.response.data.message : 'Something went wrong. Please try again.'
        }
    }
};

const apiSuccess = (state, action) => {
    return {
        ...state,
        apiSuccess: {
            show: true,
            message: action.payload
        }
    }
};

const resetApiError = (state) => {
    return {
        ...state,
        apiError: {
            show: false,
            error: null
        }
    }
};

const resetApiSuccess = state => {
    return {
        ...state,
        apiSuccess: {
            show: false,
            message: null
        }
    }
};

export default globalReducer;
