import { getCurrentBalanceAsync } from "entities/user"
import { ChangeDialog } from "features/ChangeDialog"
import { CoinDialog } from "features/index"
import { Context } from "index"
import { Badge } from "primereact/badge"
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
  const [changeDialogVisible, setChangeDialogVisible] = useState<boolean>()
  const [basketDialogVisible, setBasketDialogVisible] = useState<boolean>()
  const [userId, setUserId] = useState<string>()
  const [userBalance, setUserBalance] = useState<number>()
  const [userDrinks, setUserDrinks] = useState([])

  useEffect(() => {
    (async () => {
      const r = await authService.getUser()
      setUserId(r.userId)

      updateUserBalance(r.userId)
    })()
  }, [])

  const updateUserBalance = async (userId: string) => {
    const userBalanceResp = await getCurrentBalanceAsync(userId)
    setUserBalance(userBalanceResp)
  }

  return (
    <>
      <Toast ref={toast} position="bottom-right" />
      <CoinDialog visible={coinDialogVisible} setVisible={setCoinDialogVisible} toastRef={toast} userId={userId} updateUserBalance={updateUserBalance} />
      <ChangeDialog visible={changeDialogVisible} setVisible={setChangeDialogVisible} toastRef={toast} userId={userId} updateUserBalance={updateUserBalance} userBalance={userBalance} />
      <div className="flex align-items-center justify-content-center fadein">
        <div className="flex flex-column" style={{ maxWidth: '80%', minWidth: '80%', marginTop: '150px' }}>
          <div className="w-12 mb-2 flex align-items-center">
            <Button label="Внести монеты" icon="pi pi-plus" className="mr-2" onClick={() => setCoinDialogVisible(true)} />
            <Button label="Выдать сдачу" severity="help" icon="pi pi-wallet" onClick={() => setChangeDialogVisible(true)} />
            <div className="ml-2">Ваш баланс: <span className="text-bold">{userBalance}</span> ₽</div>
            <div className="flex-grow-1 flex justify-content-end">
              <div className="cursor-pointer">
                <i className="pi pi-shopping-cart p-overlay-badge" style={{ fontSize: '2rem' }}>
                  {userDrinks && <Badge value={userDrinks.length} severity="danger"></Badge>}
                </i>
              </div>
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