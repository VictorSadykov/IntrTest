import $api from "shared/api/axiosInstance";
import { InsertCoinsDTO } from "../models/InsertCoinsDTO";
import { API_COINS } from "shared/routes/apiRoutes/routes";
import { COIN_INSERT_ROUTE } from "shared/routes/apiRoutes/coinRoutes";

export const insertCoinsAsync = async(userId: number, coins: InsertCoinsDTO)  => {
  const resp = await $api.put(`${API_COINS}${COIN_INSERT_ROUTE}${userId}`, coins)
  return resp
}