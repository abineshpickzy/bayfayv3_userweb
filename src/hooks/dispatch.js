import {useDispatch} from "react-redux";
import {useCallback} from "react";

const useSyncDispatch = () => {
    const dispatch = useDispatch();
    const sendDispatch = useCallback((type, payload, ...extras) => {
        dispatch({
            type: type,
            payload: payload,
            extras: extras
        })
    }, [dispatch]);

    return {
        sendDispatch: sendDispatch
    }
};

export default useSyncDispatch;
