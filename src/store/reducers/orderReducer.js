import {
    BAY_FAY_CASH_FETCH_SUCCESS,
    BILLING_FETCH_ERROR,
    BILLING_FETCH_SUCCESS,
    DELIVERY_TYPES_FETCH_ERROR,
    DELIVERY_TYPES_FETCH_SUCCESS, PROMO_LIST_FETCH_SUCCESS
} from "../actionTypes/order-actions";

const initialState = {
    billing: null,
    deliveryTypes: null,
    bayFayCashAmount: 0,
    promoList: []
};

const orderReducer = (state = initialState, action) => {
    switch (action.type) {
        case BILLING_FETCH_SUCCESS:
            return billingFetchSuccess(state, action);
        case BILLING_FETCH_ERROR:
            return billingFetchError(state);
        case DELIVERY_TYPES_FETCH_SUCCESS:
            return fetchDeliveryTypesSuccess(state, action);
        case DELIVERY_TYPES_FETCH_ERROR:
            return fetchDeliveryTypesError(state);
        case BAY_FAY_CASH_FETCH_SUCCESS:
            return fetchBayFayCashSuccess(state, action);
        case PROMO_LIST_FETCH_SUCCESS:
            return promoListFetchSuccess(state, action);
        default:
            return state;
    }
};

const billingFetchSuccess = (state, action) => {
    return {
        ...state,
        billing: action.payload.data
    }
};

const billingFetchError = state => {
    return {
        ...state,
        billing: null
    }
};

const fetchDeliveryTypesSuccess = (state, action) => {
  return {
      ...state,
      deliveryTypes: action.payload.data
  }
};

const fetchDeliveryTypesError = state => {
    return {
        ...state,
        deliveryTypes: null
    }
};

const fetchBayFayCashSuccess = (state, action) => {
    return {
        ...state,
        bayFayCashAmount: action.payload.wallet_amount
    }
};

const promoListFetchSuccess = (state, action) => {
    return {
        ...state,
        promoList: action.payload.data
    }
};

export default orderReducer;
