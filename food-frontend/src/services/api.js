import axios from "axios";
import TokenService from "./token.service";

const api = axios.create({
  baseURL: "https://food-delivery-be-2bjs.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm token vào header trước khi gửi request
api.interceptors.request.use(
  (config) => {
    const token = TokenService.getLocalAccessToken();
    if (token) {
      config.headers["x-access-token"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
