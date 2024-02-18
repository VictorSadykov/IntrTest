import { Coin, InsertCoinsDTO, getAllCoinsAsync } from "entities/coin"
import { MyToastProps } from "entities/props"
import { Button } from "primereact/button"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { Dialog } from "primereact/dialog"
import { InputNumber } from "primereact/inputnumber"
import { ProgressSpinner } from "primereact/progressspinner"
import React, { useEffect, useState } from "react"

export const CoinDialog = ({ visible, setVisible, toastRef, userId}: MyToastProps) => {
  const [coins, setCoins] = useState<Coin[]>()
  const [isLoading, setIsLoading] = useState<boolean>()

  const onAmountChange = (coin: Coin, amount: number) => {
    setCoins(coins.map(x => x.value === coin.value ? { ...x, amount: amount } : x))
  }

  useEffect(() => {
    (async () => {
      fetchCoins()
    })()
  }, [])

  useEffect(() => {
    if (visible) {
      (async () => {
        fetchCoins()
      })()
    }
  }, [visible])


  const fetchCoins = async () => {
    try {
      setIsLoading(true)
      const respData = await getAllCoinsAsync()      
      respData.sort((a, b) => a.value - b.value)
      let coinsMapped = respData.map(x => ({...x, amount: 0}))
      setCoins(coinsMapped);
    } catch (ex) {
      console.error(ex)
      toastRef?.current?.show({ severity: "error", summary: "Ошибка на стороне сервера." })
    }

    setIsLoading(false)
  }

  const insertCoins = async() => {
    if (coins.every(x => x.amount === 0)) {
      toastRef.current.show({severity: "error", summary: "Вы не внесли ни одной монеты"})
      return
    }

    try {
      const insertCoinsDto : InsertCoinsDTO = coins.map(x => ({value: x.value, amount: x.amount}))

      const r = await insertCoinsAsync(userId, insertCoinsDto)
      toastRef.current.show({severity: "success", summary: "Монеты внесены"})
      setVisible(false)
    } catch (ex) {
      toastRef.current.show({severity: "error", summary: "Ошибка на стороне сервера"})
    }
  }

  const footerContent = (
    <div>
      <Button severity="success" label="Внести" onClick={() => insertCoins()} />
      <Button severity="danger" label="Отмена" onClick={() => setVisible(false)} />
    </div>
  )

  const amountBody = (coin: Coin) => {
    return <InputNumber disabled={coin.isBlocked} value={coin.amount} allowEmpty={false} onValueChange={(e) => onAmountChange(coin, e.value)} locale="ru-RU" showButtons buttonLayout="horizontal" style={{ width: '4rem' }}
      decrementButtonClassName="p-button-secondary" incrementButtonClassName="p-button-secondary" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" min={0} max={10000} />
  }



  return (
    <Dialog style={{ minWidth: '800px' }} header={"Внесите монеты"} visible={visible} onHide={() => setVisible(false)} footer={footerContent}>
      {isLoading
        ? <ProgressSpinner />
        :
        <DataTable value={coins} removableSort showGridlines emptyMessage="В базе данных нет монет" >
          <Column field="value" header="Ценность"></Column>
          <Column field="amount" header="Количество" body={amountBody}></Column>
        </DataTable>
      }
    </Dialog>
  )
}