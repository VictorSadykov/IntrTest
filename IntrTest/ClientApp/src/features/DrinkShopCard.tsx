import { Drink } from "entities/drink"
import { Button } from "primereact/button"
import { Card } from "primereact/card"
import React from "react"
import "./css/DrinkShopCard.css"
import authService from "shared/services/auth.service"


export const DrinkShopCard = ({ item } : {item: Drink}) => {
  const addDrinkToBasket = async () => {
    let userId = await authService.getUser().userId
    await addDrinkToBasketAsync(userId, item.id)
  }

  return (
    <div className="col-4 flex justify-content-center drinkCard mb-5">
      <Card style={{ width: '500px' }} className="shadow-2">
        <div className="flex flex-column justify-content-between" style={{ width: '100%', height: '100%' }}>
          <div className="flex-grow-1" style={{ overflow: 'hidden' }}>
            <img src={`https://localhost:7191/${item.imageUrl}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
              <Button className="mr-2" label="Купить" />
              <Button outlined label="В корзину" onClick={addDrinkToBasket}/>
            </div>
          </div>
        </div>
      </Card>
    </div>

  )
}