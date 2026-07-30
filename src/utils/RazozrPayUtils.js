export const getNetBankingData = (amount, bank, orderId, userProfile) => {
    const {email, number} = getUserData(userProfile);
    return {
        amount: amount, // in currency subunits. Here 1000 = 1000 paise, which equals to ₹10
        currency: "INR", // Default is INR. We support more than 90 currencies.
        email: email,
        contact: number,
        order_id: orderId, // Replace with Order ID generated in Step 4
        method: 'netbanking',
        bank: bank
    };
};

export const getSavedUpiData = (amount, orderId, vpaToken, userProfile, razorpayCustomerId) => {
    const {email, number} = getUserData(userProfile);
    return {
        amount: amount,
        email: email,
        contact: number,
        order_id: orderId,
        method: 'upi',
        customer_id: razorpayCustomerId,
        token: vpaToken
    }
};

export const getUpiData = (amount, orderId, vpa, userProfile, saveUPI, razorpayCustomerId) => {
    const {email, number} = getUserData(userProfile);
    return {
        amount: amount,
        email: email,
        contact: number,
        order_id: orderId,
        method: 'upi',
        customer_id: razorpayCustomerId,
        save: saveUPI ? 1 : 0,
        vpa: vpa
    }
};

export const getSavedCardData = (amount, orderId, customerId, token, cvv, userProfile) => {
    const {email, number} = getUserData(userProfile);
    return {
        amount: amount,
        currency: "INR",
        email: email,
        order_id: orderId,
        contact: number,
        description: 'Payment with preferred card',
        customer_id: customerId,
        token: token,
        method: "card",
        card: {
            cvv: cvv
        }
    }
};

export const getNewCardData = (amount, customerId, orderId, cardNumber, cvv, expirationMonth, expirationYear, saveCard, userProfile) => {
    const {email, number} = getUserData(userProfile);
    return {
        amount: amount, // in currency subunits. Here 1000 = 1000 paise, which equals to ₹10
        currency: "INR",// Default is INR. We support more than 90 currencies.
        email: email,
        contact: number,
        customer_id: customerId,
        order_id: orderId,// Replace with Order ID generated in Step 4
        method: 'card',

        card: {
            number: cardNumber,
            cvv: cvv,
            expiry_month: expirationMonth,
            expiry_year: expirationYear
        },
        save: saveCard ? 1 : 0,
    }
};

const getUserData = (userProfile) => {
    return {
        email: userProfile.email.id,
        number: userProfile.mobile.number,
    }
};


export const payWithBayFayCashBody = (categoryId, isShopDelivery, promoId, deliveryLocationCoordinates, deliveryLocationAddress, customTime, transactionId, note, image) => {
    const body = {
        "_id": categoryId,
        "is_bayfaycash": true,
        "is_shop_delivery": isShopDelivery,
        "deliveryLocation": {
            "type": "Point",
            "coordinates": [deliveryLocationCoordinates.lng, deliveryLocationCoordinates.lat]
        },
        "payment": {
            "txnid": transactionId,
        }
    };

    if (note?.length > 0) {
        body['notes'] = note;
    }

    if (image) {
        body['image'] = image;
    }

    const deliveryAddress = {
        "area": deliveryLocationAddress.area
    };
    if (deliveryLocationAddress.address?.toString().length > 0) {
        deliveryAddress['street'] = deliveryLocationAddress.address;
    }
    if (deliveryLocationAddress.zipcode?.toString().length > 0) {
        deliveryAddress['zipcode'] = deliveryLocationAddress.zipcode;
    }
    if (deliveryLocationAddress.landmark?.toString().length > 0) {
        deliveryAddress['landmark'] = deliveryLocationAddress.landmark;
    }

    body["deliveryAddress"] = deliveryAddress;

    if (customTime) {
        body['deliveryPreferences'] = {
            "isAnytime": false,
            "customTime": {
                "from": customTime.from,
                "to": customTime.to,
                "offset": "19800000"
            }
        }
    } else {
        body['deliveryPreferences'] = {
            "isAnytime": true
        }
    }

    if (promoId) {
        body["promo_id"] = promoId;
    }

    return body;
};

export const getShopData = (categoryId, bayFayCash, promoId, payment, customTime, deliveryLocationCoordinates, deliveryLocationAddress, note, image) => {
    const body = {
        "_id": categoryId,
        "deliveryLocation": {
            "type": "Point",
            "coordinates": [deliveryLocationCoordinates.lng, deliveryLocationCoordinates.lat]
        },
        "payment": payment
    };

    if (note?.length > 0) {
        body['notes'] = note;
    }

    if (image) {
        body['image'] = image;
    }

    if (promoId) {
        body["promo_id"] = promoId;
    }

    if (bayFayCash) {
        body['is_bayfaycash'] = bayFayCash;
    }

    const deliveryAddress = {
        "area": deliveryLocationAddress.area
    };
    if (deliveryLocationAddress.address?.toString().length > 0) {
        deliveryAddress['street'] = deliveryLocationAddress.address;
    }
    if (deliveryLocationAddress.zipcode?.toString().length > 0) {
        deliveryAddress['zipcode'] = deliveryLocationAddress.zipcode;
    }
    if (deliveryLocationAddress.landmark?.toString().length > 0) {
        deliveryAddress['landmark'] = deliveryLocationAddress.landmark;
    }

    body["deliveryAddress"] = deliveryAddress;

    if (customTime) {
        body['deliveryPreferences'] = {
            "isAnytime": false,
            "customTime": {
                "from": customTime.from,
                "to": customTime.to,
                "offset": "19800000"
            }
        }
    } else {
        body['deliveryPreferences'] = {
            "isAnytime": true
        }
    }

    return body;
};

export const getTakeAwayData = (categoryId, bayFayCash, promoId, payment, customTime, note, image) => {
    const body = {
        "_id": categoryId,
        "payment": payment
    };

    if (note?.length > 0) {
        body['notes'] = note;
    }

    if (image) {
        body['image'] = image;
    }

    if (promoId) {
        body["promo_id"] = promoId;
    }

    if (bayFayCash) {
        body['is_bayfaycash'] = bayFayCash;
    }

    if (customTime) {
        body['deliveryPreferences'] = {
            "isAnytime": false,
            "customTime": {
                "from": customTime.from,
                "to": customTime.to,
                "offset": "19800000"
            }
        }
    } else {
        body['deliveryPreferences'] = {
            "isAnytime": true
        }
    }

    return body;
};


export const get_COD_delivery_body = (categoryId, deliveryLocationCoordinates, deliveryLocationAddress, customTime, note, image) => {
    const body = {
        "_id": categoryId,
        "deliveryLocation": {
            "type": "Point",
            "coordinates": [deliveryLocationCoordinates.lng, deliveryLocationCoordinates.lat]
        },
    };

    if (note?.length > 0) {
        body['notes'] = note;
    }

    if (image) {
        body['image'] = image;
    }

    if (customTime) {
        body['deliveryPreferences'] = {
            "isAnytime": false,
            "customTime": {
                "from": customTime.from,
                "to": customTime.to,
                "offset": "19800000"
            }
        }
    } else {
        body['deliveryPreferences'] = {
            "isAnytime": true
        }
    }

    const deliveryAddress = {
        "area": deliveryLocationAddress.area
    };
    if (deliveryLocationAddress.address?.toString().length > 0) {
        deliveryAddress['street'] = deliveryLocationAddress.address;
    }
    if (deliveryLocationAddress.zipcode?.toString().length > 0) {
        deliveryAddress['zipcode'] = deliveryLocationAddress.zipcode;
    }
    if (deliveryLocationAddress.landmark?.toString().length > 0) {
        deliveryAddress['landmark'] = deliveryLocationAddress.landmark;
    }

    body["deliveryAddress"] = deliveryAddress;

    return body;
};


export const get_COD_takeaway_body = (categoryId, promoId, customTime, note, image) => {
    const body = {
        "_id": categoryId,
    };

    if (promoId) {
        body["promo_id"] = promoId;
    }

    if (note?.length > 0) {
        body['notes'] = note;
    }

    if (image) {
        body['image'] = image;
    }

    if (customTime) {
        body['deliveryPreferences'] = {
            "isAnytime": false,
            "customTime": {
                "from": customTime.from,
                "to": customTime.to,
                "offset": "19800000"
            }
        }
    } else {
        body['deliveryPreferences'] = {
            "isAnytime": true
        }
    }

    return body;
};
