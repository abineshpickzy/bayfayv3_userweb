import React, {useEffect, useRef, useState} from 'react';
import './LocationSerach.scss';
import logo from '../../assets/images/logo-final-512x512.png';
import GooglePlacesAutocomplete, {geocodeByAddress, getLatLng} from 'react-google-places-autocomplete';
import {useSelector} from "react-redux";
import Geocode from "react-geocode";
import ApiEndpoints from "../../utils/ApiEndpoints";
import useHttp from "../../hooks/http";
import useSyncDispatch from "../../hooks/dispatch";
import {USER_LOCATION_HOME, USER_LOCATION_WORK} from "../../utils/constants";
import GeoLocation from "../GeoLocation/GeoLocation";
import {
    SET_DELIVERY_GEO_LOCATION,
    SET_DELIVERY_LOCATION_ADDRESS,
    SET_PRODUCT_SEARCH_ADDRESS,
    SET_PRODUCT_SEARCH_GEO_LOCATION,
    SHOW_LOGIN_MODAL
} from "../../store/actionTypes/global-actions";
import {CURRENT_LOCATION, LocationUtils, SEARCHED_LOCATION} from "../../utils/LocationUtils";
import EditDeliveryAddressModal from "../EditDeliveryAddressModal/EditDeliveryAddressModal";
import AlertDialog from "../AlertDialog/AlertDialog";

const radius = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const LocationSearch = (props) => {
    const {increaseCounter, setError, resetCounter} = props;

    const {sendDispatch} = useSyncDispatch();
    const apiEndPoints = new ApiEndpoints();

    const [useCurrentLocation, setUserCurrentLocation] = useState(false);
    const [useCurrentLocationForDelivery, setUseCurrentLocationForDelivery] = useState(true);
    const [useCurrentLocationForProductSearch, setUseCurrentLocationForProductSearch] = useState(true);
    const [distance, setDistance] = useState(LocationUtils.getMostRecentDistance());
    const [deliveryAddressDetails, setDeliveryAddressDetails] = useState({address: '', searched: false});
    const [productSearchAddressDetails, setProductSearchAddressDetails] = useState({address: '', searched: false});
    const [showInitialDeliverySuggestion, setShowInitialDeliverySuggestion] = useState(false);
    const [showInitialSearchSuggestion, setShowInitialSearchSuggestion] = useState(false);
    const [showEditDeliveryAddressModal, setShowEditDeliveryAddressModal] = useState(false);
    const [isProductSearch, setIsProductSearch] = useState(false);
    const [showDeleteAddressConfirmation, setShowDeleteAddressConfirmation] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState('');

    const deliveryLocationInputRef = useRef(null);
    const searchLocationInputRef = useRef(null);
    const {sendRequest} = useHttp();

    const deliveryLocationCoordinates = useSelector(state => state.globalReducer.deliveryLocationCoordinates);
    const productSearchLocationCoordinates = useSelector(state => state.globalReducer.productSearchLocationCoordinates);
    const deliveryLocationAddress = useSelector(state => state.globalReducer.deliveryLocationAddress);
    const isGuest = useSelector(state => state.authReducer.isGuest);

    let userLocations = useSelector(state => state.authReducer.userProfile?.address);

    if (!userLocations) {
        userLocations = [];
    }

    useEffect(() => {
        const isDefaultCoordinates = ((productSearchLocationCoordinates && productSearchLocationCoordinates.lng === 0 &&
            productSearchLocationCoordinates.lat === 0) &&
            (deliveryLocationCoordinates && deliveryLocationCoordinates.lng === 0 && deliveryLocationCoordinates.lat === 0));
        if (isDefaultCoordinates) {
            setUserCurrentLocation(true);
        }
    }, []);

    useEffect(() => {
        const isDefaultCoordinates = deliveryLocationCoordinates && deliveryLocationCoordinates.lng === 0 && deliveryLocationCoordinates.lat === 0;
        if (!isDefaultCoordinates && deliveryLocationCoordinates && !deliveryAddressDetails.searched) {
            setUseCurrentLocationForDelivery(false);
            Geocode.fromLatLng(deliveryLocationCoordinates.lat, deliveryLocationCoordinates.lng)
                .then(response => {
                        const {address, area, zipcode} = LocationUtils.extractLocation(response);
                        LocationUtils.clearUserSavedAddressAndType();
                        LocationUtils.saveUserLocationChosenType(CURRENT_LOCATION);
                        sendDispatch(SET_DELIVERY_LOCATION_ADDRESS, {
                            address,
                            area,
                            zipcode
                        });
                        const fullAddress = response.results[0].formatted_address;
                        setDeliveryAddressDetails({address: fullAddress, searched: false});
                        if (deliveryLocationInputRef && deliveryLocationInputRef.current) {
                            deliveryLocationInputRef.current.value = fullAddress;
                        }
                    },
                    error => {
                        console.error(error);
                    })
        } else if (!deliveryLocationCoordinates) {
            setDeliveryAddressDetails({address: '', searched: false});
            deliveryLocationInputRef.current.value = '';
        }
    }, [deliveryLocationCoordinates]);

    useEffect(() => {
        const isDefaultCoordinates = productSearchLocationCoordinates && productSearchLocationCoordinates.lng === 0 && productSearchLocationCoordinates.lat === 0;
        if (!isDefaultCoordinates && productSearchLocationCoordinates && !productSearchAddressDetails.searched) {
            setUseCurrentLocationForProductSearch(false);
            Geocode.fromLatLng(productSearchLocationCoordinates.lat, productSearchLocationCoordinates.lng)
                .then(response => {
                        const {address, area, zipcode} = LocationUtils.extractLocation(response);
                        sendDispatch(SET_PRODUCT_SEARCH_ADDRESS, {
                            address,
                            area,
                            zipcode
                        });
                        const fullAddress = response.results[0].formatted_address;
                        setProductSearchAddressDetails({address: fullAddress, searched: false});
                        if (searchLocationInputRef.current) {
                            searchLocationInputRef.current.value = fullAddress;
                        }
                    },
                    error => {
                        console.error(error);
                    })
        } else if (!productSearchLocationCoordinates) {
            setProductSearchAddressDetails({address: '', searched: false});
            searchLocationInputRef.current.value = '';
        }
    }, [productSearchLocationCoordinates]);


    useEffect(() => {
        if (deliveryLocationCoordinates && productSearchLocationCoordinates) {
            resetCounter();
            getPublicShops();
            getPublicShops2();
            getGlobalShops();
            getPrivateShops();
        }
    }, [deliveryLocationCoordinates, productSearchLocationCoordinates, distance]);

    const getPrivateShops = () => {
        const searchLocation = {
            "type": "Point",
            "coordinates": [productSearchLocationCoordinates.lng, productSearchLocationCoordinates.lat]
        };
        const deliveryLocation = {
            "type": "Point",
            "coordinates": [deliveryLocationCoordinates.lng, deliveryLocationCoordinates.lat]
        };
        const maxDistance = distance * 1000;
        const {url, method, body, success, error} =
            apiEndPoints
                .getApiEndpoints()
                .shops
                .privateShops(searchLocation, deliveryLocation, maxDistance, increaseCounter, setError);

        sendRequest(url, method, body, success, error);
    };

    const getPublicShops = () => {
        const searchLocation = {
            "type": "Point",
            "coordinates": [productSearchLocationCoordinates.lng, productSearchLocationCoordinates.lat]
        };
        const deliveryLocation = {
            "type": "Point",
            "coordinates": [deliveryLocationCoordinates.lng, deliveryLocationCoordinates.lat]
        };
        const maxDistance = distance * 1000;
        const {url, method, body, success, error} =
            apiEndPoints
                .getApiEndpoints()
                .shops
                .publicShops(searchLocation, deliveryLocation, maxDistance, 1);

        sendRequest(url, method, body, success, error, increaseCounter, setError);
    };

    const getPublicShops2 = () => {
        const searchLocation = {
            "type": "Point",
            "coordinates": [productSearchLocationCoordinates.lng, productSearchLocationCoordinates.lat]
        };
        const deliveryLocation = {
            "type": "Point",
            "coordinates": [deliveryLocationCoordinates.lng, deliveryLocationCoordinates.lat]
        };
        const maxDistance = distance * 1000;
        const {url, method, body, success, error} =
            apiEndPoints
                .getApiEndpoints()
                .shops
                .publicShops(searchLocation, deliveryLocation, maxDistance, 2);
        sendRequest(url, method, body, success, error, increaseCounter);
    };

    const getGlobalShops = () => {
        const searchLocation = {
            "type": "Point",
            "coordinates": [productSearchLocationCoordinates.lng, productSearchLocationCoordinates.lat]
        };
        const deliveryLocation = {
            "type": "Point",
            "coordinates": [deliveryLocationCoordinates.lng, deliveryLocationCoordinates.lat]
        };
        const maxDistance = distance * 1000;
        const {url, method, body, success, error} =
            apiEndPoints
                .getApiEndpoints()
                .shops
                .globalShops(searchLocation, deliveryLocation, maxDistance);

        sendRequest(url, method, body, success, error, increaseCounter);
    };

    useEffect(() => {
        document.addEventListener('click', handleClick, false);
    }, []);

    const getUserProfile = () => {
        const {url, method, body, success, error} = apiEndPoints.getApiEndpoints().user.getUserProfile();
        sendRequest(url, method, body, success, error);
    };

    const handleClick = e => {
        if (deliveryLocationInputRef.current && !deliveryLocationInputRef.current.contains(e.target)) {
            setShowInitialDeliverySuggestion(false);
        }
        if (deliveryLocationInputRef.current && deliveryLocationInputRef.current.contains(e.target)) {
            setDeliveryAddressDetails({address: '', searched: false});
            setShowInitialDeliverySuggestion(true);
        }
        if (searchLocationInputRef.current && !searchLocationInputRef.current.contains(e.target)) {
            setShowInitialSearchSuggestion(false);
        }
        if (searchLocationInputRef.current && searchLocationInputRef.current.contains(e.target)) {
            setProductSearchAddressDetails({address: '', searched: false});
            setShowInitialSearchSuggestion(true);
        }
    };

    const onDeliveryLocationChange = () => {
        if (deliveryLocationInputRef.current.value && deliveryLocationInputRef.current.value.length > 0) {
            setShowInitialDeliverySuggestion(false)
        } else {
            setUseCurrentLocationForDelivery(false);
            setUserCurrentLocation(false);
            setShowInitialDeliverySuggestion(true);
            sendDispatch(SET_DELIVERY_GEO_LOCATION, null);
        }
    };

    const onSearchLocationChange = () => {
        if (searchLocationInputRef.current.value && searchLocationInputRef.current.value.length > 0) {
            setShowInitialSearchSuggestion(false)
        } else {
            setUseCurrentLocationForProductSearch(false);
            setShowInitialSearchSuggestion(true);
            setUserCurrentLocation(false);
            sendDispatch(SET_PRODUCT_SEARCH_GEO_LOCATION, null);
        }
    };

    const setCurrentLocationDelivery = () => {
        setUserCurrentLocation(true);
        setUseCurrentLocationForDelivery(true);
        setDeliveryAddressDetails({...deliveryAddressDetails, searched: false});
    };

    const setCurrentLocationProductSearch = () => {
        setUserCurrentLocation(true);
        setUseCurrentLocationForProductSearch(true);
        setProductSearchAddressDetails({...productSearchAddressDetails, searched: false});
    };

    const setDeliveryLocation = (arg) => {
        setDeliveryAddressDetails({address: arg.description, searched: true});
        LocationUtils.clearUserSavedAddressAndType();
        LocationUtils.saveUserLocationChosenType(SEARCHED_LOCATION);
        sendDispatch(SET_DELIVERY_LOCATION_ADDRESS, {
            address: arg?.structured_formatting.main_text?.toString().trim(),
            area: arg?.structured_formatting.secondary_text?.toString().trim(),
            zipcode: null
        });
        geocodeByAddress(arg.description)
            .then(results => getLatLng(results[0]))
            .then(({lat, lng}) => {
                    setUseCurrentLocationForDelivery(false);
                    const coordinates = {lat, lng};
                    sendDispatch(SET_DELIVERY_GEO_LOCATION, coordinates);
                }
            );
    };

    const setProductSearchLocation = (arg) => {
        setProductSearchAddressDetails({address: arg.description, searched: true});
        sendDispatch(SET_PRODUCT_SEARCH_ADDRESS, {
            address: arg?.structured_formatting.main_text?.toString().trim(),
            area: arg?.structured_formatting.secondary_text?.toString().trim(),
            zipcode: null
        });
        geocodeByAddress(arg.description)
            .then(results => getLatLng(results[0]))
            .then(({lat, lng}) => {
                    setUseCurrentLocationForProductSearch(false);
                    const coordinates = {lat, lng};
                    sendDispatch(SET_PRODUCT_SEARCH_GEO_LOCATION, coordinates);
                }
            );
    };

    const setDeliveryLocationFromSaved = location => {
        const address = location.address;
        const {area, street, zipcode} = location.address;
        LocationUtils.clearUserSavedAddressAndType();
        LocationUtils.saveUserLocationChosenType(location.type);
        sendDispatch(SET_DELIVERY_LOCATION_ADDRESS, {
            address: street,
            area,
            zipcode
        });
        const addressToSet = [address.street, address.area].join(', ');
        setDeliveryAddressDetails({address: addressToSet, searched: true});
        geocodeByAddress(addressToSet)
            .then(results => getLatLng(results[0]))
            .then(({lat, lng}) => {
                    setUseCurrentLocationForDelivery(false);
                    const coordinates = {lat, lng};
                    sendDispatch(SET_DELIVERY_GEO_LOCATION, coordinates);
                }
            );
    };

    const showDeleteConfirmationDialog = id => {
        setAddressToDelete(id);
        setShowDeleteAddressConfirmation(true);
    };

    const onDeleteAddressConfirm = () => {
        const {url, method, body, success, error} = apiEndPoints.getApiEndpoints().user.deleteAddress(addressToDelete);
        sendRequest(url, method, body, success, error,
            _ => getUserProfile());
        setShowDeleteAddressConfirmation(false)
    };

    const onDeleteAddressReject = () => {
        setShowDeleteAddressConfirmation(false);
    };

    const setProductSearchLocationFromSaved = location => {
        const address = location.address;
        const {area, street, zipcode} = location.address;
        sendDispatch(SET_PRODUCT_SEARCH_ADDRESS, {
            address: street,
            area,
            zipcode
        });
        const addressToSet = [address.street, address.area].join(', ');
        setProductSearchAddressDetails({address: addressToSet, searched: true});
        geocodeByAddress(addressToSet)
            .then(results => getLatLng(results[0]))
            .then(({lat, lng}) => {
                    setUseCurrentLocationForProductSearch(false);
                    const coordinates = {lat, lng};
                    sendDispatch(SET_PRODUCT_SEARCH_GEO_LOCATION, coordinates);
                }
            );
    };

    const saveOrUpdateAddress = (isProductSearch) => {
        if (!isGuest) {
            setIsProductSearch(isProductSearch);
            setShowEditDeliveryAddressModal(true);
        } else {
            sendDispatch(SHOW_LOGIN_MODAL);
        }
    };

    return (
        <div className='background-light-silver d-flex flex-row py-2 mb-3'>
            <div className='w-15 d-flex justify-content-center min-width-100px'>
                <img src={logo} alt="Logo" className="img-fluid home-logo"/>
            </div>
            <div className='d-flex flex-row w-70 align-items-center justify-content-around'>
                <div className='d-flex flex-column w-80'>
                    <div className="input-group mb-2 position-relative">
                        {
                            showInitialDeliverySuggestion &&
                            <div className="initial-suggestions position-absolute">
                                <div
                                    className="suggestion p-2 d-flex flex-row align-items-center border-bottom"
                                    onClick={setCurrentLocationDelivery}
                                >
                                    <i className="far fa-location-arrow suggestion-icon color-purple"/>
                                    <span className='d-flex flex-column'>
                                                    <span>Auto Select Current Location</span>
                                                    <small className='suggestion-description'>Using GPS</small>
                                                </span>
                                </div>
                                {userLocations.map(location => (
                                    <div
                                        key={location.id}
                                        className="suggestion p-2 d-flex flex-row align-items-center justify-content-between border-bottom"
                                    >
                                        <div className='d-flex flex-row align-items-center flex-grow-1'
                                             onClick={() => setDeliveryLocationFromSaved(location)}>
                                            {location.type === USER_LOCATION_HOME &&
                                            <i className="far fa-home suggestion-icon text-primary"/>}
                                            {location.type === USER_LOCATION_WORK &&
                                            <i className="far fa-briefcase suggestion-icon text-success"/>}
                                            {location.type !== USER_LOCATION_HOME && location.type !== USER_LOCATION_WORK &&
                                            <i className="far fa-building suggestion-icon text-info"/>}
                                            <span className='d-flex flex-column'>
                                                        <span>{location.type}</span>
                                                        <small
                                                            className='suggestion-description'>
                                                            {location.address.street}, {location.address.area}
                                                        </small>
                                            </span>
                                        </div>
                                        <i className="far fa-trash-alt suggestion-icon text-secondary fa-pull-right"
                                           onClick={() => showDeleteConfirmationDialog(location.id)}/>
                                    </div>
                                ))}
                            </div>
                        }
                        <img src={require('../../assets/images/delivery-location.png')} alt="deliveryLocationImg"
                             className='icon'/>
                        <GooglePlacesAutocomplete
                            idPrefix={'1'}
                            inputClassName='form-control form-control pl-5 transparent-border'
                            placeholder='Select delivery location'
                            onSelect={setDeliveryLocation}
                            initialValue={deliveryAddressDetails.address}
                            renderInput={(props) => (
                                <input
                                    ref={deliveryLocationInputRef}
                                    onKeyUp={onDeliveryLocationChange}
                                    onClick={onDeliveryLocationChange}
                                    value={deliveryAddressDetails.address}
                                    className={`form-control custom-form-control form-control pl-5 transparent-border border-radius-0 
                                    ${deliveryAddressDetails.address?.length > 0 ? 'p-t-20px' : ''}`}
                                    {...props}
                                />
                            )}
                            renderSuggestions={(active, suggestions, onSelectSuggestion) => (
                                <div className="suggestions-container position-absolute">
                                    {
                                        suggestions.map((suggestion) => (
                                            <div
                                                key={suggestion.place_id}
                                                className="suggestion p-2 d-flex flex-row align-items-center justify-content-between border-bottom"
                                                onClick={(event) => onSelectSuggestion(suggestion, event)}
                                            >

                                                <div className='d-flex flex-row align-items-center'>
                                                    <i className="fas fa-map-marker-alt suggestion-icon text-danger"/>
                                                    <span className='d-flex flex-column'>
                                                    <span>
                                                                {suggestion.structured_formatting.main_text}
                                                            </span>
                                                        <small
                                                            className='suggestion-description'>{suggestion.structured_formatting.secondary_text}</small>
                                                    </span>
                                                </div>
                                                <i className="far fa-save suggestion-icon text-secondary fa-pull-right"
                                                   onClick={() => saveOrUpdateAddress(false)}/>
                                            </div>
                                        ))
                                    }
                                </div>
                            )}
                        />
                        {deliveryAddressDetails.address?.length > 0 &&
                        < span className='position-absolute input-label'>Delivery Location</span>}
                    </div>
                    <div className="input-group position-relative">
                        {
                            showInitialSearchSuggestion &&
                            <div className="initial-suggestions position-absolute">
                                <div
                                    className="suggestion p-2 d-flex flex-row align-items-center border-bottom"
                                    onClick={setCurrentLocationProductSearch}
                                >
                                    <i className="far fa-location-arrow suggestion-icon color-purple"/>
                                    <span className='d-flex flex-column'>
                            <span>Auto Select Current Location</span>
                            <small className='suggestion-description'>Using GPS</small>
                            </span>
                                </div>
                                {userLocations.map(location => (
                                    <div
                                        key={location.id}
                                        className="suggestion p-2 d-flex flex-row align-items-center justify-content-between border-bottom"
                                    >
                                        <div className='d-flex flex-row align-items-center flex-grow-1'
                                             onClick={() => setProductSearchLocationFromSaved(location)}>
                                            {location.type === USER_LOCATION_HOME &&
                                            <i className="far fa-home suggestion-icon text-primary"/>}
                                            {location.type === USER_LOCATION_WORK &&
                                            <i className="far fa-briefcase suggestion-icon text-success"/>}
                                            {location.type !== USER_LOCATION_HOME && location.type !== USER_LOCATION_WORK &&
                                            <i className="far fa-building suggestion-icon text-info"/>}
                                            <span className='d-flex flex-column'>
                            <span>{location.type}</span>
                            <small
                                className='suggestion-description'>
                            {location.address.street}, {location.address.area}
                            </small>
                            </span>
                                        </div>
                                        <i className="far fa-trash-alt suggestion-icon text-secondary fa-pull-right"
                                           onClick={() => showDeleteConfirmationDialog(location.id)}/>
                                    </div>
                                ))}
                            </div>
                        }
                        <img src={require('../../assets/images/product-search-location.png')}
                             alt="productSearchLocation"
                             className='icon'/>
                        <GooglePlacesAutocomplete
                            idPrefix={'2'}
                            inputClassName='form-control form-control pl-5 transparent-border'
                            placeholder='Product Search Location'
                            onSelect={setProductSearchLocation}
                            initialValue={productSearchAddressDetails.address}
                            renderInput={(props) => (
                                <input
                                    ref={searchLocationInputRef}
                                    value={productSearchAddressDetails.address}
                                    onKeyUp={onSearchLocationChange}
                                    onClick={onSearchLocationChange}
                                    className={`form-control custom-form-control form-control pl-5 transparent-border
                                    ${productSearchAddressDetails.address?.length > 0 ? 'p-t-20px' : ''}`}
                                    {...props}
                                />
                            )}
                            renderSuggestions={(active, suggestions, onSelectSuggestion) => (
                                <div className="suggestions-container position-absolute">
                                    {
                                        suggestions.map((suggestion) => (
                                            <div
                                                key={suggestion.place_id}
                                                className="suggestion p-2 d-flex flex-row align-items-center justify-content-between border-bottom"
                                                onClick={(event) => onSelectSuggestion(suggestion, event)}
                                            >
                                                <div className='d-flex flex-row align-items-center'>
                                                    <i className="fas fa-map-marker-alt suggestion-icon text-danger"/>
                                                    <span className='d-flex flex-column'>
                            <span>
                            {suggestion.structured_formatting.main_text}
                            </span>
                            <small
                                className='suggestion-description'>{suggestion.structured_formatting.secondary_text}</small>
                            </span>
                                                </div>
                                                < i className="far fa-save suggestion-icon text-secondary fa-pull-right"
                                                    onClick={() => saveOrUpdateAddress(true)}/>
                                            </div>
                                        ))
                                    }
                                </div>
                            )}
                        />
                        {productSearchAddressDetails.address?.length > 0 &&
                        <span className='position-absolute input-label'>Product Search Location</span>}
                    </div>
                </div>
                <div className="dropdown">
                    <button type="button" className="btn btn btn-circle distance"
                            data-toggle="dropdown">
                        {distance} km
                    </button>
                    <div className="dropdown-menu">
                        {radius.map(value => {
                            return <span className="dropdown-item hover-grey"
                                         key={value}
                                         onClick={() => {
                                             setDistance(value);
                                             LocationUtils.saveMostRecentDistance(value);
                                         }}>{value} km</span>
                        })}
                    </div>
                </div>
            </div>
            <EditDeliveryAddressModal show={showEditDeliveryAddressModal} savingAddress={true}
                                      isProductSearch={isProductSearch}
                                      clickBackdrop={() => setShowEditDeliveryAddressModal(false)}
                                      fullAddress={deliveryLocationAddress} getUserProfile={getUserProfile}/>
            {useCurrentLocation &&
            <GeoLocation deliveryLocation={useCurrentLocationForDelivery}
                         productSearchLocation={useCurrentLocationForProductSearch}/>}
            <AlertDialog show={showDeleteAddressConfirmation} clickBackdrop={onDeleteAddressReject}
                         confirmButtonText={'Yes'} title='Delete Location'
                         message={'Are you sure you want to delete saved location?'}
                         onConfirm={onDeleteAddressConfirm}/>
        </div>
    );
};
export default LocationSearch;
