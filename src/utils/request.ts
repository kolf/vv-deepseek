import axios from "axios";
import { API_URL } from "../config";
import { getDeviceInfo } from "./device";
import { getUser } from "./user";

const device = getDeviceInfo();
// axios中间件
const request = axios.create({
  baseURL: API_URL,
  timeout: 1000 * 30,
});
// 添加请求拦截器
request.interceptors.request.use(
  async (config) => {
    const token = (await getUser())?.token;    
    config.headers["X-Device-No"] = device.deviceNo;
    config.headers["X-Device-Name"] = device.deviceName;
    config.headers["X-Device-Model"] = device.deviceModel;
    config.headers["X-Device-Version"] = device.deviceVersion;
    config.headers["Authorization"] = token;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// 添加响应拦截器
request.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default request;
