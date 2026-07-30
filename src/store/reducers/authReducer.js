import {
    CLEAR_USER_PROFILE,
    LOGIN_ERROR,
    LOGIN_SUCCESS,
    LOGOUT_SUCCESS,
    SET_GUEST_TOKEN,
    SET_GUEST_USER_ERROR,
    SET_LOGGED_IN_TOKEN_FROM_STORAGE,
    SET_SIGN_UP_SUCCESS,
    SET_TOKEN_AND_USERNAME,
    SET_USER_AS_GUEST,
    SET_USER_PROFILE
} from "../actionTypes/auth-actions";
import AuthUtils from "../../utils/AuthUtils";
import {LocationUtils} from "../../utils/LocationUtils";
import CartUtils from "../../utils/CartUtils";

const initialState = {
    token: null,
    isGuest: null,
    username: null,
    userProfile: null
};

const authReducer = (state = initialState, action) => {

    switch (action.type) {
        case SET_GUEST_TOKEN:
            return setGuestToken(state, action);
        case SET_TOKEN_AND_USERNAME:
            return setTokenAndUsername(state, action);
        case SET_GUEST_USER_ERROR:
            return setGuestUserError(state, action);
        case LOGOUT_SUCCESS:
        case LOGIN_ERROR:
            return logout(state);
        case LOGIN_SUCCESS:
            return loginSuccess(state, action);
        case SET_SIGN_UP_SUCCESS:
            return loginSuccess(state, action);
        case SET_LOGGED_IN_TOKEN_FROM_STORAGE:
            return setTokenFromStorage(state);
        case SET_USER_PROFILE:
            return setUserProfile(state, action);
        case CLEAR_USER_PROFILE:
            return {
                ...state,
                userProfile: null
            };
        case SET_USER_AS_GUEST:
            AuthUtils.clearAll();
            return {
                ...state,
                token: null,
                isGuest: true,
                username: null
            };
        default:
            return state;
    }
};

const setUserProfile = (state, action) => {
    return {
        ...state,
        userProfile: action.payload.data
    }
};

const setTokenAndUsername = (state) => {
    const token = AuthUtils.getToken();
    const username = AuthUtils.getUserName();
    return {
        ...state,
        token: token,
        isGuest: true,
        username: username
    }
};

const loginSuccess = (state, action) => {
    const token = action.payload.data.auth_token.access.token;
    const refreshToken = action.payload.data.auth_token.refresh.token;
    const expDate = action.payload.data.auth_token.access.exp;
    AuthUtils.saveTokenExpDate(expDate);
    const lastName = action.payload.data.user_profile.last_name;
    const firstName = action.payload.data.user_profile.first_name;
    const username = firstName + " " + lastName;
    const isNew = action.payload.data.user_profile.iam_new;
    AuthUtils.setIsUserNew(isNew);
    AuthUtils.setIsGuest(false);
    AuthUtils.storeToken(token);
    AuthUtils.storeRefreshToken(refreshToken);
    AuthUtils.storeUsername(username);
    CartUtils.setNumberOfItems(0);
    LocationUtils.clearUserSavedAddressAndType();
    return {
        ...state,
        token: token,
        isGuest: false,
        username: username
    }
};

const loginError = (state) => {
    return {
        ...state
    }
};

const setTokenFromStorage = (state) => {
    const token = AuthUtils.getToken();
    const username = AuthUtils.getUserName();
    return {
        ...state,
        token: token,
        isGuest: false,
        username: username
    }
};

const setGuestToken = (state, action) => {
    const token = action.payload.data.auth_token.access.token;
    const username = action.payload.data.user_profile.last_name;
    AuthUtils.setIsGuest(true);
    AuthUtils.storeToken(token);
    AuthUtils.storeUsername(username);
    return {
        ...state,
        token: token,
        isGuest: true,
        username: username
    }
};

const logout = (state) => {
    AuthUtils.setIsUserNew(false);
    AuthUtils.clearAll();
    return {
        ...state,
        token: null,
        isGuest: true,
        username: null
    }
};

const setGuestUserError = (state) => {
    AuthUtils.clearAll();
    return {
        token: null,
        isGuest: null,
        username: null
    }
};

export default authReducer;
