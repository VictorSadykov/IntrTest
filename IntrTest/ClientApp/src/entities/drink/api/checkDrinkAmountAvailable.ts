import $api from "shared/api/axiosInstance"
import { DRINKS_AVAILABILITY_ROUTE } from "shared/routes/apiRoutes/drinkRoutes"
import { API_DRINKS } from "shared/routes/apiRoutes/routes"

export const checkDrinkAmountAvailable = async(drinkId: number) : Promise<number> => {
  const r = await $api.get<number>(`${API_DRINKS}${DRINKS_AVAILABILITY_ROUTE}${drinkId}`)
  return r.data
}