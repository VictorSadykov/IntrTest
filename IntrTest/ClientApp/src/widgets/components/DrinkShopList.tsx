import { Drink, DrinksPaged, getDrinksPagedAsync } from "entities/drink"
import { UserDrink } from "entities/userDrinks"
import { DrinkShopCard } from "features/Drink/DrinkShopCard"
import { Paginator } from "primereact/paginator"
import { Toast } from "primereact/toast"
import React, { MutableRefObject, useEffect, useState } from "react"

export const DrinkShopList = ({ updateUserDrinks, toastRef, updateBoughtUserDrinks, currentBalance, userDrinks }:
  {
    updateUserDrinks: (string) => Promise<void>,
    toastRef: MutableRefObject<Toast>,
    updateBoughtUserDrinks: (userId: string, userDrinks: UserDrink[]) => Promise<void>,
    currentBalance: number,
    userDrinks: UserDrink[]
  }) => {

  const [drinksPaged, setDrinksPaged] = useState<DrinksPaged>()
  const [drinks, setDrinks] = useState<Drink[]>()
  const [firstRow, setFirstRow] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(9)
  const [totalRows, setTotalRows] = useState(0)



  useEffect(() => {
    (async () => {
      await updateDrinksPaged()
    })()
  }, [])

  useEffect(() => {
    (async () => {
      await updateDrinksPaged()
    })()
  }, [userDrinks])

  useEffect(() => {
    if (drinksPaged && drinksPaged.results && drinksPaged.results.length > 0) {
      updatePaginatorInfo(drinksPaged)
      setDrinks(drinksPaged.results)
    }
  }, [drinksPaged])

  const updateDrinksPaged = async () => {
    const drinksPaged = await getDrinksPagedAsync(1, rowsPerPage)
    setDrinksPaged(drinksPaged)
  }

  const onPageChange = async (event) => {
    setFirstRow(event.first)


    const resp = await getDrinksPagedAsync(event.page + 1, rowsPerPage)
    setDrinksPaged(resp)
  }

  const updatePaginatorInfo = (drinksPaged: DrinksPaged) => {
    setFirstRow(drinksPaged.firstRowOnPage)
    setTotalRows(drinksPaged.rowCount)
  }



  return (
    <div>
      {totalRows === 0
        ? <h4>В автомате нет напитков</h4>
        : <div className="grid">
          {
            drinks.map((item) => {
              return <DrinkShopCard
                updateBoughtUserDrinks={updateBoughtUserDrinks}
                updateUserDrinks={updateUserDrinks}
                key={item.id}
                item={item}
                toastRef={toastRef}
                currentBalance={currentBalance}
              />
            })
          }

        </div>
      }
      <Paginator first={firstRow} rows={rowsPerPage} totalRecords={totalRows} onPageChange={onPageChange} />
    </div>
  )
}