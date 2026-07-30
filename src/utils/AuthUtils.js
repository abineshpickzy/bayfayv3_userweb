import moment from "moment";

class AuthUtils {

    static JWT_REFERENCE = 'jwtReference';
    static REFRESH_TOKEN = 'refresh_token';
    static IS_GUEST = 'isGuest';
    static USERNAME = 'username';
    static IS_USER_NEW = 'is_new';
    static TOKEN_EXP_DATE = 'token_expiration';

    static storeToken(token) {
        localStorage.setItem(this.JWT_REFERENCE, token);
    }

    static storeRefreshToken(token) {
        localStorage.setItem(this.REFRESH_TOKEN, token);
    }

    static getRefreshToken() {
        return localStorage.getItem(this.REFRESH_TOKEN);
    }

    static removeToken() {
        localStorage.removeItem(this.JWT_REFERENCE);
    }

    static getToken() {
        return localStorage.getItem(this.JWT_REFERENCE);
    }

    static setIsGuest(isGuest) {
        localStorage.setItem(this.IS_GUEST, isGuest);
    }

    static getIsGuest() {
        return localStorage.getItem(this.IS_GUEST);
    }

    static storeUsername(username) {
        localStorage.setItem(this.USERNAME, username);
    }

    static getUserName() {
        return localStorage.getItem(this.USERNAME);
    }

    static clearAll() {
        localStorage.removeItem(this.IS_GUEST);
        localStorage.removeItem(this.JWT_REFERENCE);
        localStorage.removeItem(this.USERNAME);
        localStorage.removeItem(this.REFRESH_TOKEN);
    }

    static setIsUserNew(isNew) {
        localStorage.setItem(this.IS_USER_NEW, isNew);
    }

    static getIsUserNew() {
        return localStorage.getItem(this.IS_USER_NEW);
    }

    static saveTokenExpDate(exp) {
        localStorage.setItem(this.TOKEN_EXP_DATE, exp);
    }

    static getTokenExpDate() {
        const exp = localStorage.getItem(this.TOKEN_EXP_DATE);
        if (exp) {
            return AuthUtils.timeConverter(exp);
        } else return moment(new Date()).subtract(1, "days").toDate();
    }

    static timeConverter = (UNIX_timestamp) => {
        let a = new Date(UNIX_timestamp * 1000);
        let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let year = a.getFullYear();
        let month = months[a.getMonth()];
        let date = a.getDate();
        let hour = a.getHours();
        let min = a.getMinutes();
        let sec = a.getSeconds();
        let time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
        return time;
    }
}

export default AuthUtils;
