import React, { useEffect, useRef, useState } from 'react';
import './UpdateLocationModal.scss';
import Aux from "../../utils/auxilary";
import RequestSpinner from "../RequestSpinner/RequestSpinner";
import ModalWrapper from "../ModalWrapper/ModalWrapper";
import useHttp from "../../hooks/http";
import ApiEndpoints from "../../utils/ApiEndpoints";
import GooglePlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";
import InlineGeoLocation from "../InlineGeoLocation/InlineGeoLocation";
import Geocode from "react-geocode";
import { LocationUtils } from "../../utils/LocationUtils";
import AlertDialog from "../AlertDialog/AlertDialog";

const HOME = 'Home';
const WORK = 'Work';
const OTHER = 'Other';

const UpdateLocationModal = ({ show, clickBackdrop, savedAddress, allSavedAddresses, getUserProfile }) => {
    const { sendRequest, isLoading } = useHttp();
    const apiEndpoints = new ApiEndpoints();

    const [address, setAddress] = useState('');
    const [addressInvalid, setAddressInvalid] = useState(false);
    const [area, setArea] = useState('');
    const [areaInvalid, setAreaInvalid] = useState(false);
    const [zipcode, setZipcode] = useState('');
    const [zipCodeInvalid, setZipcodeInvalid] = useState(false);
    const [landmark, setLandmark] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [typeInvalid, setTypeInvalid] = useState(false);
    const [addressType, setAddressType] = useState('');
    const [invalidTypeSelection, setInvalidTypeSelection] = useState(false);
    const googleLocationSearchInputRef = useRef(null);
    const [showInitialDeliverySuggestion, setShowInitialDeliverySuggestion] = useState(false);
    const [useCurrentLocation, setUserCurrentLocation] = useState(false);
    const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
    const [alreadySavedTypes, setAlreadySavedTypes] = useState([]);
    const [showOverwriteAlert, setShowOverwriteAlert] = useState(false);

    useEffect(() => {
        if (show) {
            if (savedAddress?.address) {
                setSelectedOption(savedAddress.type);
                savedAddress.address?.area && setArea(savedAddress.address.area);
                savedAddress.address.street && setAddress(savedAddress.address.street);
                savedAddress.address.zipcode && setZipcode(savedAddress.address.zipcode);
                savedAddress.address.landmark && setLandmark(savedAddress.address.landmark);
                setCoordinates({ lng: savedAddress.location.coordinates[0], lat: savedAddress.location.coordinates[1] });
            } else {
                setArea('');
                setAddress('');
                setZipcode('');
                setLandmark('');
                setSelectedOption('');
            }
        }
    }, [savedAddress, show]);

    useEffect(() => {
        if (show) {
            setInvalidTypeSelection(false);
            setAreaInvalid(false);
            setZipcodeInvalid(false);
            setTypeInvalid(false);
            setAddressInvalid(false);
            setShowOverwriteAlert(false);
            allSavedAddresses?.length > 0 && setAlreadySavedTypes(allSavedAddresses.map(address => address.type));
        }
    }, [show]);

    useEffect(() => {
        document.addEventListener('click', handleClick, false);
    }, []);

    const handleClick = e => {
        if (googleLocationSearchInputRef.current && !googleLocationSearchInputRef.current.contains(e.target)) {
            setShowInitialDeliverySuggestion(false);
        }
        if (googleLocationSearchInputRef.current && googleLocationSearchInputRef.current.contains(e.target)) {
            setShowInitialDeliverySuggestion(true);
        }
    };

    const changeSelectedOption = option => {
        if (selectedOption === option) {
            setSelectedOption(null);
        } else {
            setSelectedOption(option)
        }
    };

    const getUpdateAddressBody = () => {
        const chosenAddress = allSavedAddresses?.find(a => a.type === selectedOption);
        const address_ = {
            street: address,
            area: area,
            zipcode: zipcode
        };
        if (landmark?.toString().trim().length > 0) {
            address_['landmark'] = landmark;
        }
        return {
            id: chosenAddress.id,
            deliveryAddress: {
                location: {
                    type: "Point",
                    coordinates: [
                        chosenAddress.location.coordinates[0],
                        chosenAddress.location.coordinates[1],
                    ]
                },
                address: address_,
                is_default: chosenAddress.is_default,
                type: chosenAddress.type
            }
        }
    };

    const getAddAddressBody = () => {
        const address_ = {
            street: address,
            area: area,
            zipcode: zipcode
        };
        if (landmark?.toString().trim().length > 0) {
            address_['landmark'] = landmark;
        }
        const body = {
            deliveryAddress: {
                location: {
                    type: "Point",
                    coordinates: [
                        coordinates.lng,
                        coordinates.lat
                    ]
                },
                address: address_,
                is_default: false,
            }
        };
        if (selectedOption === OTHER) {
            body.deliveryAddress['type'] = addressType;
        } else {
            body.deliveryAddress['type'] = selectedOption;
        }

        return body;
    };

    const saveAddress = () => {
        const invalidSelection = !selectedOption || selectedOption?.length === 0;
        const isTypeInvalid = !addressType || addressType?.toString().trim().length === 0;
        const isAddressInvalid = !address || address.toString().trim().length === 0;
        const isZipcodeInvalid = !zipcode || zipcode.toString().trim().length === 0;
        const isAreaValid = googleLocationSearchInputRef?.current?.value?.length > 0
        setAreaInvalid(!isAreaValid);
        setAddressInvalid(isAddressInvalid);
        setZipcodeInvalid(isZipcodeInvalid);
        setInvalidTypeSelection(invalidSelection);
        (selectedOption === OTHER) && setTypeInvalid(isTypeInvalid);
        if (!invalidSelection && (selectedOption !== OTHER || !isTypeInvalid) && !isAddressInvalid && !isZipcodeInvalid && isAreaValid) {
            if (!savedAddress) {
                if (alreadySavedTypes.includes(selectedOption)) {
                    setShowOverwriteAlert(true);
                } else {
                    const apiBody = getAddAddressBody();
                    addAddress(apiBody);
                }
            } else {
                const apiBody = getUpdateAddressBody();
                updateAddress(apiBody);
            }
        }
    };

    const overwriteLocation = () => {
        setShowOverwriteAlert(false);
        const apiBody = getUpdateAddressBody();
        updateAddress(apiBody);
    };

    const updateAddress = apiBody => {
        const { url, method, body, success, error } =
            apiEndpoints
                .getApiEndpoints()
                .user
                .editAddress(apiBody);
        sendRequest(url, method, body, success, error, _ => {
            getUserProfile();
            clickBackdrop();
        }, error => clickBackdrop());
    };

    const addAddress = apiBody => {
        const { url, method, body, success, error } =
            apiEndpoints
                .getApiEndpoints()
                .user
                .addAddress(apiBody);
        sendRequest(url, method, body, success, error, _ => {
            getUserProfile();
            clickBackdrop();
        }, err => clickBackdrop())
    };

    const onLocationChange = () => {
        if (googleLocationSearchInputRef.current.value && googleLocationSearchInputRef.current.value.length > 0) {
            setShowInitialDeliverySuggestion(false)
        } else {
            setUserCurrentLocation(false);
            setShowInitialDeliverySuggestion(true);
        }
    };

    const setLocation = (arg) => {
        const address = arg.structured_formatting.main_text;
        const area = arg?.structured_formatting.secondary_text;
        setAddress(address);
        setArea(area);
        geocodeByAddress(arg.description)
            .then(results => getLatLng(results[0]))
            .then(({ lat, lng }) => {
                setCoordinates({ lat, lng });
            }
            );
    };

    const setCurrentLocation = () => {
        setUserCurrentLocation(true);
    };

    const onCurrentLocationSuccess = result => {
        setCoordinates({ lat: result.coords.latitude, lng: result.coords.longitude });
        Geocode.fromLatLng(result.coords.latitude, result.coords.longitude)
            .then(response => {
                const { address, area, zipcode } = LocationUtils.extractLocation(response);
                setAddress(address);
                setArea(area);
                setZipcode(zipcode);
            })
    };

    return (
        <ModalWrapper show={show} clickBackdrop={clickBackdrop}>
            <div className="modal-dialog w-500px" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">
                            {savedAddress ? 'Edit Address' : 'New Location'}
                        </h5>
                        <button type="button" className="close" aria-label="Close" onClick={clickBackdrop}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body d-flex flex-column align-items-center justify-content-start font-size-3">
                        <div className='d-flex mb-2 w-100'>
                            <div className="form-group flex-grow-1 mb-0">
                                <input type="text" className="form-control" id="hostNoFlat" value={address.toString().trim()}
                                    onChange={e => setAddress(e.target.value)}
                                    aria-describedby="hostNoFlat" placeholder="House no, Flat" />
                            </div>
                            <div className='w-50px d-flex align-items-center justify-content-center'>
                                <i className="fal fa-pencil font-size-1rem" />
                            </div>
                        </div>
                        {addressInvalid ?
                            <span
                                className='font-size-2 text-danger invalid-field'>House no, Flat is required</span> : null}

                        <div className='d-flex mb-2 mt-1 w-100 position-relative'>
                            {showInitialDeliverySuggestion ?
                                <div className="initial-suggestions initial-suggestion-modal position-absolute">
                                    <div
                                        className="suggestion p-2 d-flex flex-row align-items-center border-bottom"
                                        onClick={setCurrentLocation}
                                    >
                                        <i className="far fa-location-arrow suggestion-icon color-purple" />
                                        <span className='d-flex flex-column'>
                                            <span>Auto Select Current Location</span>
                                            <small className='suggestion-description'>Using GPS</small>
                                        </span>
                                    </div>
                                </div> : null}
                            <GooglePlacesAutocomplete
                                idPrefix={'1'}
                                inputClassName='form-control'
                                placeholder='Select delivery location'
                                onSelect={setLocation}
                                initialValue={area}
                                renderInput={(props) => (
                                    <input
                                        ref={googleLocationSearchInputRef}
                                        onKeyUp={onLocationChange}
                                        onClick={onLocationChange}
                                        value={area}
                                        className={`form-control google-search-location-input`}
                                        {...props}
                                    />
                                )}
                                renderSuggestions={(active, suggestions, onSelectSuggestion) => (
                                    <div className="suggestions-container position-absolute">
                                        {
                                            suggestions.map((suggestion) => (
                                                <div
                                                    key={suggestion.id}
                                                    className="suggestion p-2 d-flex flex-row align-items-center justify-content-between border-bottom"
                                                    onClick={(event) => onSelectSuggestion(suggestion, event)}
                                                >

                                                    <div className='d-flex flex-row align-items-center'>
                                                        <i className="fas fa-map-marker-alt suggestion-icon text-danger" />
                                                        <span className='d-flex flex-column'>
                                                            <span>
                                                                {suggestion.structured_formatting.main_text}
                                                            </span>
                                                            <small
                                                                className='suggestion-description'>{suggestion.structured_formatting.secondary_text}</small>
                                                        </span>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                )}
                            />
                            <div className='w-50px d-flex align-items-center justify-content-center flex-shrink-0'>
                                <i className="fal fa-map-marker-alt font-size-1rem" />
                            </div>
                        </div>
                        {areaInvalid ?
                            <span
                                className='font-size-2 text-danger invalid-field'>Location is required</span> : null}
                        <div className='d-flex mb-2 mt-1 w-100'>
                            <div className="form-group flex-grow-1 mb-0">
                                <input type="number" className="form-control" id="pincode" value={zipcode}
                                    onChange={e => setZipcode(e.target.value)}
                                    aria-describedby="pincode" placeholder="Pincode" />
                            </div>
                            <div className='w-50px d-flex align-items-center justify-content-center'>
                                <i className="fal fa-pencil font-size-1rem" />
                            </div>
                        </div>
                        {zipCodeInvalid ?
                            <span
                                className='font-size-2 text-danger invalid-field'>Zipcode is required</span> : null}
                        <div className='d-flex mb-2 mt-1 w-100'>
                            <div className="form-group flex-grow-1 mb-0">
                                <input type="text" className="form-control" id="landmark" value={landmark}
                                    onChange={e => setLandmark(e.target.value)}
                                    aria-describedby="landmark" placeholder="Landmark" />
                            </div>
                            <div className='w-50px d-flex align-items-center justify-content-center'>
                                <i className="fal fa-pencil font-size-1rem" />
                            </div>
                        </div>
                        {selectedOption === OTHER ? <Aux>
                            <div className='d-flex mb-2 mt-1 w-100'>
                                <div className="form-group flex-grow-1 mb-0">
                                    <input type="text" className={`form-control address-type`} id="landmark"
                                        value={addressType}
                                        onChange={e => setAddressType(e.target.value)}
                                        aria-describedby="addressType" placeholder="Type" />
                                </div>
                            </div>
                            {typeInvalid ?
                                <span
                                    className='font-size-2 text-danger invalid-field'>Type is required</span> : null}
                        </Aux> : null}
                        <div className='d-flex justify-content-start w-90'>
                            {(!savedAddress || savedAddress.type === HOME) ?
                                <button
                                    className='btn btn-light d-flex mr-5 align-items-center bg-transparent border-0 no-outline'
                                    onClick={() => changeSelectedOption(HOME)}>
                                    <i className="fas fa-home text-primary mr-2" />
                                    <span
                                        className={`${selectedOption === HOME ? 'text-black' : 'text-secondary'}`}>Home</span>
                                </button> : null}
                            {(!savedAddress || savedAddress.type === WORK) ?
                                <button
                                    className='btn btn-light d-flex mr-5 align-items-center bg-transparent border-0 no-outline'
                                    onClick={() => changeSelectedOption(WORK)}>
                                    <i className="fal fa-briefcase text-danger mr-2" />
                                    <span
                                        className={`${selectedOption === WORK ? 'text-black' : 'text-secondary'}`}>Work</span>
                                </button> : null}
                            {!savedAddress || savedAddress.type === OTHER ?
                                <button
                                    className='btn btn-light d-flex align-items-center bg-transparent border-0 no-outline'
                                    onClick={() => changeSelectedOption(OTHER)}>
                                    <i className="far fa-pencil-alt text-primary mr-2" />
                                    <span
                                        className={`${selectedOption === OTHER ? 'text-black' : 'text-secondary'}`}>Other</span>
                                </button> : null}
                        </div>
                        {invalidTypeSelection && !savedAddress ?
                            <span
                                className='font-size-2 text-danger invalid-field'>Please select a type</span> : null}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-light border" onClick={clickBackdrop}>Cancel</button>
                        <button type="button" className="btn btn-primary" onClick={saveAddress}>Save</button>
                    </div>
                </div>
            </div>
            {isLoading && <RequestSpinner />}
            {useCurrentLocation ? <InlineGeoLocation onSuccess={onCurrentLocationSuccess} /> : null}
            <AlertDialog show={showOverwriteAlert} clickBackdrop={() => setShowOverwriteAlert(false)}
                confirmButtonText={'Yes'} title={'Overwrite Existing Location'}
                message={`Are you sure you want to overwrite existing Location ${selectedOption}?`}
                onConfirm={overwriteLocation} />
        </ModalWrapper>
    );
};

export default UpdateLocationModal;
