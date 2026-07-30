import moment from "moment";

export class TrackOrderUtils {

    static setBuzzOrder(orderId) {
        localStorage.setItem(`order-${orderId}`, moment(new Date()).format('DD/MM/YYYY HH:mm:ss'));
    }

    static checkIfCanBuzz(orderId) {
        const time = localStorage.getItem(`order-${orderId}`);
        if (!time) return true;
        const lastTimeBuzzed = moment(time, 'DD/MM/YYYY HH:mm:ss');
        const now = moment(new Date());
        const diff = now.diff(lastTimeBuzzed, "seconds");
        return diff > (60 * 60);
    }

    static getLastTimeBuzzed(orderId) {
        return localStorage.getItem(`order-${orderId}`);
    }

    static removeOrderId(orderId) {
        localStorage.removeItem(`order-${orderId}`);
    }
}
