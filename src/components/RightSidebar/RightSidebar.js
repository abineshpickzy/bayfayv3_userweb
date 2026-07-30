import React, { useState } from 'react';
import './RightSidebar.scss'
import { useSelector } from "react-redux";
import useSyncDispatch from "../../hooks/dispatch";
import { DROP_PRODUCT_IN_CART } from "../../store/actionTypes/cart-actions";
import CartItem from "../CartItem/CartItem";
import Aux from "../../utils/auxilary";
import { addNewItems, getProductPrice, getProductQuantity } from "../../utils/productUtils";
import ApiEndpoints from "../../utils/ApiEndpoints";
import useHttp from "../../hooks/http";
import { withRouter } from "react-router-dom";
import CartUtils from "../../utils/CartUtils";
import { SHOW_LOGIN_MODAL } from "../../store/actionTypes/global-actions";

const RightSidebar = ({
    showBillingModalDialog, cartItems, numberOfItemsInCart, canAddToCart, showLocationAlert,
    setShowProductAvailabilityModal, categoryId, shopsIds, isPrivate, openCustomizeModal,
    openCheckoutModal, fetchDeliveryTypes, storeUniqueId, deliveryLocationAddress,
    deliveryLocationCoordinates, productSearchLocationCoordinates, productSearchLocation,
    showSubscriptionAlert, totalAmount, getBillingInfo
}) => {

    const apiEndpoints = new ApiEndpoints();
    const { sendRequest, isLoading } = useHttp();
    const { sendDispatch } = useSyncDispatch();

    const [addItemRequest, setAddItemRequest] = useState(false);

    const isGuest = useSelector(state => state.authReducer.isGuest);
    const dndObject = useSelector(state => state.cartReducer.dnd);
    const itemInCart = useSelector(state => state.cartReducer.items.get(dndObject?.draggedObject?._id));
    const deliveryTypes = useSelector(state => state.orderReducer.deliveryTypes);
    const openedShop = useSelector(state => state.shopsReducer?.openedShop?.shop);

    const handleDrop = e => {
        e.preventDefault();
        e.stopPropagation();
        if (dndObject?.draggedObject) {
            if (isGuest) {
                sendDispatch(SHOW_LOGIN_MODAL);
                return;
            }
            if (!canAddToCart()) {
                showLocationAlert();
                return;
            }
            setAddItemRequest(true);
            sendDispatch(DROP_PRODUCT_IN_CART);
            addToCart();
        }
    };

    const handleDragEnter = e => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragOver = e => {
        e.preventDefault();
        e.stopPropagation();
    };

    const addToCart = () => {
        const _id = dndObject.draggedObject.stores[0].product_details.id;
        const qty = itemInCart ? itemInCart.quantity : 0;
        const storeQty = addNewItems(dndObject.draggedObject, qty, 1);
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
        const { url, method, body, success, error } =
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
        const { url, method, body, success, error } =
            apiEndpoints
                .getApiEndpoints()
                .cart
                .getCart(categoryId);
        sendRequest(url, method, body, success, error, () => {
            setAddItemRequest(false)
        });
    };

    const updateDeliveryMode = typeId => {
        if (typeId === 3 && CartUtils.getIsOtherLocationShop() === 'true') {
            return;
        }
        const { url, method, body, success, error } =
            apiEndpoints
                .getApiEndpoints()
                .user
                .updateDeliveryType(typeId);
        sendRequest(url, method, body, success, error, () => {
            getBillingInfo();
            fetchDeliveryTypes();
        });
    };

    const renderCardItems = () => {
        if (numberOfItemsInCart === 0) {
            return <div className='flex-grow-1 d-flex justify-content-center align-items-center flex-column px-4'>
                <span className='text-center silver-text cart-empty-title'>Cart Empty</span>
                <span className='text-center silver-text font-size-3'>
                    Drag the product and drop it here to add in the cart
                </span>
            </div>
        }
        return Array.from(cartItems).map(([key, item]) => (
            <CartItem name={item.item.productInfo.product_name}
                unit={item.item.productInfo.unit} id={key}
                fetchCart={fetchCart}
                deliveryLocationAddress={deliveryLocationAddress}
                deliveryLocationCoordinates={deliveryLocationCoordinates}
                productSearchLocation={productSearchLocation}
                productSearchLocationCoordinates={productSearchLocationCoordinates}
                canAddToCart={canAddToCart}
                storeUniqueId={storeUniqueId}
                showLocationAlert={showLocationAlert}
                shopsIds={shopsIds}
                setShowProductAvailabilityModal={setShowProductAvailabilityModal}
                images={item.item.productInfo.images}
                price={getProductPrice(item.item)}
                isPrivate={isPrivate}
                catId={categoryId}
                quantity={getProductQuantity(item.item)} key={key} />
        ))
    };

    const getDeliveryType = () => {
        if (!deliveryTypes) {
            return 'Delivery Mode';
        }
        const type = deliveryTypes?.type.find(t => t._id === deliveryTypes.delivery_type);
        if (!deliveryTypes.type || deliveryTypes.type.length === 0) {
            return '';
        }
        if (!type) {
            return deliveryTypes.type[0].name;
        } else {
            return type?.name;
        }
    };

    const subscribeToShop = () => {
        if (!openedShop?.features?.enable_subscription) {
            showSubscriptionAlert('Subscription not available for this shop!');
        } else {
            showSubscriptionAlert('This feature available on BayFay mobile app');
        }
    };

    const renderDeliveryTypes = () => {
        return deliveryTypes?.type.map(type => (
            <div
                className={`dropdown-item d-flex flex-row align-items-center p-3 delivery-choices
                ${(type._id === 3 && CartUtils.getIsOtherLocationShop() === 'true') ? 'disabled-delivery-mode' : ''}`}
                key={type._id}
                onClick={() => updateDeliveryMode(type._id)}>
                {type._id === 1 ? <i className="fas fa-truck text-primary delivery-icon" /> : null}
                {type._id === 3 ? <i className="fas fa-user p-3 text-purple delivery-icon" /> : null}
                <span className='mr-3 font-size-3 flex-grow-1'>{type.name}</span>
                {deliveryTypes.delivery_type === type._id ?
                    <i className="fal fa-check-circle mx-2 text-success delivery-checked" /> :
                    <Aux>
                        <span className='delivery-unchecked mx-2' />
                        <i className="fal fa-check-circle mx-2 text-secondary delivery-checked delivery-hover" />
                    </Aux>}
            </div>
        ))
    };

    return (
        <div className={`right-sidebar d-flex flex-column align-items-center p-1`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDrop={handleDrop}>
            <ul className={`list-group overflow-y-auto w-100 box-sizing-border-box h-100 border-transparent-2px
            ${dndObject.isDragging ? 'droppingArea' : ''}`}>
                {renderCardItems()}
            </ul>
            {(addItemRequest || isLoading) && <div className='position-absolute drop-spinner'>
                <div className="spinner-border text-dark" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>}
            <Aux>
                <div className='width-250px text-secondary font-size-3 p-1'>
                    <div className='d-flex flex-row w-100 m-0'>
                        <div
                            className='p-0 w-50 height-35px d-flex align-items-center justify-content-center text-info mr-1 mb-1'>
                            <button type="button" onClick={showBillingModalDialog}
                                className="btn btn-light border-0 p-0 w-100 h-100 border-radius-0 view-billing-button bg-white">
                                View Billing
                            </button>
                        </div>
                        <div
                            className='p-0 w-50 height-35px d-flex align-items-center justify-content-center mb-1'>
                            <button type="button" onClick={openCustomizeModal}
                                className="btn btn-light border-0 p-0 w-100 h-100 border-radius-0 customize-order-button bg-white">
                                Customize
                            </button>
                        </div>
                    </div>
                    <div className='d-flex flex-row w-100 m-0'>
                        <div
                            className='p-0 w-50 height-35px d-flex align-items-center justify-content-center text-white mr-1'>
                            <button type="button" onClick={subscribeToShop}
                                className="btn btn-light border-0 p-0 w-100 h-100 border-radius-0 subscribe-button">
                                Subscribe
                            </button>
                        </div>
                        <div
                            className='w-50 p-0 height-35px d-flex align-items-center justify-content-center position-relative cursor-pointer'>
                            <button type="button"
                                className={`btn btn-light border-0 p-0 w-100 h-100 bg-white delivery-mode-button ${deliveryTypes ? 'padding-top-10px' : ''}`}
                                data-toggle="dropdown"
                                aria-haspopup="true" aria-expanded="false">
                                {getDeliveryType()}
                            </button>
                            <div className="dropdown-menu p-0">
                                {renderDeliveryTypes()}
                            </div>
                            {deliveryTypes &&
                                <span className='position-absolute delivery-mode font-size-5'>Delivery Mode</span>}
                        </div>
                    </div>
                </div>
                <div className='w-100 font-size-2'>
                    <button
                        onClick={openCheckoutModal} disabled={!openedShop}
                        className={`btn btn-block bg-green-light checkout-btn ${numberOfItemsInCart > 0 ? 'non-empty-cart' : 'empty-cart'}`}>
                        {numberOfItemsInCart > 0 ?
                            <span>Proceed to Buy
                                {totalAmount > 0 ? ` ₹ ${totalAmount}` :
                                    <span className="spinner-border spinner-border-sm ml-2" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </span>
                                }
                            </span>
                            : 'Cart Empty'}
                    </button>
                </div>
            </Aux>
        </div>
    );
};

export default withRouter(RightSidebar);
