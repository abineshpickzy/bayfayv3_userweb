import React, { useEffect, useRef, useState } from 'react';
import LeftSidebar from "../components/LeftSidebar/LeftSidebar";
import ProductList from "../components/ProductList/ProductList";
import RightSidebar from "../components/RightSidebar/RightSidebar";
import './HomePage.scss';
import { withRouter } from "react-router-dom";
import useHttp from "../hooks/http";
import ApiEndpoints from "../utils/ApiEndpoints";
import RequestSpinner from "../components/RequestSpinner/RequestSpinner";
import { useSelector } from "react-redux";
import ViewBillingModal from "../components/ViewBIllingModal/ViewBillingModal";
import ProductAvailabilityModal from "../components/ProductAvailabilityModal/ProductAvailabilityModal";
import useSyncDispatch from "../hooks/dispatch";
import {
    CLEAR_PRODUCTS,
    PRODUCT_DETAILS_TEMPLATE_SUCCESS,
    REMOVE_FIRST_50_PRODUCTS,
    REMOVE_LAST_50_PRODUCTS,
    RESET_SCROLL_CATEGORY
} from "../store/actionTypes/products-actions";
import { USER_LOCATION_HOME, USER_LOCATION_WORK } from "../utils/constants";
import GooglePlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";
import GeoLocation from "../components/GeoLocation/GeoLocation";
import {
    CLEAR_CLOSE_PAYMENT_SCREEN,
    SET_DELIVERY_GEO_LOCATION,
    SET_DELIVERY_LOCATION_ADDRESS,
    SET_PRODUCT_SEARCH_ADDRESS,
    SET_PRODUCT_SEARCH_GEO_LOCATION,
    SHOW_CART_WARNING_DIALOG,
    SHOW_LOGIN_MODAL
} from "../store/actionTypes/global-actions";
import Geocode from "react-geocode";
import { fetchImage } from "../utils/imageUtils";
import { SET_OPENED_SHOP_INFO } from "../store/actionTypes/shops-actions";
import history from "../utils/history";
import CartUtils from "../utils/CartUtils";
import AlertDialog from "../components/AlertDialog/AlertDialog";
import CustomizeOrderModal from "../components/CustomizeOrderModal/CustomizeOrderModal";
import CheckoutInformation from "../components/CheckoutInformation/CheckoutInformation";
import { getItemsTotalPrice } from "../utils/productUtils";
import { CURRENT_LOCATION, LocationUtils, SEARCHED_LOCATION } from "../utils/LocationUtils";
import { CLEAR_CART } from "../store/actionTypes/cart-actions";
import ReportProductModal from "../components/ReportProductModal/ReportProductModal";
import EditDeliveryAddressModal from "../components/EditDeliveryAddressModal/EditDeliveryAddressModal";
import Aux from "../utils/auxilary";
import { Helmet } from "react-helmet";

const NUMBER_OF_PRODUCTS_PER_PAGE = 50;
const ProductsPage = (props) => {
    const apiEndpoints = new ApiEndpoints();
    const { sendRequest } = useHttp();
    const { sendDispatch } = useSyncDispatch();
    const deliveryLocationInputRef = useRef(null);

    const [categoryId, setCategoryId] = useState(null);
    const [page, setPage] = useState(1);
    const [shopIds, setShopId] = useState(null);
    const [productsRequestSent, setProductsRequest] = useState(false);
    const [shouldLoadProducts, setShouldLoadProducts] = useState(false);
    const [shouldLoadPreviousProducts, setShouldLoadPreviousProducts] = useState(false);
    const [showBillingModal, setShowBillingModal] = useState(false);
    const [product, setProduct] = useState(null);
    const [productId, setProductId] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showProductAvailabilityModal, setShowProductAvailabilityModal] = useState(false);
    const [isPrivate, setIsPrivate] = useState(null);
    const [deliveryAddressDetails, setDeliveryAddressDetails] = useState({ address: '', searched: false });
    const [isDeliver, setIsDeliver] = useState(null);
    const [privateStoresWarning, setPrivateStoresWarning] = useState('');
    const [useCurrentLocation, setUserCurrentLocation] = useState(false);
    const [useCurrentLocationForDelivery, setUseCurrentLocationForDelivery] = useState(true);
    const [showInitialDeliverySuggestion, setShowInitialDeliverySuggestion] = useState(false);
    const [fetchStoreInfoRequest, setFetchStoreInfoRequest] = useState(false);
    const [storeUniqueId, setStoreUniqueId] = useState(null);
    const [showWarning, setShowWarning] = useState(false);
    const [cartChecked, setCartChecked] = useState(false);
    const [showAlertDialog, setShowAlertDialog] = useState(false);
    const [alertInfo, setAlertInfo] = useState({ message: '', title: '' });
    const [showCustomizeOrderDialog, setShowCustomizeOrderDialog] = useState(false);
    const [shopInfo, setShopInfo] = useState(null);
    const [shopImage, setShopImage] = useState(null);
    const [searchWord, setSearchWord] = useState('');
    const [showCheckout, setShowCheckout] = useState(false);
    const [showReportProductModal, setShowReportProductModal] = useState(false);
    const [loadingNextPage, setLoadingNextPage] = useState(false);
    const [loadingPreviousPage, setLoadingPreviousPage] = useState(false);
    const [pageDecreased, setPageDecreased] = useState(false);
    const [showEditDeliveryAddressModal, setShowEditDeliveryAddressModal] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);
    const [showDeleteAddressConfirmation, setShowDeleteAddressConfirmation] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState('');

    const closePaymentModal = useSelector(state => state.globalReducer.closePaymentDialog);
    const categories = useSelector(state => state.productsReducer.categories);
    const scrollToCategory = useSelector(state => state.productsReducer.scrollToCategory);
    const numberOfItemsInCart = useSelector(state => state.cartReducer.items.size);
    const cartItems = useSelector(state => state.cartReducer.items);
    const products = useSelector(state => state.productsReducer.products);
    const productsCount = useSelector(state => state.productsReducer.productsCount);
    const deliveryLocationCoordinates = useSelector(state => state.globalReducer.deliveryLocationCoordinates);
    const productSearchLocationCoordinates = useSelector(state => state.globalReducer.productSearchLocationCoordinates);
    const deliveryLocationAddress = useSelector(state => state.globalReducer.deliveryLocationAddress);
    const productSearchLocation = useSelector(state => state.globalReducer.productSearchLocation);
    const isGuest = useSelector(state => state.authReducer.isGuest);
    const openedShop = useSelector(state => state.shopsReducer.openedShop);
    let userLocations = useSelector(state => state.authReducer.userProfile?.address);

    if (!userLocations) {
        userLocations = [];
    }

    useEffect(() => {
        if (openedShop?.shop?.store_rating?.avg_rating) {
            setShopInfo(prevState => ({ ...prevState, rating: openedShop.shop.store_rating.avg_rating }))
        }
    }, [openedShop]);

    useEffect(() => {
        sendDispatch(CLEAR_PRODUCTS);
        setFetchStoreInfoRequest(true);
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (closePaymentModal) {
            setShowCheckout(false);
            sendDispatch(CLEAR_CLOSE_PAYMENT_SCREEN);
        }
    }, [closePaymentModal]);

    useEffect(() => {
        if (shouldLoadProducts) {
            if (Array.from(products).length > 0 && productsCount > (page * NUMBER_OF_PRODUCTS_PER_PAGE)) {
                setPageDecreased(false);
                setPage(prevState => prevState + 1);
            }
        }
    }, [shouldLoadProducts]);

    useEffect(() => {
        const store_unique_id = props.match.params['store_unique_id'];
        if (store_unique_id && store_unique_id !== 'public') {
            setIsPrivate(true);
            setStoreUniqueId(store_unique_id);
        } else {
            sendDispatch(CLEAR_PRODUCTS);
            const isDefaultCoordinates = ((productSearchLocationCoordinates && productSearchLocationCoordinates.lng === 0 &&
                productSearchLocationCoordinates.lat === 0) &&
                (deliveryLocationCoordinates && deliveryLocationCoordinates.lng === 0 && deliveryLocationCoordinates.lat === 0));
            if (isDefaultCoordinates && !isGuest) {
                const mostRecentDeliveryAddress = CartUtils.getMostRecentDeliveryAddress();
                const mostRecentProductSearchAddress = CartUtils.getMostRecentProductSearchAddress();
                if (mostRecentDeliveryAddress?.area) {
                    let { lng, lat, area, address, zipcode, landmark } = mostRecentDeliveryAddress;
                    if (!zipcode) {
                        zipcode = LocationUtils.getSavedAddress().savedUserZipcode;
                    }
                    if (!address) {
                        address = LocationUtils.getSavedAddress().savedUserAddress;
                    }
                    sendDispatch(SET_DELIVERY_GEO_LOCATION, { lat, lng });
                    sendDispatch(SET_DELIVERY_LOCATION_ADDRESS, {
                        address,
                        area,
                        zipcode,
                        landmark
                    });
                    sendDispatch(SET_PRODUCT_SEARCH_GEO_LOCATION, {
                        lat: mostRecentProductSearchAddress.lat,
                        lng: mostRecentProductSearchAddress.lng
                    });
                    sendDispatch(SET_PRODUCT_SEARCH_ADDRESS, {
                        address: mostRecentProductSearchAddress.address,
                        area: mostRecentProductSearchAddress.area,
                        zipcode: mostRecentProductSearchAddress.zipcode,
                        landmark: mostRecentProductSearchAddress.landmark
                    });
                } else {
                    history.push('/home');
                }
            }
            setIsPrivate(false);
            if (!openedShop || !openedShop.isSet) {
                if (isGuest === true) {
                    history.push('/home');
                } else if (isGuest === false) {
                    sendDispatch(CLEAR_PRODUCTS);
                    const categoryId = props.location.state['categoryId'];
                    const shopsIds = props.location.state['shopsIds'];
                    setCategoryId(categoryId);
                    if (typeof shopsIds === 'object') {
                        setShopId(shopsIds);
                    } else {
                        setShopId(shopsIds.split("_"));
                    }
                    fetchNonPrivateShopInfo(categoryId);
                }
            } else {
                const shopsIds = props.location.state['shopsIds'];
                if (typeof shopsIds === 'object') {
                    setShopId(shopsIds);
                } else {
                    setShopId(shopsIds.split("_"));
                }
                const categoryId = props.location.state['categoryId'];
                setCategoryId(categoryId);
                fetchNonPrivateShopInfo(categoryId);
            }
        }
    }, [isGuest]);

    useEffect(() => {
        if (isPrivate) {
            const isDefaultCoordinates = deliveryLocationCoordinates && deliveryLocationCoordinates.lng === 0 && deliveryLocationCoordinates.lat === 0;
            if (!isDefaultCoordinates && deliveryLocationCoordinates && !deliveryAddressDetails.searched) {
                setUseCurrentLocationForDelivery(false);
                Geocode.fromLatLng(deliveryLocationCoordinates.lat, deliveryLocationCoordinates.lng)
                    .then(response => {
                        const { address, area, zipcode } = LocationUtils.extractLocation(response);
                        LocationUtils.clearUserSavedAddressAndType();
                        LocationUtils.saveUserLocationChosenType(CURRENT_LOCATION);
                        sendDispatch(SET_DELIVERY_LOCATION_ADDRESS, {
                            address,
                            area,
                            zipcode,
                        });
                        const fullAddress = response.results[0].formatted_address;
                        setDeliveryAddressDetails({ address: fullAddress, searched: false });
                        if (deliveryLocationInputRef && deliveryLocationInputRef.current) {
                            deliveryLocationInputRef.current.value = fullAddress;
                        }
                    })
            } else if (!deliveryLocationCoordinates) {
                setDeliveryAddressDetails({ address: '', searched: false });
                deliveryLocationInputRef.current.value = '';
            }
            if (deliveryLocationCoordinates && (deliveryLocationCoordinates.lat !== 0 || deliveryLocationCoordinates.lng !== 0)) {
                sendDispatch(CLEAR_PRODUCTS);
                fetchPrivateShopInfo(storeUniqueId, deliveryLocationCoordinates);
            } else {
                fetchPrivateShopInfo(storeUniqueId);
            }

            if (deliveryLocationCoordinates?.lat === 0 && deliveryLocationCoordinates?.lng === 0) {
                setUserCurrentLocation(true);
            }
        }
    }, [deliveryLocationCoordinates, isPrivate]);

    useEffect(() => {
        document.addEventListener('click', handleClick, false);
    }, []);

    useEffect(() => {
        setShowWarning(privateStoresWarning?.length > 0);
    }, [isDeliver, privateStoresWarning]);

    useEffect(() => {
        if (cartItems.size > 0 && categoryId) {
            getBillingInfo();
        }
    }, [cartItems, categoryId]);

    const handleClick = e => {
        if (deliveryLocationInputRef.current && !deliveryLocationInputRef.current.contains(e.target)) {
            setShowInitialDeliverySuggestion(false);
        }
        if (deliveryLocationInputRef.current && deliveryLocationInputRef.current.contains(e.target)) {
            setDeliveryAddressDetails({ address: '', searched: false });
            setShowInitialDeliverySuggestion(true);
        }
    };

    useEffect(() => {
        if (shopIds) {
            isGuest === false && fetchDeliveryTypes();
        }
    }, [shopIds, isGuest]);

    const fetchDeliveryTypes = () => {
        const { url, method, body, success, error } = apiEndpoints
            .getApiEndpoints()
            .order
            .getDeliveryTypes(shopIds);
        sendRequest(url, method, body, success, error);
    };

    const getBillingInfo = () => {
        const { url, method, body, success, error } =
            apiEndpoints
                .getApiEndpoints()
                .order
                .viewBilling(categoryId);
        sendRequest(url, method, body, success, error, response => {
            if (response.success) {
                setTotalAmount(response.data.prices.net_price);
            }
        });
    };

    const fetchNonPrivateShopInfo = (categoryId) => {
        setFetchStoreInfoRequest(true);
        const { url, method, body, success, error } = apiEndpoints
            .getApiEndpoints()
            .products
            .viewNonPrivateShopInfo(categoryId);
        sendRequest(url, method, body, success, error, response => {
            if (response.data) {
                sendDispatch(PRODUCT_DETAILS_TEMPLATE_SUCCESS, { data: [{ template: response.data[0].template }] });
                saveStoreInfo(response.data[0], null, '');
            }
        }, error => history.push("/home"));
    };

    const fetchPrivateShopInfo = (store_unique_id, deliveryLocation) => {
        setFetchStoreInfoRequest(true);
        const { url, method, body, success, error } = apiEndpoints
            .getApiEndpoints()
            .products
            .viewPrivateShopInfo(store_unique_id, deliveryLocation);
        sendRequest(url, method, body, success, error, response => {
            if (response.data) {
                sendDispatch(PRODUCT_DETAILS_TEMPLATE_SUCCESS, { data: [{ template: response.data.template }] });
                saveStoreInfo(response.data, response.is_deliver, response.warning);
            }
        }, error => history.push("/home"));
    };

    const getUserProfile = () => {
        const { url, method, body, success, error } = apiEndpoints.getApiEndpoints().user.getUserProfile();
        sendRequest(url, method, body, success, error);
    };

    const saveOrUpdateAddress = () => {
        if (!isGuest) {
            setShowEditDeliveryAddressModal(true);
        } else {
            sendDispatch(SHOW_LOGIN_MODAL);
        }
    };

    const saveStoreInfo = (data, isDeliver, warning) => {
        let image = data.private;
        if (!isPrivate) {
            image = data.image;
        }
        fetchShopImageImage(image);
        isPrivate && setCategoryId(data.category_id);
        isPrivate && setShopId([data._id]);
        setIsDeliver(isDeliver);
        setPrivateStoresWarning(warning);
        let rating = 0;
        if (data?.store_rating?.avg_rating) {
            rating = data.store_rating.avg_rating.toFixed(1);
        }
        if (rating) {
            setShopInfo(prevValue => ({ ...prevValue, ...data, rating }));
        } else {
            setShopInfo(prevValue => ({ ...prevValue, ...data }));
        }
    };

    const fetchShopImageImage = imageName => {
        fetchImage(`/category/view/img?img=${imageName}&format=jpeg&width=400&height=400`)
            .then(response => {
                const base64 = btoa(
                    new Uint8Array(response.data).reduce(
                        (data, byte) => data + String.fromCharCode(byte),
                        '',
                    ),
                );
                const imageBase64 = "data:;base64," + base64;
                setShopImage(imageBase64);
            })
             .catch(err => console.log(err));
    };

    useEffect(() => {
        if (shopImage || shopInfo?.display_name) {
            sendDispatch(SET_OPENED_SHOP_INFO, {
                isSet: true,
                image: shopImage,
                shop: shopInfo
            })
        }
    }, [shopInfo?.display_name, shopImage]);

    useEffect(() => {
        if (categoryId && shopIds) {
            if (isPrivate) {
                checkCart();
            }
            loadProductsCount('All');
        }
    }, [shopIds, categoryId, isGuest]);

    useEffect(() => {
        if (!isPrivate || cartChecked) {
            getCart();
        }
    }, [isGuest, categoryId, cartChecked]);

    const getCart = () => {
        const { url, method, body, success, error } =
            apiEndpoints
                .getApiEndpoints()
                .cart
                .getCart(categoryId);
        (isGuest === false) && categoryId && sendRequest(url, method, body, success, error);
    };

    useEffect(() => {
        if (categoryId && shopIds) {
            getCategories(categoryId, shopIds);
        }

        if (categoryId && shopIds && !productsRequestSent && !loadingNextPage && !pageDecreased) {
            if (!searchWord || searchWord.length === 0) {
                if (page === 1) {
                    setProductsRequest(true);
                } else {
                    page > 5 && sendDispatch(REMOVE_FIRST_50_PRODUCTS);
                    setLoadingNextPage(true);
                }
                loadProducts(selectedCategory, false);
            } else {
                searchProducts();
            }
        }
    }, [shopIds, categoryId, page, searchWord]);

    useEffect(() => {
        if (shopIds && categoryId && shouldLoadPreviousProducts) {
            if (page > 5 && !loadingPreviousPage) {
                setLoadingPreviousPage(true);
                sendDispatch(REMOVE_LAST_50_PRODUCTS);
                loadProducts(selectedCategory, true);
            }
        }
    }, [shopIds, categoryId, shouldLoadPreviousProducts]);

    const checkCart = () => {
        if (!CartUtils.canAddToCart(shopIds.toString()) && isGuest === false) {
            sendDispatch(SHOW_CART_WARNING_DIALOG);
        } else {
            setCartChecked(true);
        }
    };

    const searchProducts = () => {
        setProductsRequest(true);
        const { url, method, body, success, error } = apiEndpoints
            .getApiEndpoints()
            .products
            .searchProducts(categoryId, shopIds, searchWord, page);
        sendRequest(url, method, body, success, error, () => {
            setProductsRequest(false);
            setFetchStoreInfoRequest(false);
            setShouldLoadProducts(false);
        });
    };

    useEffect(() => {
        if (scrollToCategory?.toString().length > 0) {
            const categoryToScroll = document.getElementById(scrollToCategory);
            categoryToScroll.scrollIntoView(true);
            sendDispatch(RESET_SCROLL_CATEGORY);
        }
    }, [scrollToCategory]);

    const loadProducts = (category, isPrevious) => {
        if (category === 'All') {
            const { url, method, body, success, error } = apiEndpoints
                .getApiEndpoints()
                .products
                .getProductsWithCategories(categoryId, shopIds, page, isPrevious);
            sendRequest(url, method, body, success, error, () => {
                if (isPrevious) {
                    setPageDecreased(true);
                    setPage(prevState => prevState - 1);
                }
                setProductsRequest(false);
                setLoadingPreviousPage(false);
                setLoadingNextPage(false);
                setShouldLoadPreviousProducts(false);
                setFetchStoreInfoRequest(false);
                setShouldLoadProducts(false);
            }, error => history.push('/home'));
        } else {
            const { url, method, body, success, error } = apiEndpoints
                .getApiEndpoints()
                .products
                .getProductsByCategory(categoryId, shopIds, category, true, page, isPrevious);
            sendRequest(url, method, body, success, error, () => {
                setProductsRequest(false);
                setShouldLoadProducts(false);
                setLoadingPreviousPage(false);
                setLoadingNextPage(false);
                setShouldLoadPreviousProducts(false);
            });
        }
    };

    const loadProductsCount = category => {
        if (category === 'All') {
            const { url, method, body, success, error } = apiEndpoints
                .getApiEndpoints()
                .products
                .getProductsCount(categoryId, shopIds);
            sendRequest(url, method, body, success, error);
        } else {
            const { url, method, body, success, error } = apiEndpoints
                .getApiEndpoints()
                .products
                .getProductsCountByCategory(categoryId, shopIds, category, true);
            sendRequest(url, method, body, success, error);
        }
    };

    const getCategories = (catId, stores) => {
        const { url, method, body, success, error } =
            apiEndpoints
                .getApiEndpoints()
                .products
                .getCategories(catId, stores);
        sendRequest(url, method, body, success, error);
    };

    const loadNextPage = () => {
        setShouldLoadProducts(true);
    };

    const loadPreviousPage = () => {
        setShouldLoadPreviousProducts(true);
    };

    const showBillingModalDialog = () => {
        numberOfItemsInCart > 0 && setShowBillingModal(true);
    };

    const setProductAndShowProductAvailabilityModal = (show, id) => {
        setProductId(id);
        setShowProductAvailabilityModal(show);
    };

    const setProductAndShowReportProductModal = (show, product) => {
        setProduct(product);
        setShowReportProductModal(show);
    };

    const scrollToTop = () => {
        window.scrollTo(0, 0);
    };

    const onCategorySelect = async category => {
        scrollToTop();
        sendDispatch(CLEAR_PRODUCTS);
        await setPage(1);
        setProductsRequest(true);
        loadProductsCount(category);
        loadProducts(category);
        const cats = category.split("\/").filter(cat => cat?.length > 0).join(' > ');
        setSelectedCategory(cats);
    };

    const setCurrentLocationDelivery = () => {
        setUserCurrentLocation(true);
        setUseCurrentLocationForDelivery(true);
        setDeliveryAddressDetails({ ...deliveryAddressDetails, searched: false });
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

    const setDeliveryLocationFromSaved = location => {
        const address = location.address;
        const { area, street, zipcode } = location.address;
        LocationUtils.clearUserSavedAddressAndType();
        LocationUtils.saveUserLocationChosenType(location.type);
        sendDispatch(SET_DELIVERY_LOCATION_ADDRESS, {
            address: street,
            area,
            zipcode
        });
        const addressToSet = [address.street, address.area].join(', ');
        setDeliveryAddressDetails({ address: addressToSet, searched: true });
        geocodeByAddress(addressToSet)
            .then(results => getLatLng(results[0]))
            .then(({ lat, lng }) => {
                setUseCurrentLocationForDelivery(false);
                const coordinates = { lat, lng };
                sendDispatch(SET_DELIVERY_GEO_LOCATION, coordinates);
            }
            );
    };

    const setDeliveryLocation = (arg) => {
        setDeliveryAddressDetails({ address: arg.description, searched: true });
        LocationUtils.clearUserSavedAddressAndType();
        LocationUtils.saveUserLocationChosenType(SEARCHED_LOCATION);
        sendDispatch(SET_DELIVERY_LOCATION_ADDRESS, {
            address: arg?.structured_formatting.main_text,
            area: arg?.structured_formatting.secondary_text,
            zipcode: null
        });
        geocodeByAddress(arg.description)
            .then(results => getLatLng(results[0]))
            .then(({ lat, lng }) => {
                setUseCurrentLocationForDelivery(false);
                const coordinates = { lat, lng };
                sendDispatch(SET_DELIVERY_GEO_LOCATION, coordinates);
            }
            );
    };

    const openCheckoutModal = () => {
        if (isGuest === false && cartItems.size > 0) {
            setShowCheckout(true);
        }
    };

    const showDeleteConfirmationDialog = id => {
        setAddressToDelete(id);
        setShowDeleteAddressConfirmation(true);
    };

    const onDeleteAddressConfirm = () => {
        const { url, method, body, success, error } = apiEndpoints.getApiEndpoints().user.deleteAddress(addressToDelete);
        sendRequest(url, method, body, success, error,
            _ => getUserProfile());
        setShowDeleteAddressConfirmation(false)
    };

    const onDeleteAddressReject = () => {
        setShowDeleteAddressConfirmation(false);
    };

    const renderDeliveryLocationInput = () => {
        return (
            <div className="input-group position-relative products-delivery-input">
                {
                    showInitialDeliverySuggestion &&
                    <div className="initial-suggestions position-absolute">
                        <div
                            className="suggestion p-2 d-flex flex-row align-items-center border-bottom"
                            onClick={setCurrentLocationDelivery}
                        >
                            <i className="far fa-location-arrow suggestion-icon color-purple" />
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
                                <div className='d-flex flex-row align-items-center'
                                    onClick={() => setDeliveryLocationFromSaved(location)}>
                                    {location.type === USER_LOCATION_HOME &&
                                        <i className="far fa-home suggestion-icon text-primary" />}
                                    {location.type === USER_LOCATION_WORK &&
                                        <i className="far fa-briefcase suggestion-icon text-success" />}
                                    {location.type !== USER_LOCATION_HOME && location.type !== USER_LOCATION_WORK &&
                                        <i className="far fa-building suggestion-icon text-info" />}
                                    <span className='d-flex flex-column'>
                                        <span>{location.type}</span>
                                        <small
                                            className='suggestion-description'>
                                            {location.address.street}, {location.address.area}
                                        </small>
                                    </span>
                                </div>
                                <i className="far fa-trash-alt suggestion-icon text-secondary fa-pull-right"
                                    onClick={() => showDeleteConfirmationDialog(location.id)} />
                            </div>
                        ))}
                    </div>
                }
                <img src={require('../assets/images/delivery-location.png')} alt="deliveryLocationImg"
                    className='icon' />
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
                                        < i className="far fa-save suggestion-icon text-secondary fa-pull-right"
                                            onClick={saveOrUpdateAddress} />
                                    </div>
                                ))
                            }
                        </div>
                    )}
                />
                {deliveryAddressDetails.address?.length > 0 &&
                    < span className='position-absolute input-label'>Delivery Location</span>}
            </div>
        )
    };

    const canAddToCart = () => {
        if (isPrivate) {
            const isDefaultCoordinates = deliveryLocationCoordinates && deliveryLocationCoordinates.lng === 0 && deliveryLocationCoordinates.lat === 0;
            const emptyAddress = deliveryAddressDetails?.address?.length === 0;
            if (isDefaultCoordinates || emptyAddress) {
                return false;
            }
        }
        return true;
    };

    const showLocationAlert = () => {
        setAlertInfo({
            message: 'Please enter delivery location in order to add or remove items in the cart!',
            title: 'Empty Location'
        });
        setShowAlertDialog(true);
    };

    const showSubscriptionAlert = (message) => {
        setAlertInfo({
            message,
            title: 'Subscription'
        });
        setShowAlertDialog(true);
    };

    const onCustomizeModalCloses = success => {
        setShowCustomizeOrderDialog(false);
        if (success) {
            getCart();
        }
    };

    const openCustomizeOrderModal = () => {
        if (numberOfItemsInCart > 0) {
            setShowCustomizeOrderDialog(true);
        }
    };

    const clearCart = () => {
        CartUtils.setNumberOfItems(0);
        sendDispatch(CLEAR_CART);
    };

    const loadProductsBySearch = searchedWord => {
        sendDispatch(CLEAR_PRODUCTS);
        setSelectedCategory('All');
        setPage(1);
        setSearchWord(searchedWord);
    };

    const renderMetadata = () => {
        if (!shopInfo || !shopInfo.display_name) {
            return null;
        }
        return (
            <Helmet>
                {shopInfo?.address?.street ?
                    <title id='products-page-title'>Order online from {shopInfo?.display_name} | Home delivery | {shopInfo?.address?.street} </title> :
                    <title id='products-page-title'>Order online from {shopInfo?.display_name} | Home delivery </title>}
                <meta name="description" id={'description2'}
                    content={`Order Online from ${shopInfo?.display_name} ${shopInfo?.address?.street ? shopInfo?.address?.street : ""} and see menu for Home Delivery in ${deliveryLocationAddress.area ? deliveryLocationAddress.area : ""}. Fastest delivery | No minimum order | GPS tracking.`} />
                <meta name="keywords" id="keywords12"
                    content={`${shopInfo?.display_name}, menus, order product online, order food online, home delivery, ${deliveryLocationAddress.area ? deliveryLocationAddress.area : ""}`} />
                <meta httpEquiv="X-UA-Compatible" id='X-UA-Compatible12' content="IE=Edge,chrome=1" />
                <meta name="robots" id="robots12" content="index, follow" />
                {isPrivate ? <link rel="canonical" id={'canonical123'} href={window.location.href} /> : null}
                {isPrivate ? <link rel="amphtml" id={'amphtml123'} href={window.location.href} /> : null}
                <meta name="og_site_name" id="og_site_name2" property="og:site_name" content="bayfay.com" />
                <meta name="og_title" id="og_title2" property="og:title"
                    content={`${shopInfo?.display_name} | Home delivery | Order online | ${shopInfo?.address?.street ? shopInfo?.address?.street : ""}`} />
                <meta property="og:type" id="property5" content="website" />
                <meta name="og_site_name" id="property6" property="og:site_name" content="bayfay.com" />
                <meta name="og_title" id="property7" property="og:title"
                    content={`${shopInfo?.display_name} | Home delivery | Order online | ${shopInfo?.address?.street ? shopInfo?.address?.street : ""}`} />
                <meta property="og:type" id="property12" content="website" />
                <meta property="og:description" id="property13"
                    content={`Order Online from ${shopInfo?.display_name} ${shopInfo?.address?.street ? shopInfo?.address?.street : ""} and see menu for Home Delivery in ${deliveryLocationAddress.area ? deliveryLocationAddress.area : ""}. Fastest delivery | No minimum order | GPS tracking.`} />
                {isPrivate ?
                    <meta name="og_url" id="property8" property="og:url" content={window.location.href} /> : null}
                {isPrivate ? <meta property="og:image" id="property9"
                    content={shopImage} /> : null}
                <link rel="icon" sizes="192x192" href={`${window.location.origin}/icons/images/icon-192x192.png`} />
                <link rel="apple-touch-icon" id={'apple-touch-icon21'} sizes="192x192"
                    href={`${window.location.origin}/icons/images/icon-192x192.png`} />
                <meta name="msapplication-TileColor" id="msapplication-TileColor21" content="#1d9bf6" />
                <meta name="msapplication-TileImage" id="msapplication-TileImage21"
                    content={`${window.location.origin}/icons/images/mstile-150x150.png`} />
                <link rel="icon" type="image/x-icon" id='image/x-icon21'
                    href={`${window.location.origin}/icons/images/favicon-16x16.ico`} />
                <link rel="shortcut icon" type="image/x-icon" id='image/x-icon21'
                    href={`${window.location.origin}/icons/images/favicon-32x32.ico`} />
                <link rel="icon" type="image/png" id='icon221'
                    href={`${window.location.origin}/icons/images/favicon-96x96.png`} />
                <link rel="apple-touch-icon-precomposed" id='apple-touch-icon-precomposed213' sizes="72x72"
                    href={`${window.location.origin}/icons/images/apple-touch-icon-72x72.png`} />
            </Helmet>
        )
    };

    return (
        <Aux>
            {renderMetadata()}
            <div>
                <LeftSidebar categories={categories} onCategorySelect={onCategorySelect} isPrivate={isPrivate} />
                <div className='products-container'>
                    {isPrivate &&
                        <div className='bg-white delivery-input-container'>
                            {renderDeliveryLocationInput()}
                        </div>
                    }
                    <ProductList loadNextPage={loadNextPage} products={products} showWarning={showWarning}
                        loading={productsRequestSent || fetchStoreInfoRequest}
                        canAddToCart={canAddToCart}
                        loadingPreviousPage={loadingPreviousPage}
                        loadPreviousPage={loadPreviousPage}
                        deliveryLocationAddress={deliveryLocationAddress}
                        deliveryLocationCoordinates={deliveryLocationCoordinates}
                        productSearchLocation={productSearchLocation}
                        productSearchLocationCoordinates={productSearchLocationCoordinates}
                        setProductAndShowProductAvailabilityModal={setProductAndShowProductAvailabilityModal}
                        storeUniqueId={storeUniqueId}
                        showScrollbar={showCheckout}
                        loadProductsBySearch={loadProductsBySearch}
                        showLocationAlert={showLocationAlert}
                        setProductAndShowReportProductModal={setProductAndShowReportProductModal}
                        isPrivate={isPrivate} categoryId={categoryId} shopsIds={shopIds}
                        privateStoresWarning={privateStoresWarning} hideWarning={() => setShowWarning(false)}
                        selectedCategory={selectedCategory} />
                    {(productsRequestSent || fetchStoreInfoRequest) && <div className='products-spinner-container'>
                        <RequestSpinner />
                    </div>}
                    {loadingNextPage ? <div className='next-page-loader'>
                        <div className="spinner-border text-dark" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div> : null}
                </div>
                <RightSidebar showBillingModalDialog={showBillingModalDialog} cartItems={cartItems}
                    isPrivate={isPrivate}
                    numberOfItemsInCart={numberOfItemsInCart} categoryId={categoryId} shopsIds={shopIds}
                    canAddToCart={canAddToCart} showLocationAlert={showLocationAlert}
                    storeUniqueId={storeUniqueId} deliveryLocationAddress={deliveryLocationAddress}
                    deliveryLocationCoordinates={deliveryLocationCoordinates}
                    productSearchLocation={productSearchLocation}
                    getBillingInfo={getBillingInfo}
                    totalAmount={totalAmount}
                    showSubscriptionAlert={showSubscriptionAlert}
                    productSearchLocationCoordinates={productSearchLocationCoordinates}
                    openCustomizeModal={openCustomizeOrderModal} fetchDeliveryTypes={fetchDeliveryTypes}
                    setShowProductAvailabilityModal={setProductAndShowProductAvailabilityModal}
                    openCheckoutModal={openCheckoutModal} />
                <ViewBillingModal clickBackdrop={() => setShowBillingModal(false)} cartItems={cartItems}
                    show={showBillingModal} categoryId={categoryId} />
                <ProductAvailabilityModal clickBackdrop={() => setShowProductAvailabilityModal(false)}
                    show={showProductAvailabilityModal} productId={productId}
                    cartItems={cartItems} />
                {useCurrentLocation &&
                    <GeoLocation deliveryLocation={useCurrentLocationForDelivery} />}
                <AlertDialog show={showAlertDialog} clickBackdrop={() => setShowAlertDialog(false)}
                    title={alertInfo.title} hideRejectButton={true}
                    message={alertInfo.message}
                    onConfirm={() => setShowAlertDialog(false)} />
                <CustomizeOrderModal show={showCustomizeOrderDialog} categoryId={categoryId} stores={shopIds}
                    clickBackdrop={onCustomizeModalCloses} />

                {showCheckout ? <CheckoutInformation show={showCheckout} categoryId={categoryId}
                    clearCart={clearCart}
                    isPrivate={isPrivate}
                    totalAmount={getItemsTotalPrice(cartItems)}
                    clickBackdrop={() => {
                        setShowCheckout(false)
                    }} /> : null}
                <ReportProductModal show={showReportProductModal} clickBackdrop={() => setShowReportProductModal(false)}
                    product={product} categoryId={categoryId} />
                <EditDeliveryAddressModal show={showEditDeliveryAddressModal} savingAddress={true}
                    clickBackdrop={() => setShowEditDeliveryAddressModal(false)}
                    fullAddress={deliveryLocationAddress} getUserProfile={getUserProfile} />
                <AlertDialog show={showDeleteAddressConfirmation} clickBackdrop={onDeleteAddressReject}
                    confirmButtonText={'Yes'} title='Delete Location'
                    message={'Are you sure you want to delete saved location?'}
                    onConfirm={onDeleteAddressConfirm} />
            </div>
        </Aux>
    );
};
export default withRouter(ProductsPage);
