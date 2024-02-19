import { BoughtDrinkItemInfo, BoughtDrinksInfo, UserDrink } from "entities/userDrinks"
import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import { ProgressSpinner } from "primereact/progressspinner"
import React, { useEffect, useState } from "react"
import { Dispatch, SetStateAction } from "react"

export const DrinksBoughtDialog = ({ visible, setVisible, drinksBoughtInfo }: {
  visible: boolean
  setVisible: Dispatch<SetStateAction<boolean>>
  drinksBoughtInfo: BoughtDrinksInfo,
}) => {
  const [startBalance, setStartBalance] = useState<number>()
  const [isLoading, setIsLoading] = useState<boolean>()
  const [currentBalance, setCurrentBalance] = useState<number>()
  const [boughtDrinks, setBoughtDrinks] = useState<BoughtDrinkItemInfo[]>()
  
  
  useEffect(() => {
    if (visible) {
      setIsLoading(true)
      updateChangeInfo(drinksBoughtInfo)
      setIsLoading(false)
    }
  }, [visible])


  const updateChangeInfo = (drinksBoughtInfo : BoughtDrinksInfo) => {
    setStartBalance(drinksBoughtInfo.currentUserBalance + drinksBoughtInfo.totalBuySum)
    setCurrentBalance(drinksBoughtInfo.currentUserBalance)
    setBoughtDrinks(drinksBoughtInfo.userDrinksBought);
  }

  const footerContent = (
    <div>
      <Button severity="danger" label="Закрыть" onClick={() => setVisible(false)} />
    </div>
  )

  return (
    <Dialog style={{ minWidth: '800px' }} header={"Ваши товары"} visible={visible} onHide={() => setVisible(false)} footer={footerContent}>
      {isLoading
        ? <ProgressSpinner />
        :
      <div>
        <div className="mb-2">Ваш первоначальный баланс: {startBalance} ₽</div>
        <div className="mb-2">Потраченная сумма: {drinksBoughtInfo?.totalBuySum} ₽</div>
        <div className="mb-2">Ваш текущий баланс: {currentBalance} ₽</div>
        <div>Вы купили: {boughtDrinks?.length === 1
        ?
        <span>{boughtDrinks[0]?.name} за {boughtDrinks[0]?.price} ₽</span>
        :
          <ul>
            {boughtDrinks?.map(item => {
              return <li key={item.name + Date.now()}>{item.amount} шт. по {item.price} ₽. Итого: {item.totalPrice} ₽</li>
            })}
          </ul>
        }
        </div>
      </div>
      }
    </Dialog>
  )
}