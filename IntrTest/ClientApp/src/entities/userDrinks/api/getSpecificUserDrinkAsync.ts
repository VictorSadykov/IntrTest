import { API_DRINKS, API_USER_DRINKS } from "shared/routes/apiRoutes/routes";
import { UserDrink } from "../models/UserDrink";
import $api from "shared/api/axiosInstance";
import { USERDRINKS_GET_ROUTE } from "shared/routes/apiRoutes/userDrinksRoutes";

export const getSpecificUserDrinkAsync = async(userId: string, drinkId: number) : Promise<UserDrink> => {
  const r = await $api.get(`${API_USER_DRINKS}${USERDRINKS_GET_ROUTE}${userId}/${drinkId}`)
  return r.data
}