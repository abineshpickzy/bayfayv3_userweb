export class LocationUtils {

    // extract street, area and zip code from current location response
    static extractLocation = (response) => {
        let zipcode = '';
        let street = '';
        let streetNum = '';
        let administrative_area_level_1 = '';
        let administrative_area_level_2 = '';
        let country = '';
        const addressComponents = response.results[0].address_components;
        for (let i = 0; i < addressComponents.length; i++) {
            if (addressComponents[i].types.includes('postal_code')) {
                zipcode = addressComponents[i].long_name;
            }
            if (addressComponents[i].types.includes('street_number')) {
                streetNum = addressComponents[i].long_name;
            }
            if (addressComponents[i].types.includes('route')) {
                street = addressComponents[i].long_name;
            }
            if (addressComponents[i].types.includes('administrative_area_level_1')) {
                administrative_area_level_1 = addressComponents[i].long_name;
            }
            if (addressComponents[i].types.includes('administrative_area_level_2')) {
                administrative_area_level_2 = addressComponents[i].long_name;
            }
            if (addressComponents[i].types.includes('country')) {
                country = addressComponents[i].long_name;
            }
        }
        return {
            address: street.concat(` ${streetNum}`),
            area: [administrative_area_level_2, administrative_area_level_1, country].join(', '),
            zipcode,
        }
    };

    static saveCustomAddressToLocalStorage = address => {
        localStorage.setItem(USER_ADDRESS, address);
    };

    static saveCustomZipcodeToLocalStorage = zipcode => {
        localStorage.setItem(USER_ZIPCODE, zipcode);
    };

    static saveCustomLandmarkToLocalStorage = landmark => {
        localStorage.setItem(USER_LANDMARK, landmark);
    };

    static saveUserLocationChosenType = type => {
        localStorage.setItem(CHOSEN_LOCATION_TYPE, type);
    };

    static getUserLocationChosenType = () => {
        return localStorage.getItem(CHOSEN_LOCATION_TYPE);
    };

    static getSavedAddress = () => {
        const savedUserAddress = localStorage.getItem(USER_ADDRESS);
        const savedUserZipcode = localStorage.getItem(USER_ZIPCODE);
        const savedUserLandmark = localStorage.getItem(USER_LANDMARK);
        return {savedUserAddress, savedUserZipcode, savedUserLandmark};
    };

    static clearUserSavedAddressAndType = () => {
        localStorage.removeItem(USER_ADDRESS);
        localStorage.removeItem(USER_ZIPCODE);
        localStorage.removeItem(USER_LANDMARK);
        localStorage.removeItem(CHOSEN_LOCATION_TYPE);
    };

    static saveMostRecentDeliveryCoordinates = (payload) => {
        localStorage.setItem(MOST_RECENT_DELIVERY_COORDINATES, JSON.stringify(payload));
    };

    static saveMostRecentProductSearchCoordinates = (payload) => {
        localStorage.setItem(MOST_RECENT_PRODUCT_SEARCH_COORDINATES, JSON.stringify(payload));
    };

    static saveMostRecentDistance = distance => {
        localStorage.setItem(MOST_RECENT_DISTANCE, distance);
    };

    static getMostRecentDeliveryCoordinates = () => {
        const coordinates = localStorage.getItem(MOST_RECENT_DELIVERY_COORDINATES);
        if (!coordinates || coordinates === 'undefined') {
            return {lat: 0, lng: 0};
        } else {
            try {
                return JSON.parse(coordinates);
            } catch (e) {
                return {lat: 0, lng: 0}
            }
        }
    };

    static getMostRecentProductSearchCoordinates = () => {
        const coordinates = localStorage.getItem(MOST_RECENT_PRODUCT_SEARCH_COORDINATES);
        if (!coordinates || coordinates === 'undefined') {
            return {lat: 0, lng: 0};
        } else {
            try {
                return JSON.parse(coordinates);
            } catch (e) {
                return {lat: 0, lng: 0}
            }
        }
    };

    static getMostRecentDistance = () => {
        const distance = localStorage.getItem(MOST_RECENT_DISTANCE);
        if (distance) {
            return distance;
        } else {
            return '5';
        }
    };
}

export const USER_ADDRESS = 'USER_ADDRESS';
export const USER_ZIPCODE = 'USER_ZIPCODE';
export const USER_LANDMARK = 'USER_LANDMARK';
export const CURRENT_LOCATION = 'CURRENT_LOCATION';
export const SEARCHED_LOCATION = 'SEARCHED_LOCATION';
export const CHOSEN_LOCATION_TYPE = 'CHOSEN_LOCATION_TYPE';
export const MOST_RECENT_DELIVERY_COORDINATES = 'MOST_RECENT_DELIVERY_COORDINATES';
export const MOST_RECENT_PRODUCT_SEARCH_COORDINATES = 'MOST_RECENT_PRODUCT_SEARCH_COORDINATES';
export const MOST_RECENT_DISTANCE = 'MOST_RECENT_DISTANCE';
