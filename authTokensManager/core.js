require('dotenv').config({path: __dirname + "./../.env"})

let logger = require('../utilities/logger')
const axios = require('axios')
const url = require('url')

class AuthTokensManager {
    static accessToken;
    static refreshToken;
    static username     = process.env.IDM_USERNAME;
    static password     = process.env.IDM_PASSWORD;
    
    static buildAuthorizationHeaderValue() {

      return "Bearer " + AuthTokensManager.accessToken;
    }
        
    static #buildOptionsObject() {
        return {
          'headers': {
            'Authorization': 'Basic ' + Buffer.from(process.env.IDM_CLIENT_ID + ':' + process.env.IDM_SECRET, 'utf-8').toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        };
      }

      static async init() {
        logger.debug('Initializing OAuth flow');
    
        try {
          let options = AuthTokensManager.#buildOptionsObject();
          
          const params = new url.URLSearchParams({
            grant_type: 'password',
            username: AuthTokensManager.username,
            password: AuthTokensManager.password
          });

          let response = await axios.post(process.env.IDM_PROTOCOL + '://' + process.env.IDM_HOST + ':' + process.env.IDM_PORT + '/oauth2/token', params.toString(), options);
          let responsePayload = response.data;
    
          if(responsePayload["access_token"]) {
            AuthTokensManager.accessToken = responsePayload["access_token"];
          } else {
            throw new Error('No valid access token received from the IDM');
          }
    
          if(responsePayload["refresh_token"]) {
            AuthTokensManager.refreshToken = responsePayload["refresh_token"];
          } else {
            throw new Error('No valid refresh token received from the IDM');
          }
    
          return {
            accessToken: AuthTokensManager.accessToken,
            refreshToken: AuthTokensManager.refreshToken
          };
        } catch(err) {
          logger.error('An error occurred while requesting an access token to the IDM');
          logger.error(err);
          throw err;
        }
      }
    
      static async refreshAccessToken() {
        logger.debug('Refreshing access token');
    
        try {
          let options = AuthTokensManager.#buildOptionsObject();
          
          const params = new url.URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: AuthTokensManager.refreshToken,
            username: AuthTokensManager.username,
            password: AuthTokensManager.password
          });
          
          let response = await axios.post(process.env.IDM_PROTOCOL + '://' + process.env.IDM_HOST + ':' + process.env.IDM_PORT + '/oauth2/token', params.toString(), options);
          let responsePayload = response.data;
    
          if(responsePayload["access_token"]) {
            AuthTokensManager.accessToken = responsePayload["access_token"];
          } else {
            throw new Error('No valid access token received from the IDM');
          }
    
          if(responsePayload["refresh_token"]) {
            AuthTokensManager.refreshToken = responsePayload["refresh_token"];
          } else {
            logger.warning('No new refresh token receveid from the IDM. Keep using the current one')
          }
    
          return {
            accessToken: AuthTokensManager.accessToken,
            refreshToken: AuthTokensManager.refreshToken
          };
        } catch(err) {    
          let refreshTokenInvalid = err.response.data && err.response.data.includes('refresh token has expired'); 
    
          if(refreshTokenInvalid) {
            logger.debug('Invalid refresh token. Re-starting OAuth flow from the beginning');
            await AuthTokensManager.init(); // re-start oauth flow from the beginning
            
            return {
              accessToken: AuthTokensManager.accessToken,
              refreshToken: AuthTokensManager.refreshToken
            };
          } else {
            logger.error('An error occurred while refreshing access token');
            logger.error(err);
          }
    
          logger.error('An error occurred while requesting an access token to the IDM');
          logger.error(err);
          throw err;
        }
      }
    
    };
    
    module.exports = { AuthTokensManager };