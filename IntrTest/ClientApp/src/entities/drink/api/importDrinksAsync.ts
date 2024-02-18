import $api from "shared/api/axiosInstance"
import { DRINK_IMPORT_ROUTE } from "shared/routes/apiRoutes/drinkRoutes"
import { API_DRINKS } from "shared/routes/apiRoutes/routes"

export const importDrinksAsync = async (formData: FormData) => {
  return await $api.post(`${API_DRINKS}${DRINK_IMPORT_ROUTE}`, formData)
}