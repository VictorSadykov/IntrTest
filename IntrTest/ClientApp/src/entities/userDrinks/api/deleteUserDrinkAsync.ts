import $api from "shared/api/axiosInstance"
import { API_USER_DRINKS } from "shared/routes/apiRoutes/routes"
import { USERDRINKS_DELETE_ROUTE } from "shared/routes/apiRoutes/userDrinksRoutes"

export const deleteUserDrinkAsync = async(userId: string, drinkId: number) => {
  const resp = await $api.delete(`${API_USER_DRINKS}${USERDRINKS_DELETE_ROUTE}${userId}/${drinkId}`)
  return resp
}