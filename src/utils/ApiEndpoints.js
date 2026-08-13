import {
    ERROR,
    LOGIN_ERROR,
    LOGIN_SUCCESS,
    LOGOUT_SUCCESS,
    RESET_PASSWORD_SUCCESS,
    SET_GUEST_TOKEN,
    SET_GUEST_USER_ERROR,
    SET_SIGN_UP_ERROR,
    SET_SIGN_UP_SUCCESS,
    SET_USER_PROFILE
} from "../store/actionTypes/auth-actions";
import {
    FETCH_BRANDED_SHOPS_ERROR,
    FETCH_BRANDED_SHOPS_SUCCESS,
    FETCH_GLOBAL_SHOPS_ERROR,
    FETCH_GLOBAL_SHOPS_SUCCESS,
    FETCH_PRIVATE_SHOPS_ERROR,
    FETCH_PRIVATE_SHOPS_SUCCESS,
    FETCH_PUBLIC_SHOPS_ERROR,
    FETCH_PUBLIC_SHOPS_SUCCESS
} from "../store/actionTypes/shops-actions";
import {
    CATEGORIES_FETCH_ERROR,
    CATEGORIES_FETCH_SUCCESS,
    FETCH_PREVIOUS_PRODUCTS_SUCCESS,
    FETCH_PRODUCTS_COUNT_ERROR,
    FETCH_PRODUCTS_COUNT_SUCCESS,
    FETCH_PRODUCTS_ERROR,
    FETCH_PRODUCTS_SUCCESS,
    PRODUCT_DETAILS_TEMPLATE_ERROR,
    PRODUCT_DETAILS_TEMPLATE_SUCCESS
} from "../store/actionTypes/products-actions";
import {
    ADD_PRODUCT_TO_CART_ERROR,
    ADD_PRODUCT_TO_CART_SUCCESS,
    CART_FETCH_SUCCESS,
    CLEAR_CART
} from "../store/actionTypes/cart-actions";
import {
    BAY_FAY_CASH_FETCH_ERROR,
    BAY_FAY_CASH_FETCH_SUCCESS,
    BILLING_FETCH_ERROR,
    BILLING_FETCH_SUCCESS,
    DELIVERY_TYPES_FETCH_ERROR,
    DELIVERY_TYPES_FETCH_SUCCESS,
    PROMO_LIST_FETCH_SUCCESS
} from "../store/actionTypes/order-actions";
import {BANKLIST_FETCH_SUCCESSFUL, RAZOR_SETTINGS_FETCH_SUCCESSFUL} from "../store/actionTypes/razor-actions";
import {
    CANCEL_ORDER_TITLES_FETCH_ERROR,
    CANCEL_ORDER_TITLES_FETCH_SUCCESS,
    GET_PRODUCTS_DETAILS,
    GET_TRACKING_ORDERS_COUNT_ERROR,
    GET_TRACKING_ORDERS_COUNT_SUCCESS,
    GET_TRACKING_ORDERS_ERROR,
    GET_TRACKING_ORDERS_SUCCESS,
    REPLACEMENT_TITLES_FETCH_ERROR,
    REPLACEMENT_TITLES_FETCH_SUCCESS,
    SHOP_REVIEW_TITLES_FETCH_ERROR,
    SHOP_REVIEW_TITLES_FETCH_SUCCESS
} from "../store/actionTypes/trackOrder-actions";
import {
    GET_HISTORY_PRODUCTS_DETAILS,
    ORDER_HISTORY_COUNT_ERROR,
    ORDER_HISTORY_COUNT_SUCCESS,
    ORDERS_HISTORY_FETCH_ERROR,
    ORDERS_HISTORY_FETCH_SUCCESS,
    PRODUCT_REVIEW_TITLES_FETCH_SUCCESS
} from "../store/actionTypes/ordersHistory-actions";
import {
    OFFERS_FETCH_SUCCESS,
    SCRATCH_CARD_COUNT_SUCCESS,
    SCRATCH_CARD_FETCH_ERROR
} from "../store/actionTypes/global-actions";
import {Utils} from "./Utils";

let instance = null;

class ApiEndpoints {
    constructor() {
        if (!instance) {
            instance = this;
        }
        return instance;
    }

    getApiEndpoints() {
        let endpoints = {};
        endpoints.login = {
            guest: () => {
                return {
                    url: '/auth/guest',
                    method: 'GET',
                    body: null,
                    success: SET_GUEST_TOKEN,
                    error: SET_GUEST_USER_ERROR
                }
            },
            user: (mobile, password, current_location) => {
                return {
                    url: '/auth/password',
                    method: 'POST',
                    body: {
                        mobile: mobile,
                        password: password,
                        device_details: {
                            type: 3,
                            token: "eebe9d0aa28aa5e6"
                        },
                        current_location: current_location
                    },
                    success: LOGIN_SUCCESS,
                    error: LOGIN_ERROR
                }
            },
            otp: (body) => {
                return {
                    url: '/auth/onetimepassword/verify',
                    method: 'POST',
                    body: body,
                    success: null,
                    error: null
                }
            },
            forgotPasswordVerify: (body) => {
                return {
                    url: '/auth/forgotpassword/verify',
                    method: 'POST',
                    body: body,
                    success: null,
                    error: null
                }
            },
            resetPassword: (body) => {
                return {
                    url: '/auth/resetpassword',
                    method: 'POST',
                    body: body,
                    success: RESET_PASSWORD_SUCCESS,
                    error: ERROR
                }
            },
            loginWithOtp: (body) => {
                return {
                    url: '/auth/onetimepassword',
                    method: 'POST',
                    body: body,
                    success: LOGIN_SUCCESS,
                    error: LOGIN_ERROR
                }
            },
            refreshToken: () => {
                return {
                    url: '/auth/refresh',
                    method: 'POST',
                    body: null,
                    success: LOGIN_SUCCESS,
                    error: LOGIN_ERROR
                }
            }
        };
        endpoints.logout = {
            logout: () => {
                return {
                    url: '/auth/logout',
                    method: 'GET',
                    body: null,
                    success: LOGOUT_SUCCESS,
                    error: LOGIN_ERROR
                }
            }
        };
        endpoints.shops = {
            privateShops: (searchLocation, deliveryLocation, maxDistance) => {
                return {
                    url: '/category/v2/view/location/private',
                    method: 'POST',
                    body: {
                        searchLocation: searchLocation,
                        deliveryLocation: deliveryLocation,
                        maxDistance: maxDistance

                    },
                    success: FETCH_PRIVATE_SHOPS_SUCCESS,
                    error: FETCH_PRIVATE_SHOPS_ERROR
                }
            },
            publicShops: (searchLocation, deliveryLocation, maxDistance, type) => {
                return {
                    url: '/category/view/location',
                    method: 'POST',
                    body: {
                        type: type,
                        searchLocation: searchLocation,
                        deliveryLocation: deliveryLocation,
                        maxDistance: maxDistance
                    },
                    success: type === 1 ? FETCH_PUBLIC_SHOPS_SUCCESS : FETCH_BRANDED_SHOPS_SUCCESS,
                    error: type === 1 ? FETCH_PUBLIC_SHOPS_ERROR : FETCH_BRANDED_SHOPS_ERROR
                }
            },
            globalShops: (searchLocation, deliveryLocation, maxDistance) => {
                return {
                    url: '/category/view/location/global',
                    method: 'POST',
                    body: {
                        searchLocation: searchLocation,
                        deliveryLocation: deliveryLocation,
                        maxDistance: maxDistance
                    },
                    success: FETCH_GLOBAL_SHOPS_SUCCESS,
                    error: FETCH_GLOBAL_SHOPS_ERROR
                }
            }
        };
        endpoints.signUp = {
            verify: (body) => {
                return {
                    url: '/auth/signup/verify',
                    method: 'POST',
                    body: body,
                    success: null,
                    error: null
                }
            },
            signUp: (body) => {
                return {
                    url: '/auth/signup',
                    method: 'POST',
                    body: body,
                    success: SET_SIGN_UP_SUCCESS,
                    error: SET_SIGN_UP_ERROR
                }
            }
        };
        endpoints.user = {
            getUserProfile: () => {
                return {
                    url: '/profile/view',
                    method: 'GET',
                    body: null,
                    success: SET_USER_PROFILE,
                    error: ERROR
                }
            },
            updateUserProfile: (firstName, lastName, mobileNumber, email, userProfile) => {
                let body = {};
                if (firstName !== userProfile.first_name) {
                    body['first_name'] = firstName;
                }
                if (lastName !== userProfile.last_name) {
                    body['last_name'] = lastName;
                }
                if (email !== userProfile.email.id) {
                    body['email'] = {
                        id: email
                    }
                }
                if (mobileNumber !== userProfile.mobile.number) {
                    body['mobile'] = {
                        dialing_code: 91,
                        number: mobileNumber
                    };
                }
                return {
                    url: '/profile/edit',
                    method: 'POST',
                    body,
                    success: null,
                    error: null
                }
            },
            sendEmailOTP: () => {
                return {
                    url: '/profile/email/otp',
                    method: 'POST',
                    body: null,
                    success: null,
                    error: null
                }
            },
            verifyEmailOTP: (otp) => {
                return {
                    url: '/profile/email/verifyOTP',
                    method: 'POST',
                    body: {
                        otp
                    },
                    success: null,
                    error: null
                }
            },
            changeProfileImage: (img) => {
                let formData = new FormData();
                formData.append('image', img);
                return {
                    url: '/profile/image/change',
                    method: 'POST',
                    body: formData,
                    success: null,
                    error: null
                }
            },
            changePassword: (oldPassword, newPassword) => {
                return {
                    url: '/profile/password/edit',
                    method: 'POST',
                    body: {
                        old_password: oldPassword,
                        new_password: newPassword
                    },
                    success: null,
                    error: null
                }
            },
            updateDeliveryType: (deliveryType) => {
                return {
                    url: '/profile/delivery/edit',
                    method: 'POST',
                    body: {
                        delivery_type: deliveryType
                    },
                    success: null,
                    error: null
                }
            },
            editAddress: body => {
                return {
                    url: '/profile/address/edit',
                    method: 'POST',
                    body,
                    success: null,
                    error: null
                }
            },
            addAddress: body => {
                return {
                    url: '/profile/address/add',
                    method: 'POST',
                    body,
                    success: null,
                    error: null
                }
            },
            deleteAddress: id => {
                return {
                    url: '/profile/address/delete',
                    method: 'DELETE',
                    body: {
                        id
                    },
                    success: null,
                    error: null
                }
            },
            deleteAccountRequest: (reason, mobile, email) => {
                return {
                    url: '/profile/data/sendreq',
                    method: 'POST',
                    body: { reason, mobile, email },
                    success: null,
                    error: null
                }
            }
        };
        endpoints.products = {
            getProductsWithCategories: (categoryId, stores, page, loadPreviousProducts) => {
                let skip;
                let success;
                if (loadPreviousProducts) {
                    success = FETCH_PREVIOUS_PRODUCTS_SUCCESS;
                    skip = (page - 6) * 50;
                } else {
                    skip = (page - 1) * 50;
                    success = FETCH_PRODUCTS_SUCCESS;
                }
                return {
                    url: `/product/view/products?skip=${skip}&limit=50`,
                    method: 'POST',
                    body: {
                        _id: categoryId,
                        stores: stores
                    },
                    success,
                    error: FETCH_PRODUCTS_ERROR
                }
            },
            searchProducts: (categoryId, stores, searchKeyWord, page) => {
                const skip = (page - 1) * 100;
                return {
                    url: `/product/view/listBySearch?skip=${skip}&limit=100`,
                    method: 'POST',
                    body: {
                        _id: categoryId,
                        stores: stores,
                        search: searchKeyWord
                    },
                    success: FETCH_PRODUCTS_SUCCESS,
                    error: FETCH_PRODUCTS_ERROR
                }
            },
            getProductsCount: (categoryId, stores) => {
                return {
                    url: '/product/view/c',
                    method: 'POST',
                    body: {
                        _id: categoryId,
                        stores: stores,
                    },
                    success: FETCH_PRODUCTS_COUNT_SUCCESS,
                    error: FETCH_PRODUCTS_COUNT_ERROR
                }
            },
            getProductsByCategory: (categoryId, stores, category, isRegExp = true, page, loadPreviousProducts) => {
                let skip;
                let success;
                if (loadPreviousProducts) {
                    success = FETCH_PREVIOUS_PRODUCTS_SUCCESS;
                    skip = (page - 3) * 50;
                } else {
                    skip = (page - 1) * 50;
                    success = FETCH_PRODUCTS_SUCCESS;
                }
                return {
                    url: `/product/view/listByCategory?skip=${skip}&limit=50`,
                    method: 'POST',
                    body: {
                        _id: categoryId,
                        stores,
                        category: category,
                        is_reg_exp: isRegExp
                    },
                    success,
                    error: FETCH_PRODUCTS_ERROR
                }
            },
            getProductsCountByCategory: (categoryId, stores, category, isRegExp = true) => {
                return {
                    url: '/product/view/by_category/c',
                    method: 'POST',
                    body: {
                        _id: categoryId,
                        stores,
                        category: category,
                        is_reg_exp: isRegExp
                    },
                    success: FETCH_PRODUCTS_COUNT_SUCCESS,
                    error: FETCH_PRODUCTS_COUNT_ERROR
                }
            },
            getProductQuantity: (categoryId, productId, stores) => {
                return {
                    url: '/cart/qty',
                    method: 'POST',
                    body: {
                        _id: categoryId,
                        product_id: productId,
                        stores: stores,
                    },
                    success: null,
                    error: null
                }
            },
            getProductReviews: (categoryId, stores, productId) => {
                return {
                    url: '/product/view/reviews',
                    method: 'POST',
                    body: {
                        _id: categoryId,
                        product: productId,
                        stores: stores,
                    },
                    success: null,
                    error: null
                }
            },
            getCategories: (categoryId, stores) => {
                return {
                    url: '/product/view/product_category',
                    method: 'POST',
                    body: {
                        _id: categoryId,
                        stores: stores,
                    },
                    success: CATEGORIES_FETCH_SUCCESS,
                    error: CATEGORIES_FETCH_ERROR
                }
            },
            viewPrivateShopInfo: (store_unique_id, deliveryLocation) => {
                const body = {
                    store_unique_id: store_unique_id,
                    device_OS: "mac",
                    source: "browser",
                };
                if (deliveryLocation) {
                    body["deliveryLocation"] = {
                        "type": "Point",
                        "coordinates": [deliveryLocation.lng, deliveryLocation.lat]
                    };
                }
                return {
                    url: '/product/view/private',
                    method: 'POST',
                    body,
                    success: null,
                    error: null
                }
            },
            viewNonPrivateShopInfo: (categoryId) => {
                return {
                    url: '/product/view/public',
                    method: 'POST',
                    body: {
                        category_id: categoryId
                    },
                    success: null,
                    error: null
                }
            },
            productDetailsTemplate: (categoryId) => {
                return {
                    url: '/product/view/template',
                    method: 'POST',
                    body: {
                        category_id: categoryId
                    },
                    success: PRODUCT_DETAILS_TEMPLATE_SUCCESS,
                    error: PRODUCT_DETAILS_TEMPLATE_ERROR
                }
            },
            fetchProductReportTypes: () => {
                return {
                    url: '/product/view/reporttype',
                    method: 'GET',
                    body: null,
                    success: null,
                    error: null
                }
            },
            reportProduct: (categoryId, productId, type, message) => {
                const body = {
                    _id: categoryId,
                    product: productId,
                    type
                };
                if (message.length > 0) {
                    body['message'] = message;
                }
                return {
                    url: '/product/update/productReport',
                    method: 'POST',
                    body,
                    success: null,
                    error: null
                }
            },
            viewProductAttributes: (categoryId, stores, productId) => {
                return {
                    url: '/product/view/by_product',
                    method: 'POST',
                    body: {
                        _id: categoryId,
                        stores: stores,
                        product: productId
                    },
                    success: null,
                    error: null
                }
            }
        };
        endpoints.cart = {
            getCart: (categoryId) => {
                return {
                    url: '/cart/view/cr',
                    method: 'POST',
                    body: {
                        "_id": categoryId,
                    },
                    success: CART_FETCH_SUCCESS,
                    error: ERROR
                }
            },
            add: (body) => {
                return {
                    url: '/cart/add',
                    method: 'POST',
                    body: body,
                    success: ADD_PRODUCT_TO_CART_SUCCESS,
                    error: ADD_PRODUCT_TO_CART_ERROR
                }
            },
            remove: (body) => {
                return {
                    url: '/cart/remove/cr',
                    method: 'DELETE',
                    body: body,
                    success: null,
                    error: null
                }
            },
            clearCart: () => {
                return {
                    url: '/cart/clear/cr',
                    method: 'DELETE',
                    body: null,
                    success: CLEAR_CART,
                    error: null
                }
            },
            verifyStock: (categoryId) => {
                return {
                    url: '/cart/verify/stock',
                    method: 'POST',
                    body: {
                        _id: categoryId
                    },
                    success: null,
                    error: null
                }
            },
            verifyShop: (body) => {
                return {
                    url: '/cart/verify/shop',
                    method: 'POST',
                    body,
                    success: null,
                    error: null
                }
            }
        };
        endpoints.custom = {
            viewAutoSelect: (categoryId) => {
                return {
                    url: '/cart/view/as',
                    method: 'POST',
                    body: {
                        _id: categoryId
                    },
                    success: null,
                    error: null
                }
            },
            viewCustomShop: (categoryId, stores) => {
                return {
                    url: '/cart/view/cs',
                    method: 'POST',
                    body: {
                        _id: categoryId,
                        stores
                    },
                    success: null,
                    error: null
                }
            },
            viewOptimizedShop: (categoryId, stores) => {
                return {
                    url: '/cart/view/os',
                    method: 'POST',
                    body: {
                        _id: categoryId,
                        stores
                    },
                    success: null,
                    error: null
                }
            },
            writeToCart: (categoryId, storeId) => {
                return {
                    url: '/cart/write',
                    method: 'POST',
                    body: {
                        _id: categoryId,
                        store_id: storeId
                    },
                    success: null,
                    error: null
                }
            }
        };
        endpoints.order = {
            viewBilling: (categoryId) => {
                return {
                    url: '/order/view/billing',
                    method: 'POST',
                    body: {
                        "_id": categoryId,
                    },
                    success: BILLING_FETCH_SUCCESS,
                    error: BILLING_FETCH_ERROR
                }
            },
            getDeliveryTypes: (stores) => {
                return {
                    url: '/order/view/delivery/type',
                    method: 'POST',
                    body: {
                        stores
                    },
                    success: DELIVERY_TYPES_FETCH_SUCCESS,
                    error: DELIVERY_TYPES_FETCH_ERROR
                }
            },
            getBayFayCash: () => {
                return {
                    url: '/wallet/bfcash',
                    method: 'POST',
                    body: null,
                    success: BAY_FAY_CASH_FETCH_SUCCESS,
                    error: BAY_FAY_CASH_FETCH_ERROR
                }
            },
            paymentGateway: (categoryId, isSaveCard, isBayFayCash, promoId) => {
                const body = {
                    _id: categoryId,
                    is_save_card: isSaveCard,
                    is_bayfaycash: isBayFayCash
                };
                if (promoId) {
                    body['promo_id'] = promoId;
                }
                return {
                    url: '/order/payment',
                    method: 'POST',
                    body,
                    success: null,
                    error: null
                }
            },
            payWithBayFayCash: body => {
                const deviceInfo = Utils.getDeviceInfoForOrder();
                const image = body['image'];
                delete body['image'];
                if (deviceInfo) {
                    body['order_source'] = {
                        ...deviceInfo
                    }
                }
                let formData = new FormData();
                formData.append('inputs', JSON.stringify(body));
                image && formData.append('image', image);
                return {
                    url: '/order/place/online/bfcash',
                    method: 'POST',
                    body: formData,
                    success: null,
                    error: null
                }
            },
            refundOrder: (body) => {
                return {
                    url: '/order/refund/orderIssue',
                    method: 'POST',
                    body,
                    success: null,
                    error: null
                }
            },
            cancelOrder: (orderId, to_bfCash, title, message) => {
                let body = {
                    order_id: [orderId],
                    to_bfCash,
                    title,
                };
                if (message?.length > 0) {
                    body['message'] = message;
                }
                return {
                    url: '/order/track/cancelOrder',
                    method: 'POST',
                    body,
                    success: null,
                    error: null
                }
            },
            cancelEscalatedOrder: (orderId, title, message) => {
                let body = {
                    order_id: [orderId]
                };
                if (message?.length > 0) {
                    body['message'] = message;
                }
                if (title?.length > 0) {
                    body['title'] = title;
                }
                return {
                    url: '/order/track/cancelEscalation',
                    method: 'POST',
                    body,
                    success: null,
                    error: null
                }
            },
            buzz: (orderId) => {
                return {
                    url: '/order/help/buzz',
                    method: 'POST',
                    body: {
                        order_id: orderId
                    },
                    success: null,
                    error: null
                }
            },
            shopReviewsTitles: (orderId, shopId) => {
                return {
                    url: '/order/view/shopreview/titles',
                    method: 'POST',
                    body: {
                        order_id: orderId,
                        shop_id: shopId
                    },
                    success: SHOP_REVIEW_TITLES_FETCH_SUCCESS,
                    error: SHOP_REVIEW_TITLES_FETCH_ERROR
                }
            },
            reviewShop: (orderId, rating, title, message, isPurchaseHistory) => {
                let url = '/order/track/reviewShop';
                if (isPurchaseHistory) {
                    url = '/order/history/reviewShop';
                }
                let body = {
                    order_id: orderId,
                    rating,
                    title,
                };
                if (message?.length > 0) {
                    body['message'] = message;
                }
                return {
                    url,
                    method: 'POST',
                    body,
                    success: null,
                    error: null
                }
            }
        };
        endpoints.razor = {
            order: (categoryId, isSaveCard, isBayFayCash, promoId) => {
                const body = {
                    is_save_card: isSaveCard,
                    is_bayfaycash: isBayFayCash
                };
                if (categoryId) {
                    body['_id'] = categoryId;
                }
                if (promoId) {
                    body['promo_id'] = promoId;
                }
                return {
                    url: '/order/razor/payment',
                    method: 'POST',
                    body,
                    success: null,
                    error: null
                }
            },
            fetchSavedCards: (customerId) => {
                return {
                    url: '/order/razor/alltokens',
                    method: 'POST',
                    body: {
                        customer_id: customerId
                    },
                    success: null,
                    error: null
                }
            },
            getRazorSettings: () => {
                return {
                    url: '/order/razor/viewPefToken',
                    method: 'POST',
                    body: null,
                    success: RAZOR_SETTINGS_FETCH_SUCCESSFUL,
                    error: ERROR
                };
            },
            savePreferredCard: (cardId, tokenType) => {
                return {
                    url: '/order/razor/savePefToken',
                    method: 'POST',
                    body: {
                        token_id: cardId,
                        token_type: tokenType
                    },
                    success: null,
                    error: null
                }
            },
            deleteSavedCard: (customerId, cardId, tokenType) => {
                return {
                    url: '/order/razor/deleteToken',
                    method: 'POST',
                    body: {
                        customer_id: customerId,
                        token_id: cardId,
                        token_type: tokenType
                    },
                    success: null,
                    error: null
                }
            },
            fetchBanksList: () => {
                return {
                    url: '/order/razor/razInfo',
                    method: 'POST',
                    body: null,
                    success: BANKLIST_FETCH_SUCCESSFUL,
                    error: ERROR
                }
            }
        };
        endpoints.ordersHistory = {
            fetchOrdersHistory: (page) => {
                const skip = (page - 1) * 10;
                return {
                    url: `/order/history/purchase?skip=${skip}&limit=10`,
                    method: 'GET',
                    body: null,
                    success: ORDERS_HISTORY_FETCH_SUCCESS,
                    error: ORDERS_HISTORY_FETCH_ERROR
                }
            },
            ordersHistoryCount: () => {
                return {
                    url: '/order/history/purchase/c',
                    method: 'GET',
                    body: null,
                    success: ORDER_HISTORY_COUNT_SUCCESS,
                    error: ORDER_HISTORY_COUNT_ERROR
                }
            },
            details: (shopId, categoryId, orderId) => {
                return {
                    url: '/order/history/viewProducts',
                    method: 'POST',
                    body: {
                        category_id: categoryId,
                        shop_id: shopId,
                        order_id: orderId
                    },
                    success: GET_HISTORY_PRODUCTS_DETAILS,
                    error: ERROR
                }
            },
            verifyProduct: (body) => {
                let formData = new FormData();
                Object.keys(body).forEach(key => (
                    formData.append(key, body[key])
                ));
                return {
                    url: '/order/history/verifyProducts',
                    method: 'POST',
                    body: formData,
                    success: null,
                    error: null
                }
            },
            verifyOrder: (categoryId, orderId, shopId) => {
                return {
                    url: '/order/history/verifyOrder',
                    method: 'POST',
                    body: {
                        category_id: categoryId,
                        shop_id: shopId,
                        order_id: orderId
                    },
                    success: null,
                    error: null
                }
            },
            productReviewTitles: (categoryId, orderId, productId) => {
                return {
                    url: '/order/view/productreview/titles',
                    method: 'POST',
                    body: {
                        category_id: categoryId,
                        order_id: orderId,
                        product_id: productId
                    },
                    success: PRODUCT_REVIEW_TITLES_FETCH_SUCCESS,
                    error: ERROR

                }
            },
            reviewProduct: (categoryId, orderId, productId, rating, title, message) => {
                let body = {
                    category_id: categoryId,
                    order_id: orderId,
                    product_id: productId,
                    rating,
                    title: title ? title : [],
                };
                if (message?.length > 0) {
                    body['message'] = message;
                }
                return {
                    url: '/order/history/reviewProduct',
                    method: 'POST',
                    body,
                    success: null,
                    error: null
                }
            }
        };
        endpoints.promo = {
            getPromos: categoryId => {
                return {
                    url: '/promo/list',
                    method: 'POST',
                    body: {
                        _id: categoryId
                    },
                    success: PROMO_LIST_FETCH_SUCCESS,
                    error: ERROR
                }
            }
        };
        endpoints.confirmPayments = {
            confirmSuccessShopPayment: (body) => {
                const deviceInfo = Utils.getDeviceInfoForOrder();
                const image = body['image'];
                delete body['image'];
                if (deviceInfo) {
                    body['order_source'] = {
                        ...deviceInfo
                    }
                }
                let formData = new FormData();
                formData.append('inputs', JSON.stringify(body));
                image && formData.append('image', image);
                return {
                    url: '/order/place/online/shop',
                    method: 'POST',
                    body: formData,
                    success: null,
                    error: null
                }
            },
            confirmSuccessTakeawayPayment: (body) => {
                const deviceInfo = Utils.getDeviceInfoForOrder();
                const image = body['image'];
                delete body['image'];
                if (deviceInfo) {
                    body['order_source'] = {
                        ...deviceInfo
                    }
                }
                let formData = new FormData();
                formData.append('inputs', JSON.stringify(body));
                image && formData.append('image', image);
                return {
                    url: '/order/place/online/takeaway',
                    method: 'POST',
                    body: formData,
                    success: null,
                    error: null
                }
            },
            confirmCODWithDelivery: body => {
                const deviceInfo = Utils.getDeviceInfoForOrder();
                const image = body['image'];
                delete body['image'];
                if (deviceInfo) {
                    body['order_source'] = {
                        ...deviceInfo
                    }
                }
                let formData = new FormData();
                formData.append('inputs', JSON.stringify(body));
                image && formData.append('image', image);

                return {
                    url: '/order/place/cashOnDelivery/shop',
                    method: 'POST',
                    body: formData,
                    success: null,
                    error: null
                }
            },
            confirmCODTakeaway: body => {
                const deviceInfo = Utils.getDeviceInfoForOrder();
                const image = body['image'];
                delete body['image'];
                if (deviceInfo) {
                    body['order_source'] = {
                        ...deviceInfo
                    }
                }
                let formData = new FormData();
                formData.append('inputs', JSON.stringify(body));
                image && formData.append('image', image);

                return {
                    url: '/order/place/cashOnDelivery/takeaway',
                    method: 'POST',
                    body: formData,
                    success: null,
                    error: null
                }
            }
        };
        endpoints.track = {
            orders: (page) => {
                const skip = (page - 1) * 10;
                return {
                    url: `/order/track/upcoming?skip=${skip}&limit=10`,
                    method: 'GET',
                    body: null,
                    success: GET_TRACKING_ORDERS_SUCCESS,
                    error: GET_TRACKING_ORDERS_ERROR
                }
            },
            ordersCount: () => {
                return {
                    url: '/order/track/upcoming/c',
                    method: 'GET',
                    body: null,
                    success: GET_TRACKING_ORDERS_COUNT_SUCCESS,
                    error: GET_TRACKING_ORDERS_COUNT_ERROR
                }
            },
            details: (shopId, categoryId, orderId) => {
                return {
                    url: '/order/track/viewProducts',
                    method: 'POST',
                    body: {
                        category_id: categoryId,
                        shop_id: shopId,
                        order_id: orderId
                    },
                }
            },
            products: (categoryId, shopId, orderId) => {
                return {
                    url: '/order/track/viewProducts',
                    method: 'POST',
                    body: {
                        category_id: categoryId,
                        shop_id: shopId,
                        order_id: orderId
                    },
                    success: GET_PRODUCTS_DETAILS,
                    error: ERROR
                }
            },
            getReplacementTitles: () => {
                return {
                    url: '/order/view/replacement/titles',
                    method: 'GET',
                    body: null,
                    success: REPLACEMENT_TITLES_FETCH_SUCCESS,
                    error: REPLACEMENT_TITLES_FETCH_ERROR
                }
            },
            getCancelOrderTitles: () => {
                return {
                    url: '/order/view/cancel/titles',
                    method: 'GET',
                    body: null,
                    success: CANCEL_ORDER_TITLES_FETCH_SUCCESS,
                    error: CANCEL_ORDER_TITLES_FETCH_ERROR
                }
            },
            verifyProduct: (body) => {
                let formData = new FormData();
                Object.keys(body).forEach(key => (
                    formData.append(key, body[key])
                ));
                return {
                    url: '/order/track/verifyProducts',
                    method: 'POST',
                    body: formData,
                    success: null,
                    error: null
                }
            },
            verifyOrder: (categoryId, orderId, shopId) => {
                return {
                    url: '/order/track/verifyOrder',
                    method: 'POST',
                    body: {
                        category_id: categoryId,
                        shop_id: shopId,
                        order_id: orderId
                    },
                    success: null,
                    error: null
                }
            },
            notifyMsg: (orderId) => {
                return {
                    url: '/order/track/notify/msg',
                    method: 'POST',
                    body: { order_id: orderId },
                    success: null,
                    error: null
                }
            },
            trackDelivery:(orderId)=>{
                     return {
                    url: '/order/track/delivery/track',
                    method: 'POST',
                    body: { order_id: orderId },
                    success: null,
                    error: null
                }
            }
            ,
            fetchRoute: (orderMid, source, destination) => {
                return {
                    url: '/order/track/delivery/coord',
                    method: 'POST',
                    body: {
                        order_mid: orderMid,
                        source: { type: 'Point', coordinates: [source.lat, source.lng] },
                        destination: { type: 'Point', coordinates: [destination.lat, destination.lng] }
                    },
                    success: null,
                    error: null
                }
            },
             
        };
        endpoints.global = {
            enquiry: (body) => {
                return {
                    url: '/enquiry/form',
                    method: 'POST',
                    body,
                    success: null,
                    error:
                        null
                }
            }
        };
        endpoints.orderHelp = {
            getTitles: (orderId) => {
                return {
                    url: `/order/help/titles?order_id=${orderId}`,
                    method: 'GET',
                    body: null,
                    success: null,
                    error: null
                }
            },
            getHelpContent: (helpId) => {
                return {
                    url: `/order/help/content?title_id=${helpId}`,
                    method: 'GET',
                    body: null,
                    success: null,
                    error: null
                }
            }
        };
        endpoints.orderSupport = {
            ask: (title, email, phoneNumber, message) => {
                return {
                    url: '/order/support/ask',
                    method: 'POST',
                    body: {
                        phone_num: phoneNumber,
                        title,
                        email_id: email,
                        message
                    },
                    success: null,
                    error: null
                }
            }
        };
        endpoints.offers = {
            getOffers: (stores) => {
                return {
                    url: '/notify/offer',
                    method: 'POST',
                    body: {
                        stores
                    },
                    success: OFFERS_FETCH_SUCCESS,
                    error: ERROR
                };
            }
        };
        endpoints.sponsors = {
            getCount: () => {
                return {
                    url: '/ads/count',
                    method: 'POST',
                    body: null,
                    success: SCRATCH_CARD_COUNT_SUCCESS,
                    error: ERROR
                }
            },
            fetchAds: (deliveryLocation, productSearchLocation) => {
                return {
                    url: '/ads/shopAds',
                    method: 'POST',
                    body: {
                        "searchLocation": {
                            "type": "Point",
                            "coordinates": [productSearchLocation.lng, productSearchLocation.lat]
                        },
                        "deliveryLocation": {
                            "type": "Point",
                            "coordinates": [deliveryLocation.lng, deliveryLocation.lat]
                        },
                        "maxDistance": 5000
                    },
                    success: SCRATCH_CARD_COUNT_SUCCESS,
                    error: SCRATCH_CARD_FETCH_ERROR
                }
            },
            activateScard: (scardId) => {
                return {
                    url: '/ads/accept',
                    method: 'POST',
                    body: {
                        scard_id: scardId
                    },
                    success: null,
                    error: null
                }
            },
            recordAdClicks: (adId) => {
                return {
                    url: '/ads/clickAd',
                    method: 'POST',
                    body: {
                        ad_id: adId,
                        device_uniqueid: "e3dcdsr45gvgstg65uhs3e4tgf"
                    },
                    success: null,
                    error: null
                }
            }
        };
        return endpoints;
    }
}

export default ApiEndpoints;
