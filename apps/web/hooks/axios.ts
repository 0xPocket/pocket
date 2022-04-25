import axios from 'axios';

export const axiosCustom = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export const useAxios = () => {
  return axiosCustom;
};
