import axios from 'axios';
import * as Config from '../constants/Config.js';

const apiCaller = (endpoint, method = 'GET', payload) => {
  return axios({
    method: method,
    url: `${Config.API_URL}/${endpoint}`,
    data: payload,
    // headers: {
    //   Cookie:
    //     'refresh_jwt_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluMSIsImlhdCI6MTY0Njg5OTU4MSwiZXhwIjoxNjc4NDU3MTgxfQ.mM8kO3y2n-Icyy6N6uFBrkg0nphIEIOWu-xnD3PFNkE; cookie2=value; cookie3=value;',
    // },
    withCredentials: true,
  }).catch(function (error) {
    // handle error
    return error;
  });
};

export default apiCaller;
