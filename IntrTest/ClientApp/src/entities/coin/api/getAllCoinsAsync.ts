import $api from "shared/api/axiosInstance";
import { Coin } from "../models/Coin";
import { API_COINS } from "shared/routes/apiRoutes/routes";
import { COIN_GET_ALL_ROUTE } from "shared/routes/apiRoutes/coinRoutes";

export const getAllCoinsAsync = async (): Promise<Coin[]> => {
  const resp = await $api.get<Coin[]>(`${API_COINS}${COIN_GET_ALL_ROUTE}`)
  return resp.data
}