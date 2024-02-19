import { DrinksPaged, getAllDrinksAsync, getDrinksPagedAsync } from "entities/drink"
import { getCurrentBalanceAsync } from "entities/user"
import { BoughtDrinksInfo, UserDrink, buyDrinksAsync, getAllUserDrinksAsync } from "entities/userDrinks"
import { ChangeDialog } from "features/Coin/ChangeDialog"
import { DrinksBoughtDialog } from "features/UserDrink/DrinksBoughtDialog"
import { CoinDialog, UserDrinkOverlay } from "features/index"
import { Context } from "index"
import { Badge } from "primereact/badge"
import { Button } from "primereact/button"
import { Card } from "primereact/card"
import { Dialog } from "primereact/dialog"
import { OverlayPanel } from "primereact/overlaypanel"
import { Toast } from "primereact/toast"
import React, { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from "react"
import { unstable_useViewTransitionState } from "react-router-dom"
import authService from "shared/services/auth.service"
import { DrinkShopList } from "widgets/index"

export const ShopPage = () => {
  const toast = useRef(null)
  const [coinDialogVisible, setCoinDialogVisible] = useState<boolean>()
  const [changeDialogVisible, setChangeDialogVisible] = useState<boolean>()
  const [drinksBoughtVisible, setDrinksBoughtVisible] = useState<boolean>()
  const [userId, setUserId] = useState<string>()
  const [userBalance, setUserBalance] = useState<number>()
  const [userDrinks, setUserDrinks] = useState<UserDrink[]>()
  const [userDrinksAmount, setUserDrinksAmount] = useState<number>()
  const [drinksBoughtInfo, setDrinksBoughtInfo] = useState<BoughtDrinksInfo>()

  

  const op = useRef(null);

  
  useEffect(() => {
    (async () => {
      const r = await authService.getUser()
      setUserId(r.userId)

      await updateUserBalance(r.userId)
      await updateUserDrinks(r.userId)
    })()
  }, [])

  const updateUserBalance = async (userId: string) => {
    const userBalanceResp = await getCurrentBalanceAsync(userId)
    setUserBalance(userBalanceResp)
  }

  const updateUserDrinks = async (userId: string) => {
    const userDrinksResp = await getAllUserDrinksAsync(userId)
    let amount = 0
    userDrinksResp.forEach(x => amount += x.amount)
    setUserDrinksAmount(amount)
    setUserDrinks(userDrinksResp)
  }

  const updateBoughtUserDrinks = async (userId: string, userDrinks: UserDrink[]) => {
    try {
      console.log(userDrinks)
      const r = await buyDrinksAsync(userId, userDrinks);
      setDrinksBoughtInfo(r)
      updateUserDrinks(userId)
      updateUserBalance(userId)
      setDrinksBoughtVisible(true)
    } catch (ex) {
      toast.current.show({ severity: "error", summary: "Ошибка на стороне сервера" })
      console.error(ex)
    }
  }

  const openChangeDialog = () => {
    if (userBalance === 0) {
      toast.current.show({ severity: "error", summary: "Ваш баланс пустой" })
      return;
    } else {

      setChangeDialogVisible(true)
    }
  }


  return (
    <>
      <Toast ref={toast} position="bottom-right" />
      <CoinDialog visible={coinDialogVisible} setVisible={setCoinDialogVisible} toastRef={toast} userId={userId} updateUserBalance={updateUserBalance} />
      <ChangeDialog visible={changeDialogVisible} setVisible={setChangeDialogVisible} toastRef={toast} userId={userId} updateUserBalance={updateUserBalance} userBalance={userBalance} />
      <DrinksBoughtDialog visible={drinksBoughtVisible} setVisible={setDrinksBoughtVisible} drinksBoughtInfo={drinksBoughtInfo} />
      <OverlayPanel ref={op}>
        <UserDrinkOverlay
          balance={userBalance}
          updateUserDrinks={updateUserDrinks}
          userDrinks={userDrinks}
          toastRef={toast}
          setUserDrinks={setUserDrinks}
          updateBoughtUserDrinks={updateBoughtUserDrinks}
        />
      </OverlayPanel>
      <div className="flex align-items-center justify-content-center fadein">
        <div className="flex flex-column" style={{ maxWidth: '80%', minWidth: '80%', marginTop: '150px' }}>
          <div className="w-12 mb-2 flex align-items-center">
            <Button label="Внести монеты" icon="pi pi-plus" className="mr-2" onClick={() => setCoinDialogVisible(true)} />
            <Button label="Выдать сдачу" severity="help" icon="pi pi-wallet" onClick={() => openChangeDialog()} />
            <div className="ml-2">Ваш баланс: <span className="text-bold">{userBalance}</span> ₽</div>
            <div className="flex-grow-1 flex justify-content-end">
              <div className="cursor-pointer" onClick={(e) => op.current.toggle(e)}>
                <i className="pi pi-shopping-cart p-overlay-badge" style={{ fontSize: '2rem' }}>
                  {userDrinks && <Badge value={userDrinksAmount} severity="danger"></Badge>}
                </i>
              </div>
            </div>
          </div>
          <Card className="shadow-4" style={{ minWidth: '100%', minHeight: '1400px' }}>
            <DrinkShopList userDrinks={userDrinks} currentBalance={userBalance} updateUserDrinks={updateUserDrinks} toastRef={toast} updateBoughtUserDrinks={updateBoughtUserDrinks} />
          </Card>
        </div>
      </div>
    </>
  )
}