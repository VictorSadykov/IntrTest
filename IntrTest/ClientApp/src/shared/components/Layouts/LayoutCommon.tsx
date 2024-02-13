import { Context } from "index"
import React from "react"
import { useContext } from "react"

export const LayoutCommon = () => {
  const {store} = useContext(Context)

  return (
    <div>HEADER</div>
  )  
}