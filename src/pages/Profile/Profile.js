import React, { useEffect, useRef, useState } from 'react';
import NavigationMenu from "../../components/NavigationMenu/NavigationMenu";
import './Profile.scss';
import { useSelector } from "react-redux";
import Aux from "../../utils/auxilary";
import Loader from "../../components/Loader/Loader";
import AddressItem from "../../components/AddressItem/AddressItem";
import EditProfile from "../../components/EditProfile/EditProfile";
import SuccessModal from "../../components/SuccessModal/SuccessModal";
import ErrorModal from "../../components/ErrorModal/ErrorModal";
import useHttp from "../../hooks/http";
import ApiEndpoints from "../../utils/ApiEndpoints";
import RequestSpinner from "../../components/RequestSpinner/RequestSpinner";
import { fetchImage } from "../../utils/imageUtils";
import ImageLoader from "../../components/ImageLoader/ImageLoader";
import AlertDialog from "../../components/AlertDialog/AlertDialog";
import UpdateLocationModal from "../../components/UpdateLocationModal/UpdateLocationModal";
import history from "../../utils/history";

const Profile = () => {
    const { sendRequest, isLoading } = useHttp();
    const apiEndpoints = new ApiEndpoints();
    const uploadImageRef = useRef(null);

    const [showEditProfile, setShowEditProfile] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [message, setMessage] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [imageFetching, setImageFetching] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [addressToDelete, setAddressToDelete] = useState('');
    const [showUpdateLocationModal, setShowUpdateLocationModal] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(false);
    const [validateEmail, setValidateEmail] = useState(false);

    const userProfile = useSelector(state => state.authReducer.userProfile);
    const isGuest = useSelector(state => state.authReducer.isGuest);

    useEffect(() => {
        if (userProfile?.image && !profileImage && isGuest === false) {
            fetchProfileImage();
        } else if (userProfile) {
            setImageFetching(false);
        }
    }, [userProfile, isGuest]);

    const updateUserDetailsSuccess = message => {
        setMessage(message);
        setShowEditProfile(false);
        setShowSuccessModal(true);
        getUserProfile();
    };

    const updateUserDetailsError = message => {
        setMessage(message);
        setShowEditProfile(false);
        setShowErrorModal(true);
        getUserProfile();
    };

    const fetchProfileImage = () => {
        fetchImage(`/profile/image/view?img=${userProfile?.image}&format=png&width=500&height=500`)
            .then(response => {
                const base64 = btoa(
                    new Uint8Array(response.data).reduce(
                        (data, byte) => data + String.fromCharCode(byte),
                        '',
                    ),
                );
                const imageBase64 = "data:;base64," + base64;
                setImageFetching(false);
                setProfileImage(imageBase64);
            })
             .catch(error => {
                console.log(error);
                setImageFetching(false);
            })
    };

    const getUserProfile = () => {
        const { url, method, body, success, error } = apiEndpoints.getApiEndpoints().user.getUserProfile();
        sendRequest(url, method, body, success, error);
    };

    const updateProfileImage = (img) => {
        setImageFetching(true);
        const { url, method, body, success, error } = apiEndpoints.getApiEndpoints().user.changeProfileImage(img);
        sendRequest(url, method, body, success, error, response => {
            setImageFetching(false);
            if (response.success) {
                 getUserProfile();
                const reader = new FileReader();
                reader.readAsDataURL(img);
                reader.onload = () => {
                    setProfileImage(reader.result.toString());
                }
            }
        }, () => setImageFetching(false));
    };

    const onImgUpload = e => {
        const file = e.target.files[0];
        updateProfileImage(file);
    };

    const onAddressDelete = address => {
        setAlertMessage(`Are you sure you want to delete ${address.type} address?`);
        setShowAlert(true);
        setAddressToDelete(address.id);
    };

    const deleteAddress = () => {
        setShowAlert(false);
        const { url, method, body, success, error } = apiEndpoints.getApiEndpoints().user.deleteAddress(addressToDelete);
        sendRequest(url, method, body, success, error, _ => {
            setAddressToDelete('');
            getUserProfile();
        })
    };

    const addNewLocation = () => {
        setSelectedAddress(null);
        setShowUpdateLocationModal(true);
    };

    const updateAddress = address => {
        setSelectedAddress(address);
        setShowUpdateLocationModal(true);
    };

    const verifyEmail = () => {
        setShowEditProfile(true);
        setValidateEmail(true);
    };

    return (
        <div className='payment-page-container'>
            <NavigationMenu selectedMenuItem={4} />
            <div className='d-flex flex-column px-2 py-4 w-100'>
                {userProfile ? <Aux>
                    <span className='profile-label'>Profile</span>
                    <div className='user-profile'>
                        <div className='d-flex flex-column align-items-center flex-shrink-0'>
                            {imageFetching ? <ImageLoader cssClass='wh70px' customSize={true} /> : profileImage ?
                                <img src={profileImage} alt="profileImage" className='profile-img' /> :
                                <img src={require('../../assets/images/logo-final-512x512.png')} className='profile-img'
                                    alt="" />}
                            <span className='edit-profile-label' onClick={() => uploadImageRef.current.click()}>
                                Edit
                            </span>
                            <input type="file" accept="image/*" className='d-none'
                                onChange={onImgUpload} ref={uploadImageRef} />
                        </div>
                        <div className='d-flex flex-column flex-grow-1 font-size-3 pl-5 justify-content-center'>
                            <span
                                className='font-weight-bold mb-2 username-label'>{userProfile?.first_name} {userProfile?.last_name}</span>
                            <span className='mb-2 silver-text d-flex align-items-center'>
                                <span>{userProfile?.mobile.number}</span>
                                {userProfile?.mobile?.is_verified ?
                                    <i className="fal fa-check-circle verified-label ml-3 font-size-1rem" /> : null}
                            </span>
                            <span className='silver-text d-flex align-items-center'>
                                <span>{userProfile?.email.id}</span>
                                {userProfile?.email?.is_verified ?
                                    <i className="fal fa-check-circle verified-label ml-3 font-size-1rem" /> :
                                    <button className="btn btn-light verify-email-btn ml-3"
                                        onClick={verifyEmail}>Verify
                                    </button>}
                            </span>
                        </div>
                        <div className='w-25 d-flex align-items-center justify-content-start'>
                            <button className="btn edit-profile-btn" onClick={() => setShowEditProfile(true)}>
                                Edit
                            </button>
                        </div>
                    </div>
                    <div className='d-flex mt-3 justify-content-between align-items-center'>
                        <span className='profile-label mb-0'>Favourite Delivery Locations</span>
                        <button className='btn add-more-locations-btn border-0' onClick={addNewLocation}>Add More Locations
                        </button>
                    </div>
                    <div>
                        {
                            userProfile?.address?.length === 0 ?
                                <div className='mt-5 silver-text font-size-1-2rem text-center'>
                                    There is no saved locations
                                </div> : null
                        }
                    </div>
                    <div className='d-flex flex-wrap justify-content-between'>
                        {userProfile?.address?.map(address => (
                            <div className='address-item-wrapper' key={address.id}>
                                <AddressItem item={address} onDelete={onAddressDelete} onEdit={updateAddress} />
                            </div>
                        ))}
                    </div>
                    <div className='d-flex mt-4'>
                        <button className='btn btn-danger btn-sm  border-radius-0' onClick={() => history.push('/data/sendreq')}>
                            <i className='far fa-user-times mr-2'/>Delete Account
                        </button>
                    </div>
                </Aux> : <Loader />}
                {isLoading ? <RequestSpinner /> : null}
            </div>
            <EditProfile show={showEditProfile} closeModal={() => setShowEditProfile(false)}
                updateUserDetailsError={updateUserDetailsError} getUserProfile={getUserProfile}
                resetValidateEmailFlag={() => setValidateEmail(false)}
                updateUserDetailsSuccess={updateUserDetailsSuccess} validateEmail={validateEmail} />
            <SuccessModal show={showSuccessModal} clickBackdrop={() => setShowSuccessModal(false)} message={message} />
            <ErrorModal show={showErrorModal} clickBackdrop={() => setShowErrorModal(false)} message={message} />
            <AlertDialog show={showAlert} clickBackdrop={() => setShowAlert(false)}
                confirmButtonText={'Yes'} title={'Delete Address'}
                message={alertMessage} onConfirm={deleteAddress} onReject={() => {
                    setShowAlert(false);
                    setAddressToDelete('');
                }} />
            <UpdateLocationModal show={showUpdateLocationModal}
                clickBackdrop={() => setShowUpdateLocationModal(false)}
                allSavedAddresses={userProfile?.address}
                getUserProfile={getUserProfile}
                savedAddress={selectedAddress} />
        </div>
    );
};

export default Profile;
