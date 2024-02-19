import $api from "shared/api/axiosInstance";
import { UserDrink } from "../models/UserDrink";
import { API_USER_DRINKS } from "shared/routes/apiRoutes/routes";
import { USERDRINKS_BUY_ROUTE } from "shared/routes/apiRoutes/userDrinksRoutes";
import { BoughtDrinksInfo } from "../models/BoughtUserInfo";

export const buyDrinksAsync = async(userId: string, userDrinks: UserDrink[]) : Promise<BoughtDrinksInfo> => {
  const r = await $api.put<BoughtDrinksInfo>(`${API_USER_DRINKS}${USERDRINKS_BUY_ROUTE}${userId}`, userDrinks)
  return r.data
}