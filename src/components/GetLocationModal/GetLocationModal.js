import React, { useState } from 'react';
import ModalWrapper from "../ModalWrapper/ModalWrapper";
import GeoLocation from "../GeoLocation/GeoLocation";
import Backdrop from "../Backdrop/Backdrop";
import Aux from "../../utils/auxilary";

const GetLocationModal = (props) => {
    const { show, clickBackdrop } = props;
    const [getLocation, setGetLocation] = useState(false);

    const getLocationAndCloseModal = () => {
        setGetLocation(true);
        clickBackdrop();
    };
    return (
        <Aux>
            <Backdrop show={show} clicked={clickBackdrop} />
            <ModalWrapper show={show} clickBackdrop={clickBackdrop}>
                <h4>In order to use Google location services, we need your location. Allow to use your location?</h4>
                <button onClick={getLocationAndCloseModal} className="btn btn-success">Yes</button>
                <button onClick={clickBackdrop} className="btn btn-danger">No</button>
                {getLocation && <GeoLocation />}
            </ModalWrapper>
        </Aux>
    );
};
export default GetLocationModal;
