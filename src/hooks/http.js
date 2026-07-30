import {useDispatch} from "react-redux";
import {useCallback, useReducer} from "react";
import axios from '../custom-axios';
import {API_ERROR} from "../store/actionTypes/global-actions";
import {TOKEN_EXPIRED} from "../utils/constants";
import {LOGOUT_SUCCESS} from "../store/actionTypes/auth-actions";
import {CLEAR_CART} from "../store/actionTypes/cart-actions";
import {LocationUtils} from "../utils/LocationUtils";
import history from '../utils/history';

const SENDING = 'SENDING';
const DONE = 'DONE';
const ERROR = 'ERROR';
const CLEAR = 'CLEAR';

const initialState = {
    isLoading: false,
    error: null
};

const httpReducer = (state = initialState, action) => {
    switch (action.type) {
        case SENDING:
            return {
                ...state,
                isLoading: true
            };
        case DONE:
            return {
                ...state,
                isLoading: false
            };
        case ERROR:
            return {
                isLoading: false,
                error: action.payload
            };
        case CLEAR:
            return initialState;
        default:
            throw new Error("This should never occur!");
    }
};

const useHttp = () => {
    const [httpState, changeHttpState] = useReducer(httpReducer, initialState);
    const dispatch = useDispatch();

    const clear = useCallback(() => {
        changeHttpState({type: CLEAR});
    }, []);

    const sendRequest = useCallback(
        (url, method, body, actionTypeSuccess, actionTypeError, successCallback, errorCallback) => {
            changeHttpState({type: SENDING});
            console.log('API Request:', { url, method, body });
            axios({
                url: url,
                method: method,
                data: body,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                console.log('API Response:', response.data);
                dispatch({
                    type: actionTypeSuccess,
                    payload: response.data
                });
                successCallback && successCallback(response.data);
                changeHttpState({type: DONE});
            }).catch(error => {
                console.log('API Error:', error.response?.data || error.message);
                if (error?.response?.data?.token === TOKEN_EXPIRED) {
                    LocationUtils.clearUserSavedAddressAndType();
                    dispatch({type: LOGOUT_SUCCESS});
                    dispatch({type: CLEAR_CART});
                    history.push('/home');
                } else {
                    dispatch({
                        type: actionTypeError,
                        payload: error
                    });
                }
                errorCallback && errorCallback();
                dispatch({type: API_ERROR, payload: error});
                changeHttpState({type: ERROR, payload: error});
                changeHttpState({type: DONE});
            });
        },
        [dispatch]
    );

    return {
        sendRequest: sendRequest,
        isLoading: httpState.isLoading,
        error: httpState.error,
        clearError: clear
    }
};

export default useHttp;
