let logger = require('../utilities/logger')
require('dotenv').config({ path: __dirname + './../.env' })

const axios  = require('axios');

const { AuthTokensManager }  = require('../authTokensManager/core');

class RESTCallsManager {
  static axiosApiInstance;

  static {
    RESTCallsManager.axiosApiInstance = axios.create();

    // Request interceptor for API calls
    RESTCallsManager.axiosApiInstance.interceptors.request.use(
      async config => {
        config.headers = {
          ...config.headers, 
          ... { 
          'Authorization': `Bearer ${AuthTokensManager.accessToken}`,
        }};

        logger.debug('Headers in use by the interceptor')
        logger.debug(JSON.stringify(config.headers, null, 2))

        return config;
      },
      error => {
        Promise.reject(error)
    });

    // Response interceptor for API calls
    RESTCallsManager.axiosApiInstance.interceptors.response.use((response) => {
      return response
    }, async function (error) {
      const originalRequest = error.config;
      if (error.response.status === 401 && 
        (error.response.data.includes('access token has expired') || error.response.data.includes('access token is no longer valid')) && 
        !originalRequest._retry) {       
        logger.debug('Access token expired');
        originalRequest._retry = true;
        const access_token = (await AuthTokensManager.refreshAccessToken()).accessToken;   
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
        
        logger.debug('New Authorization header obtained after refreshing the access token');
        logger.debug(axios.defaults.headers.common['Authorization']);
        
        return RESTCallsManager.axiosApiInstance(originalRequest);
      } else {
        logger.error('Error in RESTCallsManager response interceptor');
        logger.error(error);
      }
      return Promise.reject(error);
    });
  }

  static getOAuthAxiosClient() {
    return RESTCallsManager.axiosApiInstance;
  }
};

module.exports = { RESTCallsManager };