import React, {useEffect, useState} from 'react';
import './Product.scss';
import {useSelector} from "react-redux";
import {fetchImage} from "../../utils/imageUtils";
import ImageLoader from "../ImageLoader/ImageLoader";
import {withRouter} from "react-router-dom";
import ApiEndpoints from "../../utils/ApiEndpoints";
import useHttp from "../../hooks/http";
import {addNewItems, getProductOfferPrices, getProductPrice, removeItems} from "../../utils/productUtils";
import RequestSpinner from "../RequestSpinner/RequestSpinner";
import CartUtils from "../../utils/CartUtils";
import useSyncDispatch from "../../hooks/dispatch";
import {SHOW_LOGIN_MODAL} from "../../store/actionTypes/global-actions";
import ProductDetailsModal from "../ProductDetailsModal/ProductDetailsModal";

const Product = ({
                     product, draggedObjectId, onDragStart, _id, shopsIds, categoryId, setProductAndShowProductAvailabilityModal,
                     isPrivate, canAddToCart, showLocationAlert, storeUniqueId, setProductAndShowReportProductModal,
                     deliveryLocationAddress, deliveryLocationCoordinates, productSearchLocationCoordinates, productSearchLocation
                 }) => {
    const apiEndpoints = new ApiEndpoints();
    const {sendRequest, isLoading} = useHttp();
    const {sendDispatch} = useSyncDispatch();

    const itemInCart = useSelector(state => state.cartReducer.items.get(_id));
    const isGuest = useSelector(state => state.authReducer.isGuest);
    const productDetailsTemplate = useSelector(state => state.productsReducer.productDetailsTemplate);
    const isDragged = _id === draggedObjectId;

    const [showProductDetails, setShowProductDetails] = useState(false);
    const [images, setImages] = useState([]);
    const [addItemRequest, setAddItemRequest] = useState(false);
    const [imagesLoading, setImagesLoading] = useState(false);

    useEffect(() => {
        let isCanceled = false;
        const productImages = product.productInfo.images;
        if (productImages.length > 0 && !isCanceled && (!images || images.length === 0)) {
            const imageName = productImages[0].name;
            fetchImage(`/product/img/view?img=${imageName}&format=png&height=150`)
                .then(response => {
                    const base64 = btoa(
                        new Uint8Array(response.data).reduce(
                            (data, byte) => data + String.fromCharCode(byte),
                            '',
                        ),
                    );
                    if (!isCanceled) {
                        const imageBase64 = "data:;base64," + base64;
                        // sendDispatch(IMAGE_FETCH, {
                        //     productId: _id,
                        //     name: imageName,
                        //     base64: imageBase64,
                        //     resolution: '150x150',
                        //     index: 1
                        // });
                        setImages(prevState => [...prevState, {
                                productId: _id,
                                name: imageName,
                                base64: imageBase64,
                                resolution: '150x150',
                                index: 1
                            }]
                        );
                        fetchWithBiggerResolution(isCanceled);
                    }
                })
                 .catch(err => console.log(err));
        }
        return () => {
            isCanceled = true;
        }
    }, [setImages]);

    const fetchWithBiggerResolution = isCanceled => {
        const imageName = product.productInfo.images[0].name;
        fetchImage(`/product/img/view?img=${imageName}&format=png&height=300`)
            .then(response => {
                const base64 = btoa(
                    new Uint8Array(response.data).reduce(
                        (data, byte) => data + String.fromCharCode(byte),
                        '',
                    ),
                );
                if (!isCanceled) {
                    const imageBase64 = "data:;base64," + base64;
                    setImages(prevState => {
                        return [...prevState.filter(img => img.index !== 1), {
                            productId: _id,
                            name: imageName,
                            base64: imageBase64,
                            resolution: '300x300',
                            index: 1
                        }]
                    });
                }
            })
            .catch(err => console.log(err));
    };


    const fetchSingleImage = (imageName, index) => {
        const existingImage = images.find(img => img.name === imageName && img.resolution === '500x500');
        if (existingImage) {
            if (index === product.productInfo.images.length) {
                setImagesLoading(false);
            }
            return;
        }
        fetchImage(`/product/img/view?img=${imageName}&format=png&height=500`)
            .then(response => {
                const base64 = btoa(
                    new Uint8Array(response.data).reduce(
                        (data, byte) => data + String.fromCharCode(byte),
                        '',
                    ),
                );
                const imageBase64 = "data:;base64," + base64;
                setImages(prevState => ([...prevState.filter(img => img.index !== index), {
                    productId: _id,
                    name: imageName,
                    base64: imageBase64,
                    resolution: '500x500',
                    index
                }]));

                if (index === product.productInfo.images.length) {
                    setImagesLoading(false);
                }
            })
             .catch(() => {
                if (index === product.productInfo.images.length) {
                    setImagesLoading(false);
                }
            });
    };

    const addToCart = () => {
        if (isGuest) {
            setShowProductDetails(false);
            sendDispatch(SHOW_LOGIN_MODAL);
            return;
        }
        if (!canAddToCart()) {
            showLocationAlert();
            return;
        }
        const qty = itemInCart ? itemInCart.quantity : 0;
        const storeQty = addNewItems(product, qty, 1);
        const body = {
            "_id": categoryId,
            "product_id": _id,
            "is_private": isPrivate,
            "stores": storeQty
        };
        addToCartRequest(body);
    };

    const addToCartRequest = (apiBody) => {
        setAddItemRequest(true);
        const {url, method, body, success, error} =
            apiEndpoints
                .getApiEndpoints()
                .cart
                .add(apiBody);
        sendRequest(url, method, body, success, error, saveToLocalStorageAndFetchCart);
    };

    const saveToLocalStorageAndFetchCart = () => {
        CartUtils.setMostRecentShop({
            shopsIds,
            isPrivate,
            storeUniqueId,
            categoryId
        });
        CartUtils.storeShopsIds(shopsIds);
        CartUtils.setMostRecentDeliveryAddress(deliveryLocationAddress, deliveryLocationCoordinates);
        CartUtils.setMostRecentProductSearchAddress(productSearchLocation, productSearchLocationCoordinates);
        fetchCart();
    };

    const fetchCart = () => {
        const {url, method, body, success, error} =
            apiEndpoints
                .getApiEndpoints()
                .cart
                .getCart(categoryId);
        sendRequest(url, method, body, success, error, () => {
            setAddItemRequest(false)
        });
    };

    const removeFromCartRequest = (apiBody) => {
        setAddItemRequest(true);
        const {url, method, body, success, error} =
            apiEndpoints
                .getApiEndpoints()
                .cart
                .remove(apiBody);
        sendRequest(url, method, body, success, error, fetchCart);
    };

    const removeFromCart = () => {
        if (!canAddToCart()) {
            showLocationAlert();
            return;
        }
        const storeQty = removeItems(itemInCart.item.stores, 1);
        const body = {
            "_id": categoryId,
            "product_id": _id,
            "is_private": isPrivate,
            "stores": storeQty
        };
        itemInCart?.quantity === 1 ? removeFromCartRequest(body) : addToCartRequest(body);
    };

    const openProductAvailabilityModal = () => {
        setProductAndShowProductAvailabilityModal(true, _id);
    };

    const openReportProductModal = () => {
        if (isGuest) {
            setShowProductDetails(false);
            sendDispatch(SHOW_LOGIN_MODAL);
        } else {
            setProductAndShowReportProductModal(true, product);
        }
    };

    const draggingStart = (event) => {
        onDragStart(event, product);
    };

    const fetchAllImagesAndShowModal = () => {
        setImagesLoading(true);
        product.productInfo.images.forEach((img, index) => {
            fetchSingleImage(img.name, index + 1);
        });
        setShowProductDetails(true);
    };

    const renderButtons = () => {
        if (!itemInCart) {
            return (
                <button className='btn btn-success btn-sm btn-rounded align-self-center my-1 add-btn'
                        onClick={addToCart}>
                    Add
                </button>
            );
        }
        return (
            <div className="d-flex justify-content-around my-1">
                <button className='btn btn-sm decrease-btn rounded-circle icon-button' onClick={removeFromCart}>
                    <i className="fas fa-minus"/>
                </button>
                <h5 className='m-0 px-3'>{itemInCart.quantity}</h5>
                <button className='btn btn-sm increase-btn rounded-circle icon-button' onClick={addToCart}>
                    <i className="fas fa-plus"/>
                </button>
            </div>
        )
    };

    const {offer} = getProductOfferPrices(product);

    return (
        <div className={`card product-card p-1 m-2 position-relative ${isDragged ? 'isDragged' : ''}`}>
            {images?.length > 0 && images.find(i => i.index === 1) ? <div className='position-relative'>
                <img src={images.find(i => i.index === 1).base64}
                     className="cursor-pointer hover-opacity product-image"
                     title="Click and hold to drag object to cart"
                     onClick={fetchAllImagesAndShowModal}
                     alt="product"
                     draggable={true}
                     onDragStart={draggingStart}
                />
                {offer && offer > 0 ? <div className='product-offer'>
                    {offer.toFixed(1)}% off
                </div> : null}
            </div> : <ImageLoader/>}
            <div className="card-body product font-size-2">
                <span
                    className='text-center block text-truncate'>₹{getProductPrice(product)} | {product.productInfo.unit}</span>
                <span
                    className='text-center block normal-line-height text-truncate'>{product.productInfo.product_name}</span>
            </div>
            {renderButtons()}
            {addItemRequest && isLoading && <RequestSpinner/>}
            <ProductDetailsModal show={showProductDetails} clickBackdrop={() => setShowProductDetails(false)}
                                 product={product} images={images} itemInCart={itemInCart} storesIds={shopsIds}
                                 removeFromCart={removeFromCart} loading={addItemRequest && isLoading}
                                 imagesCount={product.productInfo.images.length}
                                 openProductAvailabilityModal={openProductAvailabilityModal}
                                 openReportProductModal={openReportProductModal}
                                 templates={productDetailsTemplate} _id={_id}
                                 categoryId={categoryId} imagesLoading={imagesLoading} addToCart={addToCart}/>
        </div>
    );
};

export default withRouter(Product);
