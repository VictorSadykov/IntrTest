import React, { useEffect, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Coin } from "entities/coin/models/Coin";
import { getAllCoinsAsync } from "entities/coin";
import { ToggleButton } from 'primereact/togglebutton';
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import "../css/CoinPanel.css"
import { updateCoinsAsync } from "entities/coin/api/updateCoinsAsync";
import { AuthProps, CoinPanelProps } from "entities/props";
import { ProgressSpinner } from 'primereact/progressspinner';
        


export const CoinPanel = ({toastRef} : CoinPanelProps) => {
  const [coinsOrigin, setCoinsOrigin] = useState<Coin[]>()
  const [coins, setCoins] = useState<Coin[]>()
  const [isChanged, setIsChanged] = useState<boolean>()
  const [isWaitingForResponse, setIsWaitingForResponse] = useState<boolean>()
  const [isLoading, setIsLoading] = useState<boolean>()


  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true)
        const respData = await getAllCoinsAsync()
        setCoinsOrigin(respData)
      } catch (ex) {
        console.error(ex)
        toastRef?.current?.show({severity: "error", summary: "Ошибка на стороне сервера."})
      }

      setIsLoading(false)
    })()
  }, [])

  useEffect(() => {
    setCoins(coinsOrigin)
  }, [coinsOrigin])

  const isBlockedBody = (coin: Coin) => {
    return <ToggleButton disabled={isWaitingForResponse} onLabel="Да" offLabel="Нет" onIcon="pi pi-lock" offIcon="pi pi-lock-open"
      checked={coin.isBlocked} onChange={e => onBlockedChange(coin, e.value)} className="toggleButton w-9rem" />

  }

  const amountBody = (coin: Coin) => {
    return <InputNumber disabled={isWaitingForResponse} value={coin.amount} allowEmpty={false} onValueChange={(e) => onAmounChange(coin, e.value)} locale="ru-RU" showButtons buttonLayout="horizontal" style={{ width: '4rem' }}
      decrementButtonClassName="p-button-secondary" incrementButtonClassName="p-button-secondary" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" min={0} max={10000} />
  }

  const onBlockedChange = (coin: Coin, isBlocked: boolean) => {
    setCoins(coins.map(x => x.value === coin.value ? { ...x, isBlocked: isBlocked } : x))
    setIsChanged(true)
  }

  const onAmounChange = (coin: Coin, amount: number) => {
    setCoins(coins.map(x => x.value === coin.value ? { ...x, amount: amount } : x))
    setIsChanged(true)
  }

  const discardChanges = () => {
    setCoins(coinsOrigin)
    setIsChanged(false)
  }

  const saveChanges = async () => {
    setIsWaitingForResponse(true)

    try {
      const respData = await updateCoinsAsync(coins);
      setCoinsOrigin(coins)
      setIsChanged(false)

      toastRef.current?.show({severity: "success", summary: "Данные успешно обновлены"})
    } catch (ex){
      console.error(ex)
      toastRef.current?.show({severity: "error", summary: "Ошибка на стороне сервера"})
    }

    setIsWaitingForResponse(false)
  }



  if (isLoading) {
    return (<div style={{marginTop: '150px'}}className="flex justify-content-center align-items-center">
      <ProgressSpinner style={{width: '250px', height: '250px'}} />
      </div>)
  }

  return (
    <div className="fadein">
      <DataTable value={coins} removableSort showGridlines emptyMessage="В базе данных нет монет" >
        <Column field="value" sortable header="Ценность"></Column>
        <Column field="amount" sortable header="Количество" body={amountBody}></Column>
        <Column field="isBlocked" header="Блокировка" body={isBlockedBody}></Column>
      </DataTable>
      <div className="mt-5 flex justify-content-end">
        <Button disabled={!isChanged || isWaitingForResponse} className="mr-2" severity="success" label="Сохранить" loading={isWaitingForResponse} onClick={saveChanges}/>
        <Button disabled={!isChanged || isWaitingForResponse} severity="danger" label="Сбросить" onClick={discardChanges}/>
      </div>
    </div>
  )
}