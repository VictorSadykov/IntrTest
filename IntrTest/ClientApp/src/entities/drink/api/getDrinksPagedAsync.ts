import $api from "shared/api/axiosInstance";
import { DrinksPaged } from "../models/DrinksPaged";
import { API_DRINKS } from "shared/routes/apiRoutes/routes";
import { DRINKS_PAGED_ROUTE } from "shared/routes/apiRoutes/drinkRoutes";
import { AxiosResponse } from "axios";

export const getDrinksPagedAsync = async(pageNumber, pageSize) : Promise<DrinksPaged> => {
  const resp = await $api.get<DrinksPaged>(`${API_DRINKS}${DRINKS_PAGED_ROUTE}`, {
    params: {
      pageNumber: pageNumber,
      pageSize: pageSize
    }
  })
  return resp.data
}