import axios from 'axios';
import * as Config from '../constants/Config.js';

const apiCaller = (endpoint, method = 'GET', payload) => {
  return axios(
    {
      method: method,
      url: `${Config.API_URL}/${endpoint}`,
      data: payload,
      headers: {
        Cookie:
          'access_jwt_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwidHlwZSI6MSwiaWF0IjoxNjQ3MzExMDU3LCJleHAiOjE2NDczMTQ2NTd9.vz4G3pr8QMd7QRjl5hMqS2GEwTEBj3UIxSb_mDvl1dk; cookie2=value; cookie3=value;',
      },
    },
    { withCredentials: true },
  ).catch(function (error) {
    // handle error
    return error;
  });
};

export default apiCaller;
