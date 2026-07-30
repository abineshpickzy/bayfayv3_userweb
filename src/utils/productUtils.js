export const getProductPrice = (product) => {
    let price = 0;
    if (product?.stores?.length > 0) {
        price = product.stores[0].product_details.offer_selling_price;
        product.stores.forEach(store => {
            if (store.product_details.net_price < price) {
                price = store.product_details.net_price;
            }
        })
    }
    return price;
};

export const getProductQuantity = product => {
    let qty = 0;
    if (product?.stores?.length > 0) {
        product.stores.forEach(store => {
            qty += store.product_details.qty;
        })
    }
    return qty;
};

export const removeItems = (stores, qty) => {
    const sortedStores = stores.sort((s1, s2) => s1.net_price - s2.net_price).reverse();

    const storeQty = {};
    sortedStores.forEach(store => {
        const store_id = store.store_id;
        if (qty > 0) {
            if (store.product_details.qty >= qty) {
                storeQty[store_id] = qty;
                qty = 0;
            } else {
                storeQty[store_id] = store.product_details.stock;
                qty -= store.product_details.stock;
            }
        }
    });

    return Object.keys(storeQty).reduce((storeArray, key) => {
        storeArray.push({
            store_id: key,
            qty: storeQty[key] * -1
        });
        return storeArray;
    }, []);
};

export const addNewItems = (product, qty, newQty) => {
    const initialStock = {};
    const stores = product.stores.sort((s1, s2) => s1.net_price - s2.net_price);
    stores.forEach(store => { // remember the initial stock in each store
        initialStock[store.store_id] = store.product_details.stock;
    });

    const storeQty = {};
    let isRunning = true;
    while (isRunning) {
        for (let i = 0; i < stores.length; i++) {
            let store = stores[i];
            const store_id = store.store_id;
            if (qty > 0) {
                if (store.product_details.stock >= qty) {
                    store.product_details.stock -= qty;
                    qty = 0;
                    break;
                } else {
                    qty -= store.product_details.stock;
                    store.product_details.stock = 0;
                }
            } else {
                if (newQty > 0 && store.product_details.stock > 0) {
                    if (store.product_details.stock >= newQty) {
                        storeQty[store.store_id] = newQty;
                        store.product_details.stock -= newQty;
                        newQty = 0;
                        isRunning = false;
                        break;
                    } else {
                        storeQty[store_id] = store.product_details.stock;
                        newQty -= store.product_details.stock;
                        store.product_details.stock = 0;
                    }
                } else {
                    isRunning = false;
                }
            }
        }
    }

    product.stores.forEach(store => { // restore initialStock
        store.product_details.stock = initialStock[store.store_id];
    });

    return Object.keys(storeQty).reduce((storeArray, key) => {
        storeArray.push({
            store_id: key,
            qty: storeQty[key]
        });
        return storeArray;
    }, []);
};

export const getProductSumPrice = (product) => {
    const sum = product.item.stores.reduce((acc, store) => {
        return acc + store.product_details.offer_selling_price * store.product_details.qty;
    }, 0);
    return Math.round(sum * 100) / 100;
};

export const getItemsTotalPrice = (items) => {
    let sum = 0;
    Array.from(items).forEach(([key, item]) => {
            sum += getProductSumPrice(item);
        }
    );
    return Math.round(sum * 100) / 100;
};

export const getProductOfferPrices = product => {
    const stores = product.stores.sort((s1, s2) => s1.net_price - s2.net_price);
    return {
        selling_price: stores[0].product_details.selling_price,
        offer_selling_price: stores[0].product_details.offer_selling_price,
        offer_price: stores[0].product_details.offer_price,
        isWithOffer: stores[0].product_details.offer_price !== 0,
        offer: stores[0].product_details.offer,
    }
};
