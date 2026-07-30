import React, { useEffect, useState } from 'react';
import ModalWrapper from "../ModalWrapper/ModalWrapper";
import { CURRENT_LOCATION, LocationUtils, SEARCHED_LOCATION } from "../../utils/LocationUtils";
import { USER_LOCATION_HOME, USER_LOCATION_OTHER, USER_LOCATION_WORK } from "../../utils/constants";
import { SET_DELIVERY_LOCATION_ADDRESS } from "../../store/actionTypes/global-actions";
import useSyncDispatch from "../../hooks/dispatch";
import useHttp from "../../hooks/http";
import ApiEndpoints from "../../utils/ApiEndpoints";
import { useSelector } from "react-redux";
import RequestSpinner from "../RequestSpinner/RequestSpinner";
import './EditDeliveryAddressModal.scss';
import Aux from "../../utils/auxilary";

const HOME = 'Home';
const WORK = 'Work';
const OTHER = 'Other';

const EditDeliveryAddressModal = ({ show, clickBackdrop, fullAddress, savingAddress, getUserProfile, isProductSearch }) => {
    const { sendRequest, isLoading } = useHttp();
    const apiEndpoints = new ApiEndpoints();
    const { sendDispatch } = useSyncDispatch();

    const [area, setArea] = useState('');
    const [address, setAddress] = useState('');
    const [zipcode, setZipCode] = useState('');
    const [landmark, setLandmark] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [zipCodeInvalid, setZipCodeInvalid] = useState(false);
    const [addressInvalid, setAddressInvalid] = useState(false);
    const [typeInvalid, setTypeInvalid] = useState(false);
    const [addressType, setAddressType] = useState('');
    const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
    const [isSelectedOption, setIsSelectedOption] = useState(true);

    const userLocationChosenType = LocationUtils.getUserLocationChosenType();
    const { savedUserAddress, savedUserZipcode, savedUserLandmark } = LocationUtils.getSavedAddress();
    const deliveryLocationCoordinates = useSelector(state => state.globalReducer.deliveryLocationCoordinates);
    const productSearchLocationCoordinates = useSelector(state => state.globalReducer.productSearchLocationCoordinates);
    const productSearchLocation = useSelector(state => state.globalReducer.productSearchLocation);

    const userAddresses = useSelector(state => state.authReducer.userProfile?.address);

    useEffect(() => {
        if (show) setAddressType('');
        if (show) {
            let address, area, zipcode, landmark;
            if (!isProductSearch) {
                address = fullAddress.address;
                area = fullAddress.area;
                zipcode = fullAddress.zipcode;
                landmark = fullAddress.landmark;
            } else {
                address = productSearchLocation.address;
                area = productSearchLocation.area;
                zipcode = productSearchLocation.zipcode;
                landmark = productSearchLocation.landmark;
            }
            const isChosenSavedLocation = [USER_LOCATION_HOME, USER_LOCATION_OTHER, USER_LOCATION_WORK].includes(userLocationChosenType);
            (savedUserAddress && !isChosenSavedLocation) ? setAddress(savedUserAddress) : address && setAddress(address);
            (savedUserZipcode && !isChosenSavedLocation) ? setZipCode(savedUserZipcode) : zipcode && setZipCode(zipcode);
            (savedUserLandmark && !isChosenSavedLocation) ? setLandmark(savedUserLandmark) : landmark && setLandmark(landmark);
            area && setArea(area);
        }
    }, [show, fullAddress]);

    useEffect(() => {
        if (show) {
            setSelectedOption('');
            setAddressType('');
        }
    }, [show]);

    useEffect(() => {
        if (show) {
            if (isProductSearch) {
                setCoordinates({ lng: deliveryLocationCoordinates.lng, lat: deliveryLocationCoordinates.lat });
            } else if (productSearchLocationCoordinates) {
                setCoordinates({ lng: productSearchLocationCoordinates.lng, lat: productSearchLocationCoordinates.lat });
            }
        }
    }, [show, isProductSearch, deliveryLocationCoordinates, productSearchLocationCoordinates]);

    useEffect(() => {
        if (selectedOption) {
            setIsSelectedOption(true);
        }
    }, [selectedOption]);

    const onAddressChange = e => {
        setAddress(e.target.value);
    };
    const onAreaChange = e => {
        setArea(e.target.value);
    };

    const onZipCodeChange = e => {
        setZipCode(e.target.value);
    };

    const onLandmarkChange = e => {
        setLandmark(e.target.value);
    };

    const onAddressTypeChange = e => {
        setAddressType(e.target.value);
    };

    const getEditAddressBody = (aType) => {
        const chosenAddress = userAddresses.find(a => a.type === aType);
        const isAddressInvalid = !address || address.toString().trim().length === 0;
        const isZipcodeInvalid = !zipcode || zipcode.toString().trim().length === 0;
        setAddressInvalid(isAddressInvalid);
        setZipCodeInvalid(isZipcodeInvalid);
        if (isAddressInvalid || isAddressInvalid) {
            return;
        }
        if (!chosenAddress) return;
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
        const isAddressInvalid = !address || address.toString().trim().length === 0;
        const isZipcodeInvalid = !zipcode || zipcode.toString().trim().length === 0;
        const isTypeInvalid = !addressType || addressType.toString().trim().length === 0;
        setAddressInvalid(isAddressInvalid);
        setZipCodeInvalid(isZipcodeInvalid);
        (!!selectedOption) && setTypeInvalid(isTypeInvalid);
        setIsSelectedOption(!!selectedOption);
        if (!selectedOption || isAddressInvalid || isAddressInvalid || (selectedOption === OTHER && isTypeInvalid)) {
            return;
        }
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

    const saveOrUpdateAddress = () => {
        if (!userAddresses) {
            addAddress();
        }
        let type = selectedOption;
        if (selectedOption === OTHER) {
            type = addressType;
        }
        const isTypeExist = userAddresses.find(t => t.type === type);
        if (isTypeExist) {
            updateAddress(isTypeExist.type, _ => {
                clickBackdrop();
                getUserProfile && getUserProfile();
            });
        } else {
            addAddress();
        }
    };

    const updateAddress = (aType, callback) => {
        const editAddressBody = getEditAddressBody(aType);
        if (editAddressBody) {
            const { url, method, body, success, error } =
                apiEndpoints
                    .getApiEndpoints()
                    .user
                    .editAddress(editAddressBody);
            sendRequest(url, method, body, success, error, response => {
                callback && callback(response);
            }, error => clickBackdrop());
        }
    };

    const saveValues = () => {
        const isAddressInvalid = !address || address.toString().trim().length === 0;
        const isZipcodeInvalid = !zipcode || zipcode.toString().trim().length === 0;
        setAddressInvalid(isAddressInvalid);
        if (isAddressInvalid) {
            return;
        }
        setZipCodeInvalid(isZipcodeInvalid);
        if (isZipcodeInvalid) {
            return;
        }
        if (savingAddress) {
            saveOrUpdateAddress();
        } else {
            if ([SEARCHED_LOCATION, CURRENT_LOCATION].includes(userLocationChosenType) || !userLocationChosenType) {
                LocationUtils.saveCustomLandmarkToLocalStorage(landmark.toString().trim());
                LocationUtils.saveCustomAddressToLocalStorage(address.toString().trim());
                LocationUtils.saveCustomZipcodeToLocalStorage(zipcode.toString().trim());
                sendDispatch(SET_DELIVERY_LOCATION_ADDRESS, {
                    address: address.toString().trim(),
                    area: area.toString().trim(),
                    zipcode: zipcode.toString().trim(),
                    landmark: landmark.toString().trim()
                });
                if (selectedOption === OTHER) {
                    addAddress();
                } else {
                    clickBackdrop();
                }
            } else {
                updateAddress(userLocationChosenType, response => {
                    if (response.success) {
                        sendDispatch(SET_DELIVERY_LOCATION_ADDRESS, {
                            address: address.toString().trim(),
                            area: area.toString().trim(),
                            zipcode: zipcode.toString().trim(),
                            landmark: landmark.toString().trim()
                        });
                    }
                    clickBackdrop();
                });
            }
        }
    };

    const addAddress = () => {
        const addAddressBody = getAddAddressBody();
        if (addAddressBody) {
            const { url, method, body, success, error } =
                apiEndpoints
                    .getApiEndpoints()
                    .user
                    .addAddress(addAddressBody);
            sendRequest(url, method, body, success, error, _ => {
                getUserProfile && getUserProfile();
                clickBackdrop();
            }, err => clickBackdrop())
        }
    };

    const changeSelectedOption = option => {
        if (selectedOption === option) {
            setSelectedOption(null);
        } else {
            setSelectedOption(option)
        }
    };

    return (
        <ModalWrapper show={show} clickBackdrop={clickBackdrop}>
            <div className="modal-dialog w-500px" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">
                            Edit Address
                        </h5>
                        <button type="button" className="close" aria-label="Close" onClick={clickBackdrop}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body d-flex flex-column align-items-center justify-content-start font-size-3">
                        <div className='d-flex mb-2 w-100'>
                            <div className="form-group flex-grow-1 mb-0">
                                <input type="text" className="form-control" id="hostNoFlat" value={address.toString().trim()}
                                    onChange={onAddressChange}
                                    aria-describedby="hostNoFlat" placeholder="House no, Flat" />
                            </div>
                            <div className='w-50px d-flex align-items-center justify-content-center'>
                                <i className="fal fa-pencil font-size-1rem" />
                            </div>
                        </div>
                        {addressInvalid ?
                            <span
                                className='font-size-2 text-danger invalid-field'>House no, Flat, Street is required</span> : null}
                        <div className='d-flex mb-2 mt-1 w-100'>
                            <div className="form-group flex-grow-1 mb-0">
                                <input type="text" className="form-control" id="location" value={area} onChange={onAreaChange}
                                    
                                    aria-describedby="location" placeholder="Location" />
                            </div>
                            <div className='w-50px d-flex align-items-center justify-content-center'>
                                <i className="fal fa-map-marker-alt font-size-1rem" />
                            </div>
                        </div>
                        <div className='d-flex mb-2 mt-1 w-100'>
                            <div className="form-group flex-grow-1 mb-0">
                                <input type="number" className="form-control" id="pincode" value={zipcode}
                                    onChange={onZipCodeChange}
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
                                    onChange={onLandmarkChange}
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
                                        onChange={onAddressTypeChange}
                                        aria-describedby="addressType" placeholder="Type" />
                                </div>
                            </div>
                            {typeInvalid ?
                                <span
                                    className='font-size-2 text-danger invalid-field'>Type is required</span> : null}
                        </Aux> : null}
                        <div className='d-flex justify-content-between w-90'>
                            {[USER_LOCATION_HOME, SEARCHED_LOCATION, CURRENT_LOCATION].includes(userLocationChosenType) ?
                                <button
                                    className='btn btn-light d-flex align-items-center bg-transparent border-0 no-outline'
                                    onClick={() => changeSelectedOption(HOME)}>
                                    <i className="fas fa-home text-primary mr-2" />
                                    <span
                                        className={`${selectedOption === HOME ? 'text-black' : 'text-secondary'}`}>Home</span>
                                </button> : null}
                            {[USER_LOCATION_WORK, SEARCHED_LOCATION, CURRENT_LOCATION].includes(userLocationChosenType) ?
                                <button
                                    className='btn btn-light d-flex align-items-center bg-transparent border-0 no-outline'
                                    onClick={() => changeSelectedOption(WORK)}>
                                    <i className="fal fa-briefcase text-danger mr-2" />
                                    <span
                                        className={`${selectedOption === WORK ? 'text-black' : 'text-secondary'}`}>Work</span>
                                </button> : null}
                            {[USER_LOCATION_OTHER, SEARCHED_LOCATION, CURRENT_LOCATION].includes(userLocationChosenType) ?
                                <button
                                    className='btn btn-light d-flex align-items-center bg-transparent border-0 no-outline'
                                    onClick={() => changeSelectedOption(OTHER)}>
                                    <i className="far fa-pencil-alt text-primary mr-2" />
                                    <span
                                        className={`${selectedOption === OTHER ? 'text-black' : 'text-secondary'}`}>Other</span>
                                </button> : null}
                        </div>
                        {!isSelectedOption ?
                            <span
                                className='font-size-2 text-danger invalid-field'>Please select a type</span> : null}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-light border" onClick={clickBackdrop}>Cancel</button>
                        <button type="button" className="btn btn-primary" onClick={saveValues}>Save</button>
                    </div>
                </div>
            </div>
            {isLoading && <RequestSpinner />}
        </ModalWrapper>
    );
};

export default EditDeliveryAddressModal;
