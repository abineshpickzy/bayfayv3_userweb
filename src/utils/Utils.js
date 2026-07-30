import {browserName, osName, osVersion, browserVersion} from 'react-device-detect';

export class Utils {
    static snakeCaseToUpperCase = a => {
        return a.split('_').map(t => t[0].toUpperCase().concat(t.substring(1, t.length))).join(' ');
    };

    static getDeviceInfoForOrder = () => {
        if (browserName && osName && osVersion && browserVersion) {
            return {
                type: 3,
                device: `desktop, ${browserName}`,
                version: `${osName} ${osVersion}, ${browserVersion}`
            }
        } else {
            return null;
        }
    };
}
