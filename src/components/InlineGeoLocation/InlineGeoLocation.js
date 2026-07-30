import React from 'react';
import Geolocation from "react-geolocation";
import {API_ERROR} from "../../store/actionTypes/global-actions";
import useSyncDispatch from "../../hooks/dispatch";

const InlineGeoLocation = ({onSuccess}) => {
    const {sendDispatch} = useSyncDispatch();

    const onError = error => {
        const payload = {
            response: {
                data: {
                    message: error.message
                }
            }
        };
        sendDispatch(API_ERROR, payload);
    };

    return (
        <Geolocation
            onSuccess={onSuccess}
            onError={onError}
            enableHighAccuracy={true}
        />
    );
};

export default InlineGeoLocation;
