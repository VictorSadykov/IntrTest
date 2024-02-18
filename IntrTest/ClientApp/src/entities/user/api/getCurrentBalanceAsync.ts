import $api from "shared/api/axiosInstance"
import { API_USER } from "shared/routes/apiRoutes/routes"
import { USER_CURRENT_BALANCE_ROUTE } from "shared/routes/apiRoutes/userRoutes"

export const getCurrentBalanceAsync = async(userId: string) : Promise<number>=> {
  const r = await $api.get<number>(`${API_USER}${USER_CURRENT_BALANCE_ROUTE}${userId}`)
  return r.data
}