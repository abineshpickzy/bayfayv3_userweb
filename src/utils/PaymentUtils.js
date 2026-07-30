import moment from "moment";

export class PaymentUtils {
    static getCardType = (number) => {
        if (number?.toString()?.length > 0 && number?.toString()[0] === '4') {
            return VISA;
        } else if (number?.toString().length > 1 && ['51', '52', '53', '54', '55'].includes(number.toString().substr(0, 2))) {
            return MASTERCARD;
        } else if ((number?.toString().length > 1 && ['50', '56', '57', '58', '59', '60',
                '61', '62', '63', '64', '65', '66', '67', '68', '69'].includes(number.toString().substr(0, 2))) ||
            (number?.toString().length > 3 && number.toString().substr(0, 4) === '6759') ||
            (number?.toString().length > 5 && ['676770', '676774'].includes(number.toString().substr(0, 6)))) {
            return MAESTRO;
        } else {
            return UNKNOWN_CARD_TYPE;
        }
    }
}

export const validateCardExpirationDate = (expirationDate) => {
    const dateNow = moment(new Date()).format('MM-YY');
    const timeParts = expirationDate.split('\/');
    if (timeParts?.length !== 2) {
        return false;
    }
    const monthNow = dateNow.split('-')[0];
    const yearNow = dateNow.split('-')[1];
    if (timeParts[1] > yearNow) {
        return true;
    }
    else if (timeParts[1] < yearNow) {
        return false;
    }
    else {
        if (timeParts[0] < monthNow) return false;
    }
    return true;
};

export const MASTERCARD = 'MASTER-CARD';
export const VISA = 'VISA';
export const UNKNOWN_CARD_TYPE = 'UNKNOWN_CARD_TYPE';
export const MAESTRO = 'MAESTRO';
