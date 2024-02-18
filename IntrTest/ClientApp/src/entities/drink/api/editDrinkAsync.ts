import $api from "shared/api/axiosInstance"
import { DRINK_EDIT_ROUTE } from "shared/routes/apiRoutes/drinkRoutes"
import { API_DRINKS } from "shared/routes/apiRoutes/routes"

export const editDrinkAsync = async(id: number, drinkData: FormData) => {
  const resp = await $api.put(`${API_DRINKS}${DRINK_EDIT_ROUTE}${id}`, drinkData)
  return resp
}