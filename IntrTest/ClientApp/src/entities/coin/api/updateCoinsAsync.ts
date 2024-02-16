import $api from "shared/api/axiosInstance";
import { Coin } from "../models/Coin";
import { API_COINS } from "shared/routes/apiRoutes/routes";
import { COIN_UPDATE_MANY_ROUTE } from "shared/routes/apiRoutes/coinRoutes";

export const updateCoinsAsync = async(coins: Coin[]) => {
  const resp = await $api.put(`${API_COINS}${COIN_UPDATE_MANY_ROUTE}`, coins);
  return resp.data;
}