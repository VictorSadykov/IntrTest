import { Drink } from "entities/drink";
import $api from "shared/api/axiosInstance";
import { API_USER_DRINKS } from "shared/routes/apiRoutes/routes";
import {  USERDRINKS_CHANGE_ROUTE } from "shared/routes/apiRoutes/userDrinksRoutes";

export const changeUserDrinkAmountAsync = async(userId: string, drinkId: number, newAmount: number) => {
  const resp = await $api.patch(`${API_USER_DRINKS}${USERDRINKS_CHANGE_ROUTE}${userId}/${drinkId}`, newAmount)
  return resp
}