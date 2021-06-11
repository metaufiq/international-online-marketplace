import config from '../../config/config.json';
import axios from 'axios';

const url = config.SERVER_ENDPOINT + '/product/';
export const getProduct = () => {
    return axios.get(url)
                .then((res) => {
                    return res.data.data
                }).catch((err) => {
                    console.log("API ERROR");
                });
}

export const setObsoletedProduct = () => {
    return axios.put(url+'set-obsoleted')
                .then((res) => {
                    return res.data.data
                }).catch((err) => {
                    console.log("API ERROR");
                });
}