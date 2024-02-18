import { CoinDialog } from "features/index"
import { Context } from "index"
import { Button } from "primereact/button"
import { Card } from "primereact/card"
import { Dialog } from "primereact/dialog"
import { Toast } from "primereact/toast"
import React, { useContext, useEffect, useRef, useState } from "react"
import authService from "shared/services/auth.service"
import { DrinkShopList } from "widgets/index"

export const ShopPage = () => {
  const toast = useRef()
  const [coinDialogVisible, setCoinDialogVisible] = useState<boolean>()
  const [basketDialogVisible, setBasketDialogVisible] = useState<boolean>()
  const [userId, setUserId] = useState<string>()

  useEffect(() => {
    (async () => {
      const r = await authService.getUser()
      setUserId(r.userId)
    })()
  }, [])

  return (
    <>
      <Toast ref={toast} position="bottom-right" />
      <CoinDialog visible={coinDialogVisible} setVisible={setCoinDialogVisible} toastRef={toast} userId={userId}/>
      <div className="flex align-items-center justify-content-center fadein">
        <div className="flex flex-column" style={{ maxWidth: '80%', minWidth: '80%', marginTop: '150px' }}>
          <div className="w-12 mb-2 flex align-items-center">
            <Button label="Внести монеты" icon="pi pi-plus" onClick={() => setCoinDialogVisible(true)} />
            <div className="ml-2">Ваш баланс: </div>
            <div className="flex-grow-1 flex justify-content-end">
              <Button severity="success" label="Корзина" />
            </div>
          </div>
          <Card className="shadow-4" style={{ minWidth: '100%', minHeight: '1400px' }}>
            <DrinkShopList />
          </Card>
        </div>
      </div>
    </>
  )
}