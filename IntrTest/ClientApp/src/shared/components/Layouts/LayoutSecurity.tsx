import { Context } from "index";
import React, { useContext } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { NAV_ADMIN, NAV_LOGIN, NAV_SHOP } from "shared/routes/pageRoutes";

export const LayoutSecurity = () => {
  const { store } = useContext(Context);
  const navigate = useNavigate()
  const location = useLocation()

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
        <div className="flex justify-content-between flex-grow-1 align-items-center text-2xl mt-2 ml-8 ">
          <div className="cursor-pointer" onClick={backToStore}>
            {location.pathname === NAV_ADMIN ? "Вернуться в магазин" : "Войти в панель админа"}
          </div>
          <div onClick={handleLogout} className="cursor-pointer">
            Выход
          </div>
        </div>


      </div>
      <Outlet />
    </div>
  )
}