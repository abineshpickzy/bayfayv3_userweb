import React, { useEffect, useState } from 'react';
import { NavLink, withRouter } from "react-router-dom";
import './Header.scss'
import { useSelector } from "react-redux";
import history from "../../utils/history";
import LoginModal from "../LoginModal/LoginModal";
import SignUpModal from "../SignUpModal/SignUpModal";
import Aux from "../../utils/auxilary";
import LogoutModal from "../LogotModal/LogoutModal";
import CartUtils from "../../utils/CartUtils";
import useSyncDispatch from "../../hooks/dispatch";
import { CLOSE_PAYMENT_SCREEN, HIDE_CART_WARNING_DIALOG, HIDE_LOGIN_MODAL } from "../../store/actionTypes/global-actions";
import ApiEndpoints from "../../utils/ApiEndpoints";
import useHttp from "../../hooks/http";
import AlertDialog from "../AlertDialog/AlertDialog";
import { CLEAR_CART } from "../../store/actionTypes/cart-actions";
import OffersModal from "../OffersModal/OffersModal";
import { cartWarningMessage } from "../../utils/constants";
import SupportModal from "../SupportModal/SupportModal";

const Header = ({ location, openScratchCard }) => {
    const { sendDispatch } = useSyncDispatch();
    const apiEndpoints = new ApiEndpoints();
    const { sendRequest, isLoading } = useHttp();

    const [showLogin, setShowLogin] = useState(false);
    const [showSignUp, setShowSignUp] = useState(false);
    const [showLogout, setShowLogout] = useState(false);
    const [showOffersModal, setShowOffersModal] = useState(false);
    const [showClearCartAlert, setShowClearCartAlert] = useState(false);
    const [showWarningDialog, setShowWarningDialog] = useState(false);
    const [showSupportModal, setShowSupportModal] = useState(false);
    const [offer, setOffer] = useState(null);

    const numberOfItemsInCart = useSelector(state => state.cartReducer.items.size);
    const showLoginTriggered = useSelector(state => state.globalReducer.showLogin);
    const scratchCount = useSelector(state => state.globalReducer.scratchCount);
    const deliveryLocationCoordinates = useSelector(state => state.globalReducer.deliveryLocationCoordinates);
    const productSearchLocationCoordinates = useSelector(state => state.globalReducer.productSearchLocationCoordinates);
    const privateShopsOffers = useSelector(state => state.shopsReducer.offers);
    const offersCount = useSelector(state => state.globalReducer.offersCount);
    const privateShops = useSelector(state => state.shopsReducer.privateShops);
    const publicShops = useSelector(state => state.shopsReducer.publicShops);
    const globalShops = useSelector(state => state.shopsReducer.globalShops);
    const brandedShops = useSelector(state => state.shopsReducer.brandedShops);

    const { username, isGuest, token } = useSelector(state => {
        return {
            username: state.authReducer.username,
            isGuest: state.authReducer.isGuest,
            token: state.authReducer.token
        }
    });

    useEffect(() => {
        if (isGuest === false) {
            fetchScratchCardCount();
        }
    }, [isGuest, deliveryLocationCoordinates, productSearchLocationCoordinates]);

    useEffect(() => {
        fetchOffers();
    }, [deliveryLocationCoordinates, productSearchLocationCoordinates, privateShopsOffers]);

    useEffect(() => {
        if (showLoginTriggered) {
            setShowLogin(true);
            sendDispatch(HIDE_LOGIN_MODAL);
        }
    }, [showLoginTriggered]);

    useEffect(() => {
        if (showOffersModal) {
            document.body.classList.remove('scroll-y-auto');
            document.body.classList.add('remove-scroll');
        } else {
            document.body.classList.remove('remove-scroll');
            document.body.classList.add('scroll-y-auto');
        }
    }, [showOffersModal]);

    let firstName = null;
    let lastName = null;
    if (username) {
        firstName = username.split("\\s+")[0];
        lastName = username.split("\\s+")[1];
    }

    const fetchScratchCardCount = () => {
        const { url, method, body, success, error } =
            apiEndpoints
                .getApiEndpoints()
                .sponsors
                .getCount();
        sendRequest(url, method, body, success, error)
    };

    const fetchOffers = () => {
        const stores = [...privateShops.storesIds, ...publicShops.storesIds, ...brandedShops.storesIds, ...globalShops.storesIds];
        if (stores?.length > 0) {
            const { url, method, body, success, error } = apiEndpoints.getApiEndpoints().offers.getOffers(stores);
            sendRequest(url, method, body, success, error,null,()=>{});
        }
    };

    const closeLoginModal = () => setShowLogin(false);
    const closeSignUpModal = () => setShowSignUp(false);
    const closeLogout = () => {
        setShowLogout(false);
        sendDispatch(CLEAR_CART);
    };

    const showLoginModal = () => setShowLogin(true);
    const showSignUpModal = () => setShowSignUp(true);

    const navigateToHome = () => {
        history.push("/home");
    };

    const showLogoutModal = () => {
        setShowLogout(true);
    };

    const openSignUp = () => {
        setShowLogin(false);
        setShowSignUp(true);
    };

    let cardItemsCount = 0;
    const savedCount = CartUtils.getNumberOfItems();
    if (!isGuest && savedCount) {
        cardItemsCount = savedCount;
    }

    const navigateToPayments = () => {
        history.push("/payments");
    };

    const navigateToProfile = () => {
        history.push("/profile");
    };

    const navigateToTrackOrder = () => {
        history.push('/track-order');
    };

    const navigateToPurchaseHistory = () => {
        history.push('/purchase-history');
    };

    const closeClearCartAlert = () => {
        setShowClearCartAlert(false);
    };

    const clearCart = () => {
        const { url, method, body, success, error } =
            apiEndpoints
                .getApiEndpoints()
                .cart
                .clearCart();
        sendRequest(url, method, body, success, error, () => {
            CartUtils.removeShopsIds();
            CartUtils.setNumberOfItems(0);
            CartUtils.removeMostRecentShop();
            CartUtils.removeMostRecentAddresses();
            sendDispatch(CLOSE_PAYMENT_SCREEN);
            sendDispatch(HIDE_CART_WARNING_DIALOG);
            setShowClearCartAlert(false);
        });
    };

    const navigateToProductsAndClosePaymentScreen = () => {
        const recentShop = CartUtils.getMostRecentShop();
        if (!recentShop) return;
        sendDispatch(CLOSE_PAYMENT_SCREEN);
        const {
            shopsIds,
            isPrivate,
            storeUniqueId,
            categoryId
        } = recentShop;
        if (isPrivate) {
            history.push(storeUniqueId);
        } else {
            history.push(`/public/products`,
                {
                    categoryId,
                    shopsIds,
                    isPrivate,
                    isRecentShop: true
                });
        }
    };

    const clearCartAndCloseDialog = () => {
        const { url, method, body, success, error } =
            apiEndpoints
                .getApiEndpoints()
                .cart
                .clearCart();
        sendRequest(url, method, body, success, error, hideWarningDialogAndProceed);
    };

    const hideWarningDialogAndProceed = () => {
        setShowWarningDialog(false);
        CartUtils.removeShopsIds();
        CartUtils.setNumberOfItems(0);
        CartUtils.removeMostRecentShop();
        CartUtils.removeMostRecentAddresses();
        CartUtils.setIsOtherLocationShop(false);
        const store_unique_id = offer.shop_unique_id;
        setShowOffersModal(false);
        history.push(`/${store_unique_id}`);
    };

    const navigateToProductsPage = (promo) => {
        if (CartUtils.canAddToCart(promo.store_id) || isGuest) {
            CartUtils.setIsOtherLocationShop(false);
            setShowOffersModal(false);
            history.push(`/${promo.shop_unique_id}`);
        } else {
            setOffer(promo);
            setShowWarningDialog(true);
        }
    };

    const onRewardClicked = () => {
        if (isGuest) {
            setShowLogin(true);
        } else {
            openScratchCard();
        }
    };

    return (
        <nav
            className="navbar navbar-expand-lg navbar-light bg-white border-bottom-2 fixed-top z-index-99990 custom-navbar text-black">
            <span className="navbar-brand header-logo logo cursor-pointer" onClick={navigateToHome}>
                <img src={require('../../assets/images/bayfay-logo.png')} alt="logo" className='navbar-logo' />
            </span>
            <button className="navbar-toggler" type="button" data-toggle="collapse"
                data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation">
                <span className="navbar-toggler-icon" />
            </button>

            <div className="collapse navbar-collapse align-items-center" id="navbarSupportedContent">
                <ul className="navbar-nav flex-grow-1 pr-2">
                    <span className='flex-grow-1 d-flex flex-row'>
                        <li className="nav-item px-3">
                            <NavLink
                                className="nav-link text-black d-flex align-items-center"
                                exact={true}
                                to={"/home"}
                            >
                                {location.pathname === '/home' ?
                                    <img src={require('../../assets/images/Shopping-active.png')} alt="shopping"
                                        className='mr-2 nav-img' /> :
                                    <img src={require('../../assets/images/Shopping.png')} alt="shopping"
                                        className='mr-2 nav-img' />}
                                <span>Shopping</span>
                            </NavLink>
                        </li>
                        <li className="nav-item px-3">
                            <button
                                onClick={() => setShowOffersModal(true)}
                                className="nav-link text-black d-flex align-items-center btn btn-light nav-button position-relative"
                            >
                                <img src={require('../../assets/images/Offer.png')} alt="offers"
                                    className='mr-2 nav-img' />
                                <span>Offers</span>
                                {offersCount && +offersCount > 0 ?
                                    <span className='offers-count-label'>{offersCount}</span> : null}
                            </button>
                        </li>
                        <li className="nav-item px-3">
                            <a
                                className="nav-link text-black d-flex align-items-center"
                                href={`${window.location.origin}/help`} target={'_blank'}
                                  rel="noreferrer"
                            >
                                <img src={require('../../assets/images/Help.png')} alt="help"
                                    className='mr-2 nav-img' />
                                Help
                            </a>
                        </li>
                        <li className='nav-item px-3'>
                            <span className='nav-button rewards-btn position-relative' onClick={onRewardClicked}>
                                <img src={require('../../assets/images/reward_Icon.gif')} alt="help"
                                    className='nav-img-lg' />
                                {scratchCount && +scratchCount > 0 || isGuest === true ?
                                    <span
                                        className='rewards-count-label'>{isGuest === true ? 1 : scratchCount}</span> : null}
                            </span>
                        </li>
                    </span>
                    <li className="nav-item px-2">
                        <a
                            className="nav-link text-black d-flex align-items-center"
                            href={`${window.location.origin}/partner`} target={'_blank'}
                            rel="noreferrer"
                        >
                            <img src={require('../../assets/images/Enquiry.png')} alt="enquiry"
                                className='mr-2 nav-img' />
                            Business Enquiry
                        </a>
                    </li>
                    <li className="nav-item px-2">
                        <button
                            onClick={() => setShowSupportModal(true)}
                            className="nav-link text-black d-flex align-items-center btn btn-light nav-button position-relative"
                        >
                            <img src={require('../../assets/images/support.png')} alt="enquiry"
                                className='mr-2 nav-img' />
                            Support
                        </button>
                    </li>
                </ul>
                <div className='btn btn-group d-flex align-items-center header-right'>
                    <span className='mr-3 h5 mb-0 cart-count' onClick={navigateToProductsAndClosePaymentScreen}>
                        Cart({cardItemsCount})
                        <img src={require('../../assets/images/shopping-cart.png')} alt="cart" className='cart-img' />
                    </span>
                    {isGuest !== null && isGuest === false &&
                        <Aux>
                            <span className="dropdown-toggle" id="navbarDropdown" role="button"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span className='fa fa-user-alt mr-2' />
                                {firstName} {lastName}
                            </span>
                            <div className="dropdown-menu user-info" aria-labelledby="navbarDropdown">
                                <span className='dropdown-arrow-up' />
                                <span className="dropdown-item hover-grey" onClick={navigateToTrackOrder}>Track Order</span>
                                <span className="dropdown-item hover-grey" onClick={navigateToPurchaseHistory}>Purchase History</span>
                                <span className="dropdown-item hover-grey" onClick={navigateToPayments}>Payments</span>
                                <span className="dropdown-item hover-grey"
                                    onClick={navigateToProfile}>Profile & Settings</span>
                                <span className="dropdown-item hover-grey" onClick={() => setShowSupportModal(true)}>Support</span>
                                {numberOfItemsInCart > 0 ?
                                    <span className="dropdown-item hover-grey" onClick={() => setShowClearCartAlert(true)}>
                                        Clear Cart
                                    </span> : null}
                                <span className="dropdown-item hover-grey" onClick={showLogoutModal}>Logout</span>
                            </div>
                        </Aux>}
                    {(token === null || isGuest) && <span>
                        <span className='mr-3 auth-color' onClick={showLoginModal}>Login</span>
                        <span className='auth-color' onClick={showSignUpModal}>Sign up</span>
                    </span>
                    }
                </div>
            </div>
            <LoginModal show={showLogin} clickBackdrop={closeLoginModal} openSignUp={openSignUp} />
            <SignUpModal show={showSignUp} clickBackdrop={closeSignUpModal} />
            <LogoutModal show={showLogout} clickBackdrop={closeLogout} />
            <AlertDialog title={'Clear Cart'} message={'Are you sure you want to clear cart?'} confirmButtonText={'Yes'}
                show={showClearCartAlert} clickBackdrop={closeClearCartAlert} onReject={closeClearCartAlert}
                onConfirm={clearCart} />
            <OffersModal show={showOffersModal} closeModal={() => setShowOffersModal(false)}
                navigateToProductsPage={navigateToProductsPage} />
            <AlertDialog show={showWarningDialog} clickBackdrop={() => setShowWarningDialog(false)} hideHeader={true}
                confirmButtonText={'Yes'} isLoading={isLoading} revertButtons={true}
                message={cartWarningMessage} onConfirm={clearCartAndCloseDialog} />
            <SupportModal show={showSupportModal} clickBackdrop={() => setShowSupportModal(false)} withCall={true} />
        </nav>
    );
};
export default withRouter(Header);
