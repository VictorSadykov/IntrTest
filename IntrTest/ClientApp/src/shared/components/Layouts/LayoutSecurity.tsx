import { Context } from "index";
import React, { useContext } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { NAV_LOGIN } from "shared/routes/pageRoutes";

export const LayoutSecurity = () => {
  const { store } = useContext(Context);
  const navigate = useNavigate()

  const handleLogout = async() => {
    await store.logout()
    navigate(NAV_LOGIN)
  }
  
  return (
    <div>
      <div className="flex flex-row m-3 justify-content-between align-items-center">
        <div className="flex flex-row align-items-center layout_namebox">
          <div className="mr-3">
            <img className="layout_logo" src="/logo/vending-machine.png" alt="logo" />
          </div>
          <div style={{ fontSize: '40px' }}>
            Vending Test
          </div>
        </div>
        <div onClick={handleLogout} className="layout_exit">
          Выход
        </div>
      </div>
      <Outlet />
    </div>
  )
}