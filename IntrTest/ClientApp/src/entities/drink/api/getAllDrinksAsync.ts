import $api from "shared/api/axiosInstance"
import { Drink } from "../models/Drink"
import { API_DRINKS } from "shared/routes/apiRoutes/routes"
import { DRINK_GET_ALL_ROUTE } from "shared/routes/apiRoutes/drinkRoutes"

export const getAllDrinksAsync = async() : Promise<Drink[]> => {
  const resp = await $api.get<Drink[]>(`${API_DRINKS}${DRINK_GET_ALL_ROUTE}`)
  return resp.data
} 