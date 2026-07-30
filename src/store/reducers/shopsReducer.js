import {
    FETCH_BRANDED_SHOPS_ERROR,
    FETCH_BRANDED_SHOPS_SUCCESS,
    FETCH_GLOBAL_SHOPS_ERROR,
    FETCH_GLOBAL_SHOPS_SUCCESS,
    FETCH_PRIVATE_SHOPS_ERROR,
    FETCH_PRIVATE_SHOPS_SUCCESS, FETCH_PUBLIC_SHOPS_ERROR,
    FETCH_PUBLIC_SHOPS_SUCCESS, SET_OPENED_SHOP_INFO,
} from "../actionTypes/shops-actions";

const initialState = {
    privateShops: {
        shops: null,
        count: 0,
        error: null,
        storesIds: []
    },
    publicShops: {
        shops: null,
        count: 0,
        error: null,
        storesIds: []
    },
    globalShops: {
        shops: null,
        count: 0,
        error: null,
        storesIds: []
    },
    brandedShops: {
        shops: null,
        count: 0,
        error: null,
        storesIds: []
    },
    openedShop: {
        isSet: false,
        image: null,
        shop: null,
    },
    offers: null
};

const shopsReducer = (state = initialState, action) => {

    switch (action.type) {
        case FETCH_PRIVATE_SHOPS_SUCCESS:
            return fetchPrivateShopsSuccess(state, action);
        case FETCH_PRIVATE_SHOPS_ERROR:
            return fetchPrivateShopsError(state, action);
        case FETCH_PUBLIC_SHOPS_SUCCESS:
            return fetchPublicShopsSuccess(state, action);
        case FETCH_PUBLIC_SHOPS_ERROR:
            return fetchPublicShopsError(state, action);
        case FETCH_GLOBAL_SHOPS_SUCCESS:
            return fetchGlobalShopsSuccess(state, action);
        case FETCH_GLOBAL_SHOPS_ERROR:
            return fetchGlobalShopsError(state, action);
        case FETCH_BRANDED_SHOPS_SUCCESS:
            return fetchBrandedShopsSuccess(state, action);
        case FETCH_BRANDED_SHOPS_ERROR:
            return fetchBrandedShopsError(state, action);
        case SET_OPENED_SHOP_INFO:
            return setShopInfo(state, action);
        default:
            return state;
    }
};

const fetchPrivateShopsSuccess = (state, action) => {
    let storesIds = [];
    if (action?.payload?.data?.category) {
        storesIds = action.payload.data.category.flatMap(a => a.stores);
    }
    return {
        ...state,
        privateShops: {
            shops: action.payload.data.category,
            count: action.payload.data.count,
            error: null,
            storesIds
        },
        offers: action.payload.data.offers
    }
};

const fetchPrivateShopsError = (state, action) => {
    return {
        ...state,
        privateShops: {
            shops: null,
            count: 0,
            error: action.payload
        }
    }
};

const fetchPublicShopsSuccess = (state, action) => {
    let storesIds = [];
    if (action?.payload?.data?.category) {
        storesIds = action.payload.data.category.flatMap(a => a.stores);
    }
    return {
        ...state,
        publicShops: {
            shops: action.payload.data.category,
            count: action.payload.data.count,
            error: null,
            storesIds
        }
    }
};

const fetchPublicShopsError = (state, action) => {
    return {
        ...state,
        privateShops: {
            shops: null,
            count: 0,
            error: action.payload
        }
    }
};

const fetchGlobalShopsSuccess = (state, action) => {
    let storesIds = [];
    if (action?.payload?.data?.category) {
        storesIds = action.payload.data.category.flatMap(a => a.stores);
    }
    return {
        ...state,
        globalShops: {
            shops: action.payload.data.category,
            count: action.payload.data.count,
            storesIds,
            error: null
        }
    }
};

const fetchGlobalShopsError = (state, action) => {
    return {
        ...state,
        globalShops: {
            shops: null,
            count: 0,
            error: action.payload
        }
    }
};

const fetchBrandedShopsSuccess = (state, action) => {
    let storesIds = [];
    if (action?.payload?.data?.category) {
        storesIds = action.payload.data.category.flatMap(a => a.stores);
    }
    return {
        ...state,
        brandedShops: {
            shops: action.payload.data.category,
            count: action.payload.data.count,
            error: null,
            storesIds
        }
    }
};

const fetchBrandedShopsError = (state, action) => {
    return {
        ...state,
        brandedShops: {
            shops: null,
            count: 0,
            error: action.payload
        }
    }
};

const setShopInfo = (state, action) => {
    return {
        ...state,
        openedShop: {
            ...action.payload
        }
    }
};

export default shopsReducer;
