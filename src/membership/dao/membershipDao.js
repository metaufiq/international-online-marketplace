import config from '../../config/config.json';
import axios from 'axios';

export const getMembership = (grade) => {
    let url = "/membership";
    if(grade && typeof grade === 'string'){
        url += `?grade=${grade.toUpperCase()}`;
    }
    
    return axios.get(config.SERVER_ENDPOINT + url)
                .then((res) => {
                    return res.data.data
                }).catch((err) => {
                    console.log("API ERROR");
                });
}