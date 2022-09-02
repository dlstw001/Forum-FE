import { ROUTES } from 'definitions';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import services from './index';
var fetchRetry = require('fetch-retry')(fetch);

const APP_NAME = process.env.REACT_APP_APP_NAME;

const headers = (token) => {
  return {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };
};

const responseParser = (res) => res.data;
const errorParser = (res) => {
  return res;
};

export default class Http {
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_API_SERVER,
      // baseURL: 'http://localhost:8080/api',
    });
    axiosRetry(this.axiosInstance, {
      retries: 3,
    });
    this.setupInterceptors();
  }

  checkInternet = async () => {
    return new Promise((resolve, reject) => {
      fetchRetry('https://www.google.com', {
        mode: 'no-cors',
        retries: 3,
        retryDelay: 2000,
      })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => reject(err));
    });
  };

  setupInterceptors = () => {
    this.axiosInstance.interceptors.response.use(null, async (error) => {
      const config = error.config;
      if (error.message === 'Network Error') {
        const online = await this.checkInternet(); //check google
        if (online.status === 0) {
          //if google works
          if (!error.status && window.location.pathname !== ROUTES.NETWORK_ERROR) {
            const retryAgain = axios.create({
              baseURL: process.env.REACT_APP_API_SERVER,
            });
            axiosRetry(retryAgain, {
              retries: 3,
            });
            retryAgain(config) //check again once more
              .then((res) => {
                return new Promise((resolve) => {
                  resolve(res);
                });
              })
              .catch(() => {
                // if BE failed go to maintenance page
                localStorage.setItem('referrer', window.location.href);
                window.location = ROUTES.NETWORK_ERROR;
              });
          }
        } else {
          return new Promise((resolve) => {
            resolve(this.axiosInstance(config));
          });
        }
      }

      if (error.response) {
        const {
          response: { status = null },
        } = error || { response: {} };
        const originalRequest = error.config;

        switch (status) {
          case 500:
            return Promise.reject(error);
          case 404:
            window.location = ROUTES.NOT_FOUND;
            break;
          case 401:
            return services.authServices.refreshToken().then((res) => {
              const { data } = res;
              const { access_token, refresh_token, statusCode } = data;

              if (statusCode === 200) {
                this.updateData({ access_token, refresh_token });

                originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
                return axios.request(originalRequest);
              } else {
                localStorage.removeItem(APP_NAME);
                window.location = '/';
                return Promise.reject(error);
              }
            });

          case 403:
            if (localStorage.getItem(APP_NAME)) {
              localStorage.removeItem(APP_NAME);
              window.alert('You account is suspended. You will be redirected back to homepage.');
            }
            window.location = '/';
            return Promise.reject(error);
          default:
            break;
        }
      }
      return Promise.reject(error);
    });
  };

  getToken = () => {
    if (localStorage.getItem(`${APP_NAME}`)) {
      const { access_token } = JSON.parse(localStorage.getItem(`${APP_NAME}`));
      return access_token;
    }
  };

  getRefreshToken = () => {
    if (localStorage.getItem(`${APP_NAME}`)) {
      const { refresh_token } = JSON.parse(localStorage.getItem(`${APP_NAME}`));

      return refresh_token;
    }
  };

  setData = (data) => {
    localStorage.setItem(`${APP_NAME}`, JSON.stringify(data));
  };

  updateData = (data) => {
    if (localStorage.getItem(`${APP_NAME}`)) {
      const currentData = JSON.parse(localStorage.getItem(`${APP_NAME}`));
      const updatedData = { ...currentData, ...data };

      this.setData(updatedData);
    }
  };

  removeData = () => {
    localStorage.removeItem(`${APP_NAME}`);
  };

  get = (url, payload = {}) => {
    const config = Object.assign({ params: payload }, headers(this.getToken()));
    return new Promise((resolve, reject) => {
      this.axiosInstance
        .get(url, config)
        .then((res) => resolve(responseParser(res)))
        .catch((err) => reject(errorParser(err)));
    });
  };
  post = (url, payload, options) => {
    const config = Object.assign(headers(this.getToken()), options);
    return new Promise((resolve, reject) => {
      this.axiosInstance
        .post(url, payload, config)
        .then((res) => resolve(responseParser(res)))
        .catch((err) => reject(errorParser(err)));
    });
  };
  put = (url, payload, options) => {
    const config = Object.assign(headers(this.getToken()), options);
    return new Promise((resolve, reject) => {
      this.axiosInstance
        .put(url, payload, config)
        .then((res) => resolve(responseParser(res)))
        .catch((err) => reject(errorParser(err)));
    });
  };
  patch = (url, payload) => {
    const config = Object.assign(headers(this.getToken()), {});
    return new Promise((resolve, reject) => {
      this.axiosInstance
        .patch(url, payload, config)
        .then((res) => resolve(responseParser(res)))
        .catch((err) => reject(errorParser(err)));
    });
  };
  delete = (url, payload) => {
    const config = Object.assign(headers(this.getToken()), {});
    return new Promise((resolve, reject) => {
      this.axiosInstance
        .delete(url, { data: payload, ...config })
        .then((res) => resolve(responseParser(res)))
        .catch((err) => reject(errorParser(err)));
    });
  };
}
