import { CoinPanelProps } from "entities/props"
import { Button } from "primereact/button"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { ProgressSpinner } from "primereact/progressspinner"
import React, { useState } from "react"
import { Dialog } from 'primereact/dialog';
import { DrinkDialog } from "features/DrinkDialog"
        

export const DrinkPanel = ({ toastRef }: CoinPanelProps) => {
  const [isLoading, setIsLoading] = useState<boolean>()
  const [visible, setVisible] = useState<boolean>()

  if (isLoading) {
    return (<div style={{ marginTop: '150px' }} className="flex justify-content-center align-items-center">
      <ProgressSpinner style={{ width: '250px', height: '250px' }} />
    </div>)
  }

  return (
    <>
    <DrinkDialog visible={visible} setVisible={setVisible}/>
      <div className="fadein">
        <Button onClick={() => setVisible(true)} className="mb-3 mt-4" label="Добавить напиток" icon="pi pi-plus" />
        <DataTable removableSort showGridlines emptyMessage="В базе данных нет напитков" >
          <Column field="name" sortable header="Название"></Column>
          <Column field="amount" sortable header="Количество"></Column>
          <Column field="price" sortable header="Цена"></Column>
          <Column field="photo" header="Фотография"></Column>
        </DataTable>
      </div>
    </>
  )
}