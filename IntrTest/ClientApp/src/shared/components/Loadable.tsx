import { ProgressSpinner } from "primereact/progressspinner"
import React, { JSXElementConstructor, ReactElement } from "react"
import { useState } from "react"

export const Loadable = ({ jsx, sizePx }) => {
  const [isLoading, setIsLoading] = useState<boolean>()

  if (isLoading) {
    return (<div style={{ marginTop: '150px' }} className="flex justify-content-center align-items-center">
      <ProgressSpinner style={{ width: sizePx , height: sizePx }} />
    </div>)
  }

  return <div/>
}