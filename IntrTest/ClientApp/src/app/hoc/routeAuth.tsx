import { Context } from "index"
import React from "react"
import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { NAV_LOGIN } from "shared/routes/pageRoutes"

export const RouteAuth = ({ jsx }) => {
  const { store } = useContext(Context)

  if (store.isAuth) {
    return <Navigate replace to={NAV_LOGIN} />
  } else {
    return jsx
  }
}

