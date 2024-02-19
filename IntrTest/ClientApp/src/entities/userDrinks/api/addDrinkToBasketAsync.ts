import { Drink } from "entities/drink";
import $api from "shared/api/axiosInstance";
import { API_USER_DRINKS } from "shared/routes/apiRoutes/routes";
import { USERDRINKS_ADD_ROUTE } from "shared/routes/apiRoutes/userDrinksRoutes";

export const addDrinkToBasketAsync = async(userId: string, drinkId: number) => {
  const resp = await $api.post(`${API_USER_DRINKS}${USERDRINKS_ADD_ROUTE}${userId}/${drinkId}`)
  return resp
}