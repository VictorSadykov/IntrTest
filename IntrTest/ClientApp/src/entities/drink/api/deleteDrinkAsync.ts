import $api from "shared/api/axiosInstance"
import { DRINK_DELETE_ROUTE } from "shared/routes/apiRoutes/drinkRoutes"
import { API_DRINKS } from "shared/routes/apiRoutes/routes"

export const deleteDrinkAsync = async(id: number) => {
  console.log(id)
  const resp = await $api.delete(`${API_DRINKS}${DRINK_DELETE_ROUTE}${id}`)
  return resp
}