import { Drink, DrinksPaged, getDrinksPagedAsync } from "entities/drink"
import { DrinkShopCard } from "features/DrinkShopCard"
import { Paginator } from "primereact/paginator"
import React, { useEffect, useState } from "react"

export const DrinkShopList = () => {
  const [drinksPaged, setDrinksPaged] = useState<DrinksPaged>()
  const [drinks, setDrinks] = useState<Drink[]>()
  const [firstRow, setFirstRow] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(6)
  const [totalRows, setTotalRows] = useState(0)


  useEffect(() => {
    (async () => {
      const drinksPaged = await getDrinksPagedAsync(1, rowsPerPage)
      setDrinksPaged(drinksPaged)
    })()
  }, [])

  useEffect(() => {
    if (drinksPaged && drinksPaged.results && drinksPaged.results.length > 0) {
      updatePaginatorInfo(drinksPaged)
      setDrinks(drinksPaged.results)
    }
  }, [drinksPaged])

  const onPageChange = async (event) => {
    setFirstRow(event.first)
    setRowsPerPage(event.rows)


    const resp = await getDrinksPagedAsync(event.page + 1, rowsPerPage)
    setDrinksPaged(resp)
  }

  const updatePaginatorInfo = (drinksPaged: DrinksPaged) => {
    setFirstRow(drinksPaged.firstRowOnPage)
    setRowsPerPage(drinksPaged.pageSize)
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
                key={item.id}
                item={item}
              />
            })
          }
          
        </div>
      }
      <Paginator first={firstRow} rows={rowsPerPage} totalRecords={totalRows} onPageChange={onPageChange} />
    </div>
  )
}