import $api from "shared/api/axiosInstance"
import { API_COINS } from "shared/routes/apiRoutes/routes"
import { CoinChangeDTO } from "../models/CoinChangeDTO"
import { COIN_CHANGE_ROUTE } from "shared/routes/apiRoutes/coinRoutes"

export const giveChangeAsync = async(userId: string) : Promise<CoinChangeDTO> => {
  const resp = await $api.put<CoinChangeDTO>(`${API_COINS}${COIN_CHANGE_ROUTE}${userId}`)
  return resp.data
}