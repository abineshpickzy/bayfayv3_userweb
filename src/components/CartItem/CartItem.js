import React, {useEffect, useState} from 'react';
import './CartItem.scss';
import {fetchImage} from "../../utils/imageUtils";
import ImageLoader from "../ImageLoader/ImageLoader";
import {useSelector} from "react-redux";
import {addNewItems, removeItems} from "../../utils/productUtils";
import ApiEndpoints from "../../utils/ApiEndpoints";
import useHttp from "../../hooks/http";
import CartUtils from "../../utils/CartUtils";

const CartItem = ({
                      id, images, name, unit, price, quantity, canAddToCart, storeUniqueId, deliveryLocationAddress,
                      showLocationAlert, catId, shopsIds, isPrivate, setShowProductAvailabilityModal, fetchCart,
                      deliveryLocationCoordinates, productSearchLocationCoordinates, productSearchLocation
                  }) => {
    const apiEndpoints = new ApiEndpoints();
    const {sendRequest} = useHttp();

    const [addItemRequest, setAddItemRequest] = useState(false);
    const [image, setImage] = useState(null);
    const [stock, setStock] = useState(0);
    const [stockSet, setStockSet] = useState(false);

    const itemInCart = useSelector(state => state.cartReducer.items.get(id));
    const product = useSelector(state => Array.from(state.productsReducer.products).map(([_, product]) => product).flatMap(product => product.category)
        .find(product => product.stores[0].product_details.id === id));

    useEffect(() => {
        let isCanceled = false;
        if (images.length > 0 && !isCanceled && !image) {
            const imageName = images[0].name;
            fetchImage(`/product/img/view?img=${imageName}&format=png&height=100`)
                .then(response => {
                    const base64 = btoa(
                        new Uint8Array(response.data).reduce(
                            (data, byte) => data + String.fromCharCode(byte),
                            '',
                        ),
                    );
                    if (!isCanceled) {
                        const imageBase64 = "data:;base64," + base64;
                        setImage(imageBase64);
                    }
                })
                .catch(err => console.log(err));
        }
        return () => {
            isCanceled = true;
        }
    }, []);

    useEffect(() => {
        let isCanceled = false;
        if (catId && id && shopsIds && !stockSet) {
            const {url, method, body, success, error} =
                apiEndpoints
                    .getApiEndpoints()
                    .products
                    .getProductQuantity(catId, id, shopsIds);
            !isCanceled && sendRequest(url, method, body, success, error, response => {
                setStockSet(true);
                !isCanceled && saveStocks(response.data);
            });
        }
        return () => {
            isCanceled = true;
        }
    }, [catId, id, shopsIds]);

    const saveStocks = data => {
        const stock = data.stores.reduce((acc, store) => {
            return acc + store.product_details.stock
        }, 0);
        setStock(stock);
    };

    const changeQuantity = q => {
        if (!canAddToCart()) {
            showLocationAlert();
            return;
        }
        const qty = itemInCart ? itemInCart.quantity : 0;
        let diff = q - qty;
        const storeQty = diff > 0 ? addNewItems(product, qty, diff)
            : removeItems(itemInCart.item.stores, diff * -1);
        const body = {
            "_id": catId,
            "product_id": itemInCart.item._id,
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
        setAddItemRequest(false);
        CartUtils.setMostRecentShop({
            shopsIds,
            isPrivate,
            storeUniqueId,
            categoryId: catId
        });
        CartUtils.storeShopsIds(shopsIds);
        CartUtils.setMostRecentDeliveryAddress(deliveryLocationAddress, deliveryLocationCoordinates);
        CartUtils.setMostRecentProductSearchAddress(productSearchLocation, productSearchLocationCoordinates);
        fetchCart();
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
        const body = {
            "_id": catId,
            "product_id": itemInCart.item._id,
            "is_private": isPrivate,
            "stores": itemInCart.item.stores.map(store => {
                return {
                    "store_id": store.store_id,
                    "qty": store.qty
                }
            })
        };
        removeFromCartRequest(body);
    };

    return (
        <li className='list-group-item border-0 font-size-2 cart-item p-2'>
            <div className='d-flex flex-row justify-content-between'>
                <div className='d-flex flex-column align-items-end w-70px flex-shrink-0 mr-1'>
                    {
                        (image && !addItemRequest) ? <div className='cart-image-holder'><img src={image} className='cart-image'
                                                          alt="image"/></div> :
                            <ImageLoader cssClass='cart-image-loader' customSize={true}/>
                    }
                    <span className='mt-1 qty-label'>QTY: </span>
                </div>
                <div className='d-flex flex-column justify-content-between reduced-line-height item-details'>
                    <div className='d-flex flex-column item-details-color'>
                        <span className='text-truncate mb-1' title={name}>{name}</span>
                        <span className='text-truncate mb-1' title={unit}>{unit}</span>
                        <span className='text-truncate margin-bottom-10px'
                              title={price}>₹{Math.round((price * quantity) * 100) / 100}</span>
                    </div>
                    <div className='d-flex flex-row justify-content-start align-items-center'>
                        <div className="dropdown btn-small-50px">
                            <button type="button" data-toggle="dropdown"
                                    className="btn btn-light font-size-2 cart-item-dropdown p-0 btn-small-50px dropdown-toggle h-30px quantity-btn">
                                <span className='w-50 d-inherit text-left'>{quantity}</span>
                            </button>
                            <div className="dropdown-menu max-height-300px overflow-y-auto">
                                {Array.from(Array(stock).keys()).map(q => (
                                    <span className="dropdown-item hover-grey" key={q + 1}
                                          onClick={() => changeQuantity(q + 1)}>{q + 1}</span>
                                ))}
                            </div>
                        </div>
                        <button className='btn btn-small btn-more h-30px'
                                onClick={() => setShowProductAvailabilityModal(true, id)}>
                            More...
                        </button>
                    </div>
                </div>
                <div className='d-flex flex-column justify-content-center w-24px flex-shrink-0'>
                    <button className='btn btn-sm remove-item-btn' onClick={removeFromCart}>
                        <i className="fal fa-times"/>
                    </button>
                </div>
            </div>
        </li>
    );
};

export default CartItem;
