import React, {useEffect, useState} from 'react';
import './App.scss';
import {Redirect, Route, Switch, withRouter} from "react-router-dom";
import ProductsPage from "./pages/ProductsPage";
import Header from "./components/Header/Header";
import Shopping from "./pages/Shopping";
import {useSelector} from "react-redux";
import Footer from "./components/Footer/Footer";
import useHttp from "./hooks/http";
import AuthUtils from "./utils/AuthUtils";
import ApiEndpoints from "./utils/ApiEndpoints";
import useSyncDispatch from "./hooks/dispatch";
import {SET_LOGGED_IN_TOKEN_FROM_STORAGE} from "./store/actionTypes/auth-actions";
import {
    HIDE_CART_WARNING_DIALOG,
    RESET_API_ERROR,
    RESET_API_SUCCESS,
    SHOW_CART_WARNING_DIALOG
} from "./store/actionTypes/global-actions";
import ErrorModal from "./components/ErrorModal/ErrorModal";
import SuccessModal from "./components/SuccessModal/SuccessModal";
import Geocode from "react-geocode";
import {cartWarningMessage, GOOGLE_API_KEY} from "./utils/constants";
import AlertDialog from "./components/AlertDialog/AlertDialog";
import history from "./utils/history";
import CartUtils from "./utils/CartUtils";
import PaymentsPage from "./pages/PaymentsPage";
import FixedFooter from "./components/FixedFooter/FixedFooter";
import TermsAndConditions from "./pages/TermsAndConditions";
import Privacy from "./pages/Privacy";
import MerchantPolicy from "./pages/MerchantPolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TrackOrder from "./pages/TrackOrder/TrackOrder";
import ApiDocument from "./pages/ApiDocument/ApiDocument";
import PartnerWithUs from "./pages/PartnerWithUs/PartnerWithUs";
import Loader from "./components/Loader/Loader";
import Help from "./pages/Help/Help";
import Faq from "./pages/Faq/Faq";
import Profile from "./pages/Profile/Profile";
import DeleteAccount from "./pages/DeleteAccount/DeleteAccount";
import MerchantHelp from "./pages/MerchantHelp/MerchantHelp";
import CancellationAndRefund from "./pages/CancellationAndRefund/CancellationAndRefund";
import PurchaseHistory from "./pages/PurchaseHistory/PurchaseHistory";
import ScratchCardModal from "./components/ScratchCardModal/ScratchCardModal";
import moment from "moment";
import {Helmet} from "react-helmet";
import AboutUs from "./pages/AboutUs/AboutUs";

function App({location}) {
    const apiEndpoints = new ApiEndpoints();
    const {apiError, apiSuccess, showCartWarningDialog, token, isGuest} = useSelector(state => {
        return {
            apiError: state.globalReducer.apiError,
            apiSuccess: state.globalReducer.apiSuccess,
            showCartWarningDialog: state.globalReducer.showCartWarningDialog,
            token: state.authReducer.token,
            isGuest: state.authReducer.isGuest
        }
    });

    useEffect(() => {
        setIsProductPage(false);
    }, [location]);

    const {sendRequest, isLoading} = useHttp();
    const {sendDispatch} = useSyncDispatch();

    const storageIsGuest = AuthUtils.getIsGuest();
    const storageToken = AuthUtils.getToken();

    const [showScratchModal, setShowScratchModal] = useState(false);
    const [uniqueId, setUniqueId] = useState('');
    const [refreshingToken, setRefreshingToken] = useState(true);
    const [isProductsPage, setIsProductPage] = useState(false);

    useEffect(() => {
        Geocode.setApiKey(GOOGLE_API_KEY);
        // document.addEventListener('contextmenu', event => event.preventDefault());
        getMobileOperatingSystem();
    }, []);

    const checkForRefreshToken = () => {
        const expDate = AuthUtils.getTokenExpDate();
        const diff = moment(expDate).diff(moment(new Date()), "seconds");
        if (diff < 0 && AuthUtils.getRefreshToken() !== null) {
            setRefreshingToken(true);
            getRefreshToken()
        } else {
            setRefreshingToken(false);
        }
    };

    const getRefreshToken = () => {
        if (AuthUtils.getRefreshToken()) {
            const {url, method, body, success, error} = apiEndpoints.getApiEndpoints().login.refreshToken();
            sendRequest(url, method, body, success, error, _ => setRefreshingToken(false));
        } else {
            setRefreshingToken(false);
        }
    };

    const getMobileOperatingSystem = () => {
        // Disabled mobile app store redirect to allow web access
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        if (window.location.pathname === '/merchant-policy' || window.location.pathname === '/privacy' || window.location.pathname === '/terms') {
            return;
        }
        if (/android/i.test(userAgent)) {
            window.location.href = 'https://play.google.com/store/apps/details?id=com.bayfay.customer';
        }

        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            window.location.href = 'https://apps.apple.com/in/app/bayfay-shop-from-any-shops/id1463215060';
        }
    };

    useEffect(() => {
        if (showScratchModal) {
            document.body.classList.remove('scroll-y-auto');
            document.body.classList.add('remove-scroll');
        } else {
            document.body.classList.remove('remove-scroll');
            document.body.classList.add('scroll-y-auto');
        }
    }, [showScratchModal]);

    useEffect(() => {
        if (storageIsGuest === 'true' || storageIsGuest === null || storageToken === null || isGuest) {
            const {url, method, body, success, error} = apiEndpoints.getApiEndpoints().login.guest();
            sendRequest(url, method, body, success, error);
        } else {
            sendDispatch(SET_LOGGED_IN_TOKEN_FROM_STORAGE);
            getUserProfile();
            getRazorSettings();
        }
        if (isGuest === false && !AuthUtils.getTokenExpDate()) {
            checkForRefreshToken();
        }
    }, [isGuest]);

    const getUserProfile = () => {
        const {url, method, body, success, error} = apiEndpoints.getApiEndpoints().user.getUserProfile();
        sendRequest(url, method, body, success, error);
    };

    const getRazorSettings = () => {
        const {url, method, body, success, error} = apiEndpoints.getApiEndpoints().razor.getRazorSettings();
        sendRequest(url, method, body, success, error);
    };

    const resetError = () => {
        sendDispatch(RESET_API_ERROR);
    };

    const resetSuccessMessage = () => {
        sendDispatch(RESET_API_SUCCESS);
    };

    const navigateToHomeAndCloseDialog = () => {
        sendDispatch(HIDE_CART_WARNING_DIALOG);
        history.push("/home");
    };

    const fetchScratchCardCount = () => {
        const {url, method, body, success, error} =
            apiEndpoints
                .getApiEndpoints()
                .sponsors
                .getCount();
        sendRequest(url, method, body, success, error)
    };

    const clearCartAndCloseDialog = () => {
        const {url, method, body, success, error} =
            apiEndpoints
                .getApiEndpoints()
                .cart
                .clearCart();
        sendRequest(url, method, body, success, error, () => {
            CartUtils.removeShopsIds();
            CartUtils.setNumberOfItems(0);
            CartUtils.removeMostRecentShop();
            CartUtils.removeMostRecentAddresses();
            sendDispatch(HIDE_CART_WARNING_DIALOG);
            if (uniqueId?.length > 0) {
                CartUtils.setIsOtherLocationShop(false);
                setUniqueId('');
                history.push(uniqueId);
            }
        });
    };

    const activateScard = (scardId) => {
        const {url, method, body, success, error} =
            apiEndpoints
                .getApiEndpoints()
                .sponsors
                .activateScard(scardId);
        sendRequest(url, method, body, success, error);
    };

    const recordAdClicks = (adId) => {
        const {url, method, body, success, error} =
            apiEndpoints
                .getApiEndpoints()
                .sponsors
                .recordAdClicks(adId);
        sendRequest(url, method, body, success, error);
    };

    const openScratchCard = () => {
        setShowScratchModal(true);
    };

    const navigateToProductsPage = (uniqueId, adId) => {
        setShowScratchModal(false);
        if (adId) {
            recordAdClicks(adId);
        }
        if (CartUtils.canAddToCart(uniqueId) || isGuest) {
            CartUtils.setIsOtherLocationShop(false);
            CartUtils.removeShopsIds();
            CartUtils.setNumberOfItems(0);
            CartUtils.removeMostRecentShop();
            CartUtils.removeMostRecentAddresses();
            history.push(uniqueId);
        } else {
            setUniqueId(uniqueId);
            sendDispatch(SHOW_CART_WARNING_DIALOG);
        }
    };

    let routes = (
        <div className='position-relative'>
            <Helmet>
                {!isProductsPage ? <link rel="icon" href={require('../src/assets/images/logo-final-512x512.png')}
                                         id="defaultFavIcon"/> : <link rel="icon" href={`${window.location.origin}/favicon.ico`} id="defaultFavIcon" />}
            </Helmet>
            {routesWithCustomHeader.includes(location.pathname.split('\/').filter(a => a && a.length > 0)[0]) ?
                null : <Header openScratchCard={openScratchCard}/>}
            <div className='padding-bottom-7px content'>
                {!token && !storageToken && refreshingToken ? <div className='init-loader'><Loader/></div> :
                    <Switch>
                        <Route path={"/home"} component={Shopping}/>
                        <Route path={"/payments"} component={PaymentsPage}/>
                        <Route path={"/track-order"} component={TrackOrder}/>
                        <Route path={"/purchase-history"} component={PurchaseHistory}/>
                        <Route path={"/about-us"} component={AboutUs}/>
                        <Route path={"/data/sendreq"} component={DeleteAccount}/>
                        <Route path={'/public/products'} component={ProductsPage}/>
                        <Route path={'/terms'} component={TermsAndConditions}/>
                        <Route path={'/api'} component={ApiDocument}/>
                        <Route path={'/privacy'} component={Privacy}/>
                        <Route path={'/help'} component={Help}/>
                        <Route path={'/cancellation'} component={CancellationAndRefund}/>
                        <Route path={'/merchant-help'} component={MerchantHelp}/>
                        <Route path={'/profile'} component={Profile}/>
                        <Route path={'/faq'} component={Faq}/>
                        <Route path={'/partner'} component={PartnerWithUs}/>
                        <Route path={'/merchant-policy'} component={MerchantPolicy}/>
                        <Route path={'/Privacy-policy'} component={PrivacyPolicy}/>
                        <Route path={'/:store_unique_id'} render={props => {
                            if (!['home', 'products', 'error', 'payments', 'track-order', 'public', 'profile', ...routesWithCustomHeader].includes(props.match.params['store_unique_id'])) {
                                setIsProductPage(true);
                                return <ProductsPage key={props.match.params['store_unique_id']}/>
                            } else {
                                setIsProductPage(false);
                            }
                        }}/>
                        <Route exact path="/" render={() => (<Redirect to="/home"/>)}/>
                        <Route exact path="/error" render={() => (<Redirect to="/home"/>)}/>
                    </Switch>
                }
                <Footer/>
            </div>
            <FixedFooter/>
            <ErrorModal show={apiError.show} clickBackdrop={resetError} message={apiError.error}/>
            <SuccessModal show={apiSuccess.show} clickBackdrop={resetSuccessMessage} message={apiSuccess.message}/>
            <AlertDialog show={showCartWarningDialog} clickBackdrop={navigateToHomeAndCloseDialog} hideHeader={true}
                         confirmButtonText={'Yes'} isLoading={isLoading} revertButtons={true}
                         message={cartWarningMessage} onConfirm={clearCartAndCloseDialog}/>
            {showScratchModal ?
                <ScratchCardModal show={showScratchModal} activateScard={activateScard} clickBackdrop={() => {
                    setShowScratchModal(false);
                    fetchScratchCardCount();
                }} navigateToProducts={navigateToProductsPage}/> : null}
        </div>
    );
    return (
        <main>
            {routes}
        </main>
    );
}

const routesWithCustomHeader = ['terms', 'privacy', 'merchant-policy', 'api', 'partner', 'help', 'faq', 'merchant-help', 'cancellation', 'about-us'];

export default withRouter(App);
