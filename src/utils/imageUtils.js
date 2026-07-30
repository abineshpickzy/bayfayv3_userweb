import axios from '../custom-axios';

export const fetchImage = (url) => {
    return axios
        .get(
            url,
            {responseType: 'arraybuffer'},
        )
        .then(response => {
            return response;
        });
};
