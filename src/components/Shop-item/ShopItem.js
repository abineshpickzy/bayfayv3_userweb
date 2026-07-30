import React, {useEffect, useState} from 'react';
import './ShopItem.scss';
import imageSource from '../../assets/images/100x100.png';
import history from "../../utils/history";
import {fetchImage} from "../../utils/imageUtils";
import CartUtils from "../../utils/CartUtils";
import AlertDialog from "../AlertDialog/AlertDialog";
import ApiEndpoints from "../../utils/ApiEndpoints";
import useHttp from "../../hooks/http";
import useSyncDispatch from "../../hooks/dispatch";
import {SET_OPENED_SHOP_INFO} from "../../store/actionTypes/shops-actions";
import {CLEAR_PRODUCTS} from "../../store/actionTypes/products-actions";
import {useSelector} from "react-redux";
import {cartWarningMessage} from "../../utils/constants";
import ImageLoader from "../ImageLoader/ImageLoader";

const ShopItem = ({shop, isStatic, staticImagePrefix, staticImageIndex, showCount, isPrivate, isOtherLocationShop}) => {
    const apiEndpoints = new ApiEndpoints();
    const {sendRequest, isLoading} = useHttp();
    const {sendDispatch} = useSyncDispatch();

    const [image, setImage] = useState(null);

    let shopCount = -1;
    const [showWarningDialog, setShowWarningDialog] = useState(false);

    const isGuest = useSelector(state => state.authReducer.isGuest);

    const calculateShopCount = () => {
        if (shop?.stores?.length > 0) {
            shopCount = shop.stores.length;
        }
    };

    !isStatic && calculateShopCount();

    useEffect(() => {
        let imageUrl = `/category/view/img?img=${shop.image}&format=jpeg&width=400&height=400&is_web=1`;
        if (isPrivate && shop.is_open === false && shop.private_is_open === false && !isStatic) {
            imageUrl = imageUrl.concat('&off=1');
        }
        let isCanceled = false;
        if (shop.image && !isCanceled) {
            fetchImage(imageUrl)
                .then(response => {
                    const base64 = btoa(
                        new Uint8Array(response.data).reduce(
                            (data, byte) => data + String.fromCharCode(byte),
                            '',
                        ),
                    );
                    if (!isCanceled) {
                        setImage("data:;base64," + base64);
                    }
                })
                .catch(err => console.log(err));
        }
        return () => {
            isCanceled = true;
        }
    }, [setImage]);


    const rating = !isStatic && shop.store_rating && shop.store_rating.avg_rating &&
        Math.round(shop.store_rating.avg_rating * 10) / 10;

    const navigateToProducts = () => {
        if (isStatic || (shop?.private_is_open === false && shop?.is_open === false)) return;
        sendDispatch(CLEAR_PRODUCTS);
        const id = shop.stores.join('_');
        const categoryId = shop._id;
        if (CartUtils.canAddToCart(shop.stores.toString()) || isGuest) {
            if (!isStatic) {
                if (isPrivate) {
                    CartUtils.setIsOtherLocationShop(isOtherLocationShop);
                    const store_unique_id = shop.promoid_obj.shop_unique_id;
                    history.push(store_unique_id);
                } else {
                    CartUtils.setIsOtherLocationShop(isOtherLocationShop);
                    sendDispatch(SET_OPENED_SHOP_INFO, {
                        isSet: true,
                        image: image,
                        shop
                    });
                    history.push(`/public/products`,
                        {
                            categoryId,
                            shopsIds: id,
                            isPrivate,
                            isRecentShop: false
                        });
                }
            }
        } else {
            setShowWarningDialog(true);
        }
    };

    const hideWarningDialogAndProceed = () => {
        const id = shop.stores.join('_');
        const categoryId = shop._id;
        setShowWarningDialog(false);
        sendDispatch(SET_OPENED_SHOP_INFO, {
            isSet: true,
            image: image,
            shop
        });
        if (isPrivate) {
            CartUtils.removeShopsIds();
            CartUtils.setNumberOfItems(0);
            CartUtils.removeMostRecentShop();
            CartUtils.removeMostRecentAddresses();
            CartUtils.setIsOtherLocationShop(isOtherLocationShop);
            const store_unique_id = shop.promoid_obj.shop_unique_id;
            history.push(store_unique_id);
        } else {
            CartUtils.setIsOtherLocationShop(isOtherLocationShop);
            history.push(`/public/products`,
                {
                    categoryId,
                    shopsIds: id,
                    isPrivate,
                    isRecentShop: false
                });
        }
    };

    const clearCartAndCloseDialog = () => {
        const {url, method, body, success, error} =
            apiEndpoints
                .getApiEndpoints()
                .cart
                .clearCart();
        sendRequest(url, method, body, success, error, hideWarningDialogAndProceed);
    };

    const renderImage = () => {
        if (shop.image) {
            if (!image) {
                return (
                    <ImageLoader cssClass='rounded-10px'/>
                )
            } else {
                return (
                    <div className='position-relative'>
                        <img className="card-img-bottom max-wh-9rem rounded-10 shop-hover" src={image}
                             alt="Card image cap"/>
                        {rating ? <span className='position-absolute rating'>
                            <span className='font-size-3 mr-1'>{rating}</span>
                            <i className="fas fa-star rating-icon"/>
                        </span> : null}
                        {(shopCount !== -1 && showCount) ?
                            <span className='shop-count'>
                            {shopCount}
                        </span> : null}
                        {shop?.offer?.code_value > 0 ? <div className='shop-offer'>
                            <img src={require('../../assets/images/Promotion.gif')} alt="offer"
                                 className='shop-offer-img'/>
                            <span className='shop-offer-value'>
                                <span className='mb-1px'>Save</span>
                                <span
                                    className={`${shop.offer.value_type === 2 ? 'pl-5px' : ''}`}>{shop.offer.value_type === 1 ?
                                    <span
                                        className='rupee'>₹</span> : ''}{shop.offer.code_value}{shop.offer.value_type === 2 ? '%' : ''}</span>
                            </span>
                        </div> : null}
                    </div>
                )
            }
        } else {
            if (staticImagePrefix) {
                return (
                    <img className="card-img-bottom max-wh-9rem rounded-10"
                         src={require(`../../assets/images/static-shops/${staticImagePrefix}_${staticImageIndex}.jpg`)}
                         alt="Card image cap"/>
                );
            } else {
                return (
                    <img className="card-img-bottom max-wh-9rem rounded-10"
                         src={imageSource}
                         alt="Card image cap"/>
                )
            }
        }
    };

    return (
        <div className="card shop-item rounded-10 col-2 text-center cursor-pointer p-2 align-self-start"
             onClick={navigateToProducts}>
            <div className="card-body p-0 mb-1 d-flex justify-content-center align-items-center">
                {renderImage()}

            </div>
            <span> {staticImagePrefix ? staticNames[staticImagePrefix][staticImageIndex] : shop.display_name} </span>
            <AlertDialog show={showWarningDialog} clickBackdrop={() => setShowWarningDialog(false)} hideHeader={true}
                         confirmButtonText={'Yes'} isLoading={isLoading} revertButtons={true}
                         message={cartWarningMessage} onConfirm={clearCartAndCloseDialog}/>
        </div>
    );
};
export default ShopItem;


const staticNames = {
    public: {
        1: 'Super Market',
        2: 'Jewellery world',
        3: 'Medical Store',
        4: 'Phone Shop',
        5: 'Phone Shop',
        6: 'Toy Store'
    },
    private: {
        1: 'Mobile Store',
        2: 'Chocolate Store',
        3: 'Kids Store',
        4: 'Chocolate Corner',
        5: 'Medical Store',
        6: 'Grocery Store'
    },
    branded: {
        1: 'Pharmacy',
        2: 'Clothing store',
        3: 'Babies & Kids',
        4: 'Medical Shop',
        5: 'Toy shop',
        6: 'Beauty shop'
    }
};
