import { Context } from "index"
import React from "react"
import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { BASE_URL } from "shared/routes/apiRoutes/routes"

export const RouteAnonymous = ({ jsx }) => {
  const { store } = useContext(Context)
  console.log(2)

  if (store.isAuth) {
    return <Navigate replace to={BASE_URL} />
  } else {
    return jsx
  }
}