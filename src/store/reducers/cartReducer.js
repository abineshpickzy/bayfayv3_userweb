import {
    CANCEL_DRAGGING,
    CART_FETCH_SUCCESS, CLEAR_CART,
    DROP_PRODUCT_IN_CART,
    START_DRAGGING_PRODUCT
} from "../actionTypes/cart-actions";
import CartUtils from "../../utils/CartUtils";

const initialState = {
    items: new Map(),
    totalItems: 0,
    totalAmount: 0,
    dnd: {
        draggedObject: null,
        isDragging: false
    }
};

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case START_DRAGGING_PRODUCT:
            return startDraggingProduct(state, action);
        case DROP_PRODUCT_IN_CART:
            return dropProductInCart(state, action);
        case CANCEL_DRAGGING:
            return cancelDraggingObject(state);
        case CART_FETCH_SUCCESS:
            return updateCart(state, action);
        case CLEAR_CART:
            return initialState;
        default:
            return state;
    }
};

const dropProductInCart = (state, action) => {
    return {
        ...state,
        dnd: {
            draggedObject: null,
            isDragging: false
        }
    };
};

const startDraggingProduct = (state, action) => {
    return {
        ...state,
        dnd: {
            draggedObject: action.payload,
            isDragging: true
        }
    }
};

const cancelDraggingObject = (state) => {
    return {
        ...state,
        dnd: {
            draggedObject: null,
            isDragging: false
        }
    }
};

const updateCart = (state, action) => {
    const items = new Map();
    if (!action.payload.data || action.payload.data.length === 0) {
        CartUtils.removeShopsIds();
        CartUtils.removeMostRecentShop();
        CartUtils.removeMostRecentAddresses();
    }
    let productsCount = 0;
    action.payload.data.forEach(item => {
        const quantity = item.stores.reduce((acc, store) => {
            return acc + store.product_details.qty
        }, 0);
        productsCount += quantity;
        items.set(item._id, {
            item: item,
            quantity,
        });
    });
    CartUtils.setNumberOfItems(productsCount);
    return {
        ...state,
        items
    };
};

export default cartReducer;
