import { Drink, getAllDrinksAsync } from "entities/drink"
import { Button } from "primereact/button"
import { Card } from "primereact/card"
import React, { MutableRefObject } from "react"
import "../css/DrinkShopCard.css"
import authService from "shared/services/auth.service"
import { UserDrink, addDrinkToBasketAsync, getAllUserDrinksAsync, getSpecificUserDrinkAsync } from "entities/userDrinks"
import { Toast } from "primereact/toast"


export const DrinkShopCard = ({ item, updateUserDrinks, toastRef, updateBoughtUserDrinks, currentBalance }:
  {
    item: Drink,
    updateUserDrinks: (string) => Promise<void>,
    toastRef: MutableRefObject<Toast>,
    updateBoughtUserDrinks: (userId: string, userDrinks: UserDrink[]) => Promise<void>,
    currentBalance: number
  }) => {

  const addDrinkToBasket = async () => {

    let userId = await authService.getUser().userId

    if (await checkLimit()) return

    try {
      await addDrinkToBasketAsync(userId, item.id)
      await updateUserDrinks(userId)
      toastRef.current.show({ severity: "success", summary: "Товар добавлен в корзину" })

    } catch (ex) {
      toastRef.current.show({ severity: "error", summary: "Ошибка на стороне сервера" })
    }
  }

  const buyItem = async () => {
    if (currentBalance < item.price) {
      toastRef.current.show({ severity: "error", summary: "Не достаточно денег на счету" })
      return
    }
    let userId = await authService.getUser().userId


    try {
      await addDrinkToBasketAsync(userId, item.id)
      await updateUserDrinks(userId)
      const r = await getSpecificUserDrinkAsync(userId, item.id)
      await updateBoughtUserDrinks(userId, [r])
    } catch (ex) {
      toastRef.current.show({ severity: "error", summary: "Ошибка на стороне сервера" })
    }
  }

  const checkLimit = async () => {
    let drinks = await getAllDrinksAsync()
    console.log(drinks)
    if (drinks.length === 0) return false

    let drink = drinks.find(x => x.id === item.id)

    let userId = await authService.getUser().userId
    let userDrinks = await getAllUserDrinksAsync(userId)
    console.log(userDrinks)
    if (userDrinks.length === 0) return false
    let userDrink = userDrinks.find(x => x.drinkId === item.id)

    if (!userDrink) return false

    if (drink.amount === userDrink.amount) {
      toastRef.current.show({ severity: "info", summary: "В автомате больше нет таких напитков, достигнут лимит" })
      return true
    }

    return false
  }

  return (
    <div className="col-4 flex justify-content-center drinkCard mb-5">
      <Card style={{ width: '500px' }} className="shadow-2">
        <div className="flex flex-column justify-content-between" style={{ width: '100%', height: '100%' }}>
          <div className="flex-grow-1 flex justify-content-center" style={{ overflow: 'hidden' }}>
            <img src={`https://localhost:7191/${item.imageUrl}`} alt="" style={{ maxHeight: '400px'}} />
          </div>
          <div className="mt-3 text-lg">
            <div className="mb-1">
              <span className="font-bold">Название: </span>
              <span>{item.name}</span>
            </div>
            <div className="mb-4">
              <span className="font-bold">Цена: </span>
              <span>{item.price} ₽</span>
            </div>
            <div className="">
              <Button className="mr-2" label="Купить" onClick={buyItem} />
              <Button outlined label="В корзину" onClick={addDrinkToBasket} />
            </div>
          </div>
        </div>
      </Card>
    </div>

  )
}