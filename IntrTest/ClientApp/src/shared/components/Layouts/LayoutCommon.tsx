import { Context } from "index"
import React from "react"
import { useContext } from "react"
import { Outlet } from "react-router-dom"
import "../css/index.css"

export const LayoutCommon = () => {
  const { store } = useContext(Context)

  return (
    <div>
      <div className="flex flex-row m-3">
        <div className="flex flex-row align-items-center layout_namebox">
          <div className="mr-3">
            <img className="layout_logo" src="/logo/vending-machine.png" alt="logo" />
          </div>
          <div style={{fontSize: '40px'}}>
            Vending Test
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  )
}