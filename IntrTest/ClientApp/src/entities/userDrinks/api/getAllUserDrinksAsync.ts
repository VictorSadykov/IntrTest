import $api from "shared/api/axiosInstance"
import { API_USER_DRINKS } from "shared/routes/apiRoutes/routes"
import { USERDRINKS_GET_ALL_ROUTE } from "shared/routes/apiRoutes/userDrinksRoutes"
import { UserDrink } from "../models/UserDrink"

export const getAllUserDrinksAsync = async(userId: string) : Promise<UserDrink[]> => {
  const resp = await $api.get<UserDrink[]>(`${API_USER_DRINKS}${USERDRINKS_GET_ALL_ROUTE}${userId}`)
  return resp.data
}