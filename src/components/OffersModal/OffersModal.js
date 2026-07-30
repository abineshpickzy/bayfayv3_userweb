import React, {useEffect, useState} from 'react';
import './OffersModal.scss';
import CSSTransition from "react-transition-group/CSSTransition";
import ImageLoader from "../ImageLoader/ImageLoader";
import moment from "moment";
import {useSelector} from "react-redux";
import ApiEndpoints from "../../utils/ApiEndpoints";
import useHttp from "../../hooks/http";
import Loader from "../Loader/Loader";
import {fetchImage} from "../../utils/imageUtils";
import {LocationUtils} from "../../utils/LocationUtils";

const animationTiming = {
    enter: 1000,
    exit: 1000
};

const OffersModal = ({closeModal, show, navigateToProductsPage}) => {
    const apiEndpoints = new ApiEndpoints();
    const {sendRequest, isLoading} = useHttp();

    const [images, setImages] = useState({});
    const [loading, setLoading] = useState(false);

    const privateShops = useSelector(state => state.shopsReducer.privateShops);
    const publicShops = useSelector(state => state.shopsReducer.publicShops);
    const globalShops = useSelector(state => state.shopsReducer.globalShops);
    const brandedShops = useSelector(state => state.shopsReducer.brandedShops);
    const deliveryLocationCoordinates = useSelector(state => state.globalReducer.deliveryLocationCoordinates);
    const productSearchLocationCoordinates = useSelector(state => state.globalReducer.productSearchLocationCoordinates);
    const offers = useSelector(state => state.globalReducer.offers);

    useEffect(() => {
        if (show) {
            setImages({});
            checkShops();
        }
    }, [show]);

    useEffect(() => {
        if (show && !(privateShops.shops === null || publicShops.shops === null || brandedShops.shops === null || globalShops.shops === null)) {
            fetchOffers();
        }
    }, [show, privateShops, publicShops, brandedShops, globalShops]);

    const checkShops = () => {
        if (privateShops.shops === null || publicShops.shops === null || brandedShops.shops === null || globalShops.shops === null) {
            fetchShops();
        }
    };

    const fetchShops = () => {
        setLoading(true);
        let productSearchLng = productSearchLocationCoordinates.lng;
        let productSearchLat = productSearchLocationCoordinates.lat;
        let deliveryLng = deliveryLocationCoordinates.lng;
        let deliveryLat = deliveryLocationCoordinates.lat;
        if (+deliveryLat === 0 && +deliveryLng === 0) {
            const coords = LocationUtils.getMostRecentDeliveryCoordinates();
            if (coords?.lat && coords?.lng) {
                deliveryLat = coords.lat;
                deliveryLng = coords.lng;
            } else {
                setLoading(false);
            }

        }
        if (+productSearchLat === 0 && +productSearchLng === 0) {
            const coords = LocationUtils.getMostRecentProductSearchCoordinates();
            if (coords?.lat && coords?.lng) {
                productSearchLat = coords.lat;
                productSearchLng = coords.lng;
            } else {
                setLoading(false);
            }
        }
        const searchLocation = {
            "type": "Point",
            "coordinates": [productSearchLng, productSearchLat]
        };
        const deliveryLocation = {
            "type": "Point",
            "coordinates": [deliveryLng, deliveryLat]
        };
        const distance = 5;
        const maxDistance = distance * 1000;

        privateShops.shops === null && getPrivateShops(searchLocation, deliveryLocation, maxDistance);
        publicShops.shops === null && getPublicShops(searchLocation, deliveryLocation, maxDistance);
        brandedShops.shops === null && getBrandedShops(searchLocation, deliveryLocation, maxDistance);
        globalShops.shops === null && getGlobalShops(searchLocation, deliveryLocation, maxDistance);
    };

    const getGlobalShops = (searchLocation, deliveryLocation, maxDistance) => {
        const {url, method, body, success, error} =
            apiEndpoints
                .getApiEndpoints()
                .shops
                .globalShops(searchLocation, deliveryLocation, maxDistance);

        sendRequest(url, method, body, success, error, response => {

        });
    };

    const getBrandedShops = (searchLocation, deliveryLocation, maxDistance) => {
        const {url, method, body, success, error} =
            apiEndpoints
                .getApiEndpoints()
                .shops
                .publicShops(searchLocation, deliveryLocation, maxDistance, 2);
        sendRequest(url, method, body, success, error, response => {

        });
    };

    const getPublicShops = (searchLocation, deliveryLocation, maxDistance) => {
        const {url, method, body, success, error} =
            apiEndpoints
                .getApiEndpoints()
                .shops
                .publicShops(searchLocation, deliveryLocation, maxDistance, 1);

        sendRequest(url, method, body, success, error, response => {

        });
    };

    const getPrivateShops = (searchLocation, deliveryLocation, maxDistance) => {
        const {url, method, body, success, error} =
            apiEndpoints
                .getApiEndpoints()
                .shops
                .privateShops(searchLocation, deliveryLocation, maxDistance);

        sendRequest(url, method, body, success, error, response => {

        });
    };

    const fetchOffers = () => {
        const stores = [...privateShops.storesIds, ...publicShops.storesIds, ...brandedShops.storesIds, ...globalShops.storesIds];
        if (stores) {
            const {url, method, body, success, error} = apiEndpoints.getApiEndpoints().offers.getOffers(stores);
            sendRequest(url, method, body, success, error, response => {
                setLoading(false)
            }, _ => setLoading(false))
        }
    };

    useEffect(() => {
        let isCanceled = false;
        if (show && offers?.length > 0 && Object.keys(images).length === 0) {
            offers.forEach(promo => fetchShopImage(promo.shop_icon, isCanceled))
        }
        return () => {
            isCanceled = true;
        }
    }, [offers])

    const fetchShopImage = (imageName, isCanceled) => {
        fetchImage(`/category/view/img?img=${imageName}&format=jpeg&width=400&height=400`)
            .then(response => {
                const base64 = btoa(
                    new Uint8Array(response.data).reduce(
                        (data, byte) => data + String.fromCharCode(byte),
                        '',
                    ),
                );
                if (!isCanceled) {
                    const base64Image = "data:;base64," + base64;
                    setImages(prevState => ({...prevState, [imageName]: base64Image}));
                }
            })
             .catch(err => console.log(err));
    };

    return (
        <div onClick={closeModal}
             className={`promo-code-container ${show ? 'promo-code-container-open' : 'promo-code-container-closed'}`}>
            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={show}
                timeout={animationTiming}
                classNames={{
                    enter: '',
                    enterActive: 'modalOpen',
                    exit: 'modalClosed',
                    exitActive: 'modalClosed'
                }}>
                <div
                    className="position-fixed apply-promo-container apply-promo-container-modal offers-modal d-flex flex-column"
                    onClick={e => e.stopPropagation()}>

                    <div className="d-flex justify-content-start p-2">
                        <button className='btn close-apply-promo border-0' onClick={closeModal}>
                            <i className="fal fa-times font-size-15"/>
                        </button>
                        <div className='d-flex flex-grow-1 justify-content-center pr-4 align-items-center'>
                            <span className='todays-offers-label'>Todays Shop Offers</span>
                        </div>
                    </div>

                    {isLoading || loading ? <Loader/> :
                        offers?.length > 0 ?
                            <div className="d-flex flex-column align-items-center pt-1 items-wrapper font-size-3">
                                {offers?.map((promo, idx) => (
                                    <div key={`${promo._id}-${idx}`}
                                         className='w-100 mt-1 d-flex cursor-pointer
                    justify-content-between flex-shrink-0 promo-box-shadow bg-white d-flex py-2 px-3'
                                         onClick={() => navigateToProductsPage(promo)}>
                                        <div className='d-flex justify-content-start flex-grow-1'>
                                            <div className="mr-2">
                                                {
                                                    images[promo.shop_icon] ?
                                                        <img src={images[promo.shop_icon]} className='promo-shop-image'
                                                             alt="storeImg"/> :
                                                        <ImageLoader cssClass='wh100px' customSize={true}/>
                                                }
                                            </div>

                                            <div className="d-flex flex-column align-items-start py-1">
                                <span
                                    className="font-weight-bold promo-shop-title font-size-1rem">{promo.promo_title}</span>
                                                <span
                                                    className="promo-shop-info font-size-2">{promo.limited_users_per_day}</span>
                                                <span
                                                    className="font-italic overflow-auto mr-2 promo-shop-info2 text-left font-size-2">{promo.applicable_only_for_new_customer}</span>
                                                {(promo.code_pro_obj.value_type === 2 && promo.max_limit === "Max Limit" && promo.code_pro_obj.price_limit) ?
                                                    <span
                                                        className='font-size-2 max-limit'>Max Limit {promo.code_pro_obj.price_limit} ₹</span> : null}
                                                {promo?.min_purchase_obj?.type === 2 && promo?.min_purchase_obj.value > 0 ?
                                                    <span className='font-size-2 promo-discount text-left font-italic'>Minimum Purchase Limit {promo.min_purchase_obj.value}</span> : null}
                                                <span
                                                    className="font-italic promo-expiration font-size-2">Expiry on: {moment(promo.expiry_date).format('DD/MM/YYYY')}</span>
                                            </div>
                                        </div>

                                        <div
                                            className="d-flex flex-column align-items-center justify-content-center align-self-center">
                                            <h5 className="font-weight-bold promo-amount-color">
                                                {promo.code_pro_obj.value_type === 1 ? `₹ ${promo.code_pro_obj.code_value}` : ''}
                                                {promo.code_pro_obj.value_type === 2 ? `${promo.code_pro_obj.code_value} %` : ''}
                                            </h5>
                                            <span
                                                className="font-italic mb-1 promo-discount ">
                                {(promo.code_pro_obj.offer_type === 2) ? 'Discount' : ''}
                                                {(promo.code_pro_obj.offer_type === 1) ? 'Cashback' : ''}
                                </span>
                                            <span
                                                className="promo-code py-1 px-4 text-uppercase text-center">{promo.promo_code}</span>
                                        </div>
                                    </div>
                                ))}
                            </div> : <div className='w-100 d-flex pt-5 justify-content-center'>
                                <span className='font-size-1-2rem silver-text'>No Offers Today!</span>
                            </div>
                    }
                </div>
            </CSSTransition>
        </div>
    );
};

export default OffersModal;
