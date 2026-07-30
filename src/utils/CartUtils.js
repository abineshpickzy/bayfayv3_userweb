class CartUtils {

    static SHOPS_IDS = 'SHOPS_IDS';
    static NUMBER_OF_ITEMS = 'NUMBER_OF_ITEMS';
    static MOST_RECENT_SHOP = 'MOST_RECENT_SHOP';
    static MOST_RECENT_DELIVERY_ADDRESS = 'MOST_RECENT_DELIVERY_ADDRESS';
    static MOST_RECENT_PRODUCT_SEARCH_ADDRESS = 'MOST_RECENT_PRODUCT_SEARCH_ADDRESS';
    static IS_OTHER_LOCATION_SHOP = 'IS_OTHER_LOCATION_SHOP';

    static storeShopsIds(ids) {
        localStorage.setItem(this.SHOPS_IDS, ids);
    }

    static removeShopsIds() {
        localStorage.removeItem(this.SHOPS_IDS);
    }

    static getShopsIds() {
        return localStorage.getItem(this.SHOPS_IDS);
    }

    static canAddToCart(ids) {
        return localStorage.getItem(this.SHOPS_IDS) === null || localStorage.getItem(this.SHOPS_IDS) === ids;
    }

    static setNumberOfItems(number) {
        localStorage.setItem(this.NUMBER_OF_ITEMS, number);
    }

    static getNumberOfItems() {
        return localStorage.getItem(this.NUMBER_OF_ITEMS);
    }

    static setMostRecentShop(payload) {
        localStorage.setItem(this.MOST_RECENT_SHOP, JSON.stringify(payload));
    }

    static getMostRecentShop() {
        return JSON.parse(localStorage.getItem(this.MOST_RECENT_SHOP));
    }

    static removeMostRecentShop() {
        localStorage.removeItem(this.MOST_RECENT_SHOP);
    }

    static setMostRecentDeliveryAddress(address, coordinates) {
        localStorage.setItem(this.MOST_RECENT_DELIVERY_ADDRESS, JSON.stringify({...address, ...coordinates}));
    };

    static setMostRecentProductSearchAddress(address, coordinates) {
        localStorage.setItem(this.MOST_RECENT_PRODUCT_SEARCH_ADDRESS, JSON.stringify({...address, ...coordinates}));
    };

    static getMostRecentDeliveryAddress() {
        return JSON.parse(localStorage.getItem(this.MOST_RECENT_DELIVERY_ADDRESS));
    }

    static getMostRecentProductSearchAddress() {
      return JSON.parse(localStorage.getItem(this.MOST_RECENT_PRODUCT_SEARCH_ADDRESS));
    };

    static removeMostRecentAddresses() {
        localStorage.removeItem(this.MOST_RECENT_DELIVERY_ADDRESS);
        localStorage.removeItem(this.MOST_RECENT_PRODUCT_SEARCH_ADDRESS);
    }

    static setIsOtherLocationShop(isOtherLocationShop) {
      localStorage.setItem(this.IS_OTHER_LOCATION_SHOP, isOtherLocationShop);
    };

    static getIsOtherLocationShop() {
        return localStorage.getItem(this.IS_OTHER_LOCATION_SHOP);
    }
}

export default CartUtils;
