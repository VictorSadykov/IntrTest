import axios, { InternalAxiosRequestConfig } from "axios"
import { AUTH_REFRESH_TOKEN_ROUTE } from "shared/routes/apiRoutes/authRoutes"
import {API_AUTH, BASE_URL } from "shared/routes/apiRoutes/routes"
import tokenService, { ACCESS_TOKEN_ITEM, REFRESH_TOKEN_ITEM } from "shared/services/token.service"

const $api = axios.create({
  withCredentials: true,
  baseURL: BASE_URL
})

$api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem(ACCESS_TOKEN_ITEM)}`
  return config
})

$api.interceptors.response.use((config) => {
  return config
},
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && error.config && !error.config._isRetry) {
      try {
        originalRequest._isRetry = true;
        const resp = await axios.post(`${BASE_URL}${API_AUTH}${AUTH_REFRESH_TOKEN_ROUTE}`, {
          accessToken: localStorage.getItem(ACCESS_TOKEN_ITEM),
          refreshToken: localStorage.getItem(REFRESH_TOKEN_ITEM)
        }, { withCredentials: true });
        tokenService.setAccessToken(resp.data.accessToken);
        tokenService.setRefreshToken(resp.data.refreshToken);

        return await $api.request(originalRequest);
      }
      catch (ex) {
        console.error(ex)
      }
    }
    throw error;
  });

  export default $api