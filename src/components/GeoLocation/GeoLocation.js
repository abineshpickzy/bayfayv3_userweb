import React from 'react';
import Geolocation from "react-geolocation";
import useSyncDispatch from "../../hooks/dispatch";
import {
    API_ERROR,
    GEOLOCATION_ERROR_SHOW,
    SET_DELIVERY_GEO_LOCATION,
    SET_PRODUCT_SEARCH_GEO_LOCATION
} from "../../store/actionTypes/global-actions";
import {useSelector} from "react-redux";
import {LocationUtils} from "../../utils/LocationUtils";

const GeoLocation = ({deliveryLocation, productSearchLocation}) => {
    const {sendDispatch} = useSyncDispatch();

    const shouldShowGeolocationError = !useSelector(state => state.globalReducer.geoLocationErrorShowed);

    const setDeliveryCoordinates = (result) => {
        const coordinates = {
            lat: result.coords.latitude,
            lng: result.coords.longitude
        };
        deliveryLocation && sendDispatch(SET_DELIVERY_GEO_LOCATION, coordinates);
    };

    const setProductSearchCoordinates = (result) => {
        const coordinates = {
            lat: result.coords.latitude,
            lng: result.coords.longitude
        };
        productSearchLocation && sendDispatch(SET_PRODUCT_SEARCH_GEO_LOCATION, coordinates);
    };


    const onError = error => {
        sendDispatch(SET_PRODUCT_SEARCH_GEO_LOCATION, LocationUtils.getMostRecentProductSearchCoordinates());
        sendDispatch(SET_DELIVERY_GEO_LOCATION, LocationUtils.getMostRecentDeliveryCoordinates());
        const payload = {
            response: {
                data: {
                    message: error.message
                }
            }
        };
        if (shouldShowGeolocationError && !(LocationUtils.getMostRecentDeliveryCoordinates()?.lat !== 0)) {
            sendDispatch(API_ERROR, payload);
            sendDispatch(GEOLOCATION_ERROR_SHOW);
        }
    };

    return (
        <Geolocation
            onSuccess={result => {
                setDeliveryCoordinates(result);
                setProductSearchCoordinates(result);
            }}
            onError={onError}
            enableHighAccuracy={true}
        />
    );
};
export default GeoLocation;
