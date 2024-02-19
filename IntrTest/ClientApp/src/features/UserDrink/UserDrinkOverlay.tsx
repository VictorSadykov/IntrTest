import { Drink, checkDrinkAmountAvailable, getAllDrinksAsync } from "entities/drink"
import { UserDrink, changeUserDrinkAmountAsync, deleteUserDrinkAsync } from "entities/userDrinks"
import { Button } from "primereact/button"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { InputNumber } from "primereact/inputnumber"
import { ProgressSpinner } from "primereact/progressspinner"
import { Toast } from "primereact/toast"
import React, { Dispatch, MutableRefObject, SetStateAction, useEffect, useRef, useState } from "react"
import authService from "shared/services/auth.service"

export const UserDrinkOverlay = ({ userDrinks, setUserDrinks, updateUserDrinks, toastRef, balance, updateBoughtUserDrinks }: {
  userDrinks: UserDrink[],
  setUserDrinks: Dispatch<SetStateAction<UserDrink[]>>
  updateUserDrinks: (userId: string) => Promise<void>,
  toastRef: MutableRefObject<Toast>,
  balance: number
  updateBoughtUserDrinks: (userId: string, userDrinks: UserDrink[]) => Promise<void>
}) => {
  const [isLoading, setIsLoading] = useState<boolean>()
  const [totalSum, setTotalSum] = useState<number>()
  const [drinks, setDrinks] = useState<Drink[]>()
  const [userId, setUserId] = useState<string>()


  useEffect(() => {
    (async () => {
      setIsLoading(true)
      setDrinks(await getAllDrinksAsync())
      const r = await authService.getUser()
      setUserId(r.userId)
    })()
  }, [])

  useEffect(() => {
    if (drinks && userDrinks) {
      let sum = 0
      console.log(drinks)
      userDrinks.forEach(x => {
        drinks?.forEach(y => x.drinkId === y.id ? sum = sum + y.price * x.amount : sum + 0)
      })
      setTotalSum(sum)
      setIsLoading(false)
    }
  }, [drinks, userDrinks])



  const buyDrinks = async () => {
    if (!userDrinks || userDrinks === undefined || userDrinks.length === 0) {
      toastRef.current.show({ severity: "error", summary: "Корзина пуста" })
      return
    }

    if (totalSum > balance) {
      toastRef.current.show({ severity: "error", summary: "Недостаточно денег на счету" })
      return
    } 

    await updateBoughtUserDrinks(userId, userDrinks)
  }

  const deleteUserDrink = async (userDrinkId: number) => {
    try {

      const resp = await deleteUserDrinkAsync(userId, userDrinkId)
      updateUserDrinks(userId)
    } catch (ex) {
      toastRef.current.show({ severity: "error", summary: "Ошибка на стороне сервера" })

    }
  }



  const amountBody = (userDrink: UserDrink) => {
    return <div>{userDrink.amount}</div>
  }


  const nameBody = (userDrink: UserDrink) => {

    let name = drinks?.find(x => x.id === userDrink.drinkId).name
    return <div>{name}</div>
  }

  const priceBody = (userDrink: UserDrink) => {

    let price = drinks?.find(x => x.id === userDrink.drinkId).price
    return <div>{price}</div>
  }

  const deleteBody = (userDrink: UserDrink) => {
    return <Button icon="pi pi-trash" severity="danger" onClick={() => deleteUserDrink(userDrink.drinkId)} />
  }

  const footerBody = () => {
    return (
      <div className="flex justify-content-between">
        <Button label="Купить" severity="success" onClick={buyDrinks} />
        <div>К оплате: {totalSum} ₽</div>
      </div>
    )
  }
  if (isLoading) {
    return <ProgressSpinner />
  }

  if (!userDrinks) {
    return <div>Добавьте товары в корзину</div>
  }

  return (<DataTable style={{ width: '800px' }} value={userDrinks} removableSort showGridlines emptyMessage="Добавьте товары в корзину" footer={footerBody}>
    <Column field="name" header="Название" body={nameBody}></Column>
    <Column field="price" header="Цена" body={priceBody}></Column>
    <Column field="amount" header="Количество" body={amountBody}></Column>
    <Column field="buttons" body={deleteBody}></Column>
  </DataTable>)

}