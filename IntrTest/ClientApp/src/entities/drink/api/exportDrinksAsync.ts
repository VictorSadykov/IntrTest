import $api from "shared/api/axiosInstance"
import { DRINK_EXPORT_ROUTE } from "shared/routes/apiRoutes/drinkRoutes"
import { API_DRINKS } from "shared/routes/apiRoutes/routes"

export const exportDrinksAsync = async() => {
  const r = await $api.get(`${API_DRINKS}${DRINK_EXPORT_ROUTE}`, {responseType: "blob"}).then((response) => {
    const blob = new Blob([response.data], { type: "application/zip" });
    const url = URL.createObjectURL(blob);

    // create "a" HTML element with href to file & click
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'drinks.zip');
    document.body.appendChild(link);
    link.click();

    // clean up "a" element & remove ObjectURL
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  })
  return r;
}