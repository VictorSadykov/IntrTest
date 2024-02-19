import { IUserInfo } from "entities/user";
import { Context } from "index";
import { UserInfo } from "os";
import React, { useContext, useEffect, useState } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { ROLE_ADMIN } from "shared/const/role";
import { NAV_ADMIN, NAV_LOGIN, NAV_SHOP } from "shared/routes/pageRoutes";
import authService from "shared/services/auth.service";

export const LayoutSecurity = () => {
  const { store } = useContext(Context);
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState<IUserInfo>()
  useEffect(() => {
    (async () => {
      const resp = await authService.getUser()
      setUser(resp)
      console.log(resp)
      resp?.role?.includes(ROLE_ADMIN) 
    })()
  }, [])

  const handleLogout = async () => {
    await store.logout()
    navigate(NAV_LOGIN)
  }

  const backToStore = () => {
    let route = location.pathname

    navigate(route === NAV_ADMIN ? NAV_SHOP : NAV_ADMIN)
  }

  return (
    <div>
      <div className="flex flex-row m-3 justify-content-between align-items-center">
        <div className="flex flex-row align-items-center layout_namebox">
          <div className="mr-3">
            <img className="layout_logo" src="/logo/vending-machine.png" alt="logo" />
          </div>
          <div className="mr-8 text-5xl">
            Vending Test
          </div>
        </div>
        <div className={user?.role?.includes(ROLE_ADMIN) ? "flex flex-row m-3 justify-content-between align-items-center" :  "m-3" }>
          {user?.role?.includes(ROLE_ADMIN) &&
            <div className="cursor-pointer layout_exit mr-8" onClick={backToStore}>
              {location.pathname === NAV_ADMIN ? "Вернуться в магазин" : "Войти в панель админа"}
            </div>
          }
          <div onClick={handleLogout} className="cursor-pointer layout_exit">
            Выход
          </div>
        </div>


      </div>
      <Outlet />
    </div>
  )
}