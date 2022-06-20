import axios from 'axios';

const Axios = axios.create({
  withCredentials: true,
});

Axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (config.headers && token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

Axios.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    if (err.response) {
      // Access Token was expired

      if (err.response.status === 401) {
        // localStorage.removeItem('access_token');
      }
    }

    return Promise.reject(err);
  },
);

export const useAxios = () => {
  return Axios;
};
