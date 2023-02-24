import Axios from "axios";
import { BASE_URL } from "./Config";

const getAuthToken = () => {
  return localStorage.getItem("accessToken");
};

const AxiosClient = Axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

AxiosClient.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `Bearer ${getAuthToken()}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

AxiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.data?.code === "token_not_valid") {
      localStorage.removeItem("accessToken");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default AxiosClient;
