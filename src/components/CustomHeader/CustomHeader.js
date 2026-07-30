import React from 'react';
import './CustomHeader.scss';
import history from "../../utils/history";

const CustomHeader = ({title}) => {

    const navigateToHome = () => {
        history.push("/home");
    };

    return (
        <nav
            className="navbar navbar-expand-lg navbar-light bg-white border-bottom-2 fixed-top custom-navbar
            z-index-99990 text-black d-flex justify-content-center">
            <div className='header-content'>
                <span className="navbar-brand header-logo logo cursor-pointer" onClick={navigateToHome}>
                    <img src={require('../../assets/images/bayfay-logo.png')} alt="logo" className='navbar-logo'/>
                </span>
                <span className='font-weight-bold'>
                    {title}
                </span>
            </div>
        </nav>
    );
};

export default CustomHeader;
