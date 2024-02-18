import $api from "shared/api/axiosInstance";
import { AddDrinkDTO } from "../models/AddDrinkDTO";
import { API_DRINKS } from "shared/routes/apiRoutes/routes";
import { DRINK_ADD_ROUTE } from "shared/routes/apiRoutes/drinkRoutes";

export const addDrinkAsync = async(drink: FormData) => {
  const resp = await $api.post(`${API_DRINKS}${DRINK_ADD_ROUTE}`, drink)
  return resp
}