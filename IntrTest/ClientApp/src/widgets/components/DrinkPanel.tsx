import { CoinPanelProps } from "entities/props"
import { Button } from "primereact/button"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { ProgressSpinner } from "primereact/progressspinner"
import React, { useEffect, useRef, useState } from "react"
import { Dialog } from 'primereact/dialog';
import { DrinkDialog } from "features/Drink/DrinkDialog"
import { Drink, deleteDrinkAsync, exportDrinksAsync, getAllDrinksAsync, importDrinksAsync } from "entities/drink"
import dayjs from "dayjs"
import { FileUpload } from "primereact/fileupload"
import $api from "shared/api/axiosInstance"
import { ConfirmDialog } from "primereact/confirmdialog"
import { Controller, useForm } from "react-hook-form"

export const DrinkPanel = ({ toastRef }: CoinPanelProps) => {
  const [isLoading, setIsLoading] = useState<boolean>()
  const [visible, setVisible] = useState<boolean>()
  const [drinks, setDrinks] = useState<Drink[]>()
  const [isUploading, setIsUploading] = useState<boolean>()
  const [visibleСonfirmDelition, setVisibleConfirmDelition] = useState<boolean>()
  const [drinkIdForDelition, setDrinkIdForDelition] = useState<number>(null)
  const [drinkForEdition, setDrinkForEdition] = useState<Drink>(null)
  const fileUploadRef = useRef<FileUpload>()

  const { control } = useForm()

  useEffect(() => {
    (async () => {
      try {
        await updateDrinks()
      } catch (ex) {
        console.error(ex)
      }
    })()
  }, [])

  const updateDrinks = async () => {
    const drinksData = await getAllDrinksAsync()
    setDrinks(drinksData)
  }


  if (isLoading) {
    return (<div style={{ marginTop: '150px' }} className="flex justify-content-center align-items-center">
      <ProgressSpinner style={{ width: '250px', height: '250px' }} />
    </div>)
  }

  const imageBodyTemplate = (drink: Drink) => {
    return <div className="flex justfiy-content-center align-items-center"><img style={{ maxHeight: "150px", margin: '0 auto' }} src={`https://localhost:7191/${drink.imageUrl}`} alt="" /></div>
  }

  const buttonsBodyTemplate = (drink: Drink) => {
    return <div className="flex max-w-full">
      <Button severity="info" className="mr-2" label="Редактировать" icon="pi pi-pencil" onClick={() => selectDrinkForEdition(drink)} />
      <Button severity="danger" label="Удалить" icon="pi pi-trash" onClick={() => selectDrinkForDelition(drink.id)} />
    </div>
  }

  const selectDrinkForDelition = (drinkId: number) => {
    setDrinkIdForDelition(drinkId)
    setVisibleConfirmDelition(true)
  }

  const deselectDrinkForDelition = () => {
    setDrinkIdForDelition(null)
    setVisibleConfirmDelition(false)

  }

  const selectDrinkForEdition = (drink: Drink) => {
    setDrinkForEdition(drink)
    setVisible(true)
  }

  const footerDeleteDialog = () => {
    return <>
      <Button
        label="Да"
        severity="danger"
        icon="pi pi-trash"
        onClick={() => deleteDrink()}
      />
      <Button
        label="Нет"
        outlined
        icon="pi pi-times"
        onClick={() => deselectDrinkForDelition()}
      />
    </>
  }

  const deleteDrink = async () => {

    try {
      const r = await deleteDrinkAsync(drinkIdForDelition)
      toastRef.current.show({ severity: "success", summary: "Напиток успешно удалён" })
      setDrinks(drinks.filter(x => x.id !== drinkIdForDelition))
    } catch (ex) {
      console.error(ex)
      toastRef.current.show({ severity: "error", summary: "Ошибка на стороне сервера" })
    }
    deselectDrinkForDelition()
  }

  const exportDrinks = async () => {
    if (drinks.length === 0) {
      toastRef.current.show({severity: "error", summary: "Нет напитков для экспорта"})
      return
    }

    try {
      const r = await exportDrinksAsync()

    } catch (ex) {
      console.error(ex)
    }
  }


  const customBase64Uploader = async (event) => {
    setIsUploading(true)
    const file = event.files[0];

    let fd = new FormData()
    fd.append("file", file)


    try {
      const r = await importDrinksAsync(fd)
      toastRef.current.show({ severity: "success", summary: "Напитки успешно импортированы" })
      await updateDrinks()
      fileUploadRef.current.clear()
    } catch (ex) {
      toastRef.current.show({ severity: "error", summary: "Ошибка на стороне сервера" })
    }

    setIsUploading(false)
  };

  return (
    <>
      <ConfirmDialog
        visible={visibleСonfirmDelition}
        onHide={() => setVisibleConfirmDelition(false)}
        message="Вы действительно хотите удалить напиток?"
        rejectLabel="Нет"
        footer={footerDeleteDialog}
        header="Подтвердите удаление напитка."
        icon="pi pi-exclamation-triangle" />
      <DrinkDialog visible={visible} setVisible={setVisible} toastRef={toastRef} drinkForEdition={drinkForEdition} setDrinkForEdition={setDrinkForEdition} updateDrinks={updateDrinks} />
      <div className="fadein">
        <div className="flex justify-content-between">
          <Button onClick={() => setVisible(true)} className="mb-3 mt-4" label="Добавить напиток" icon="pi pi-plus" />
          <div className="flex justify-content-center align-items-center">
            <Button severity="success" onClick={exportDrinks} className="mb-3 mt-4 mr-2" label="Экспортировать напитки" icon="pi pi-file-export " />
            <FileUpload
              mode="basic"
              name="import"
              ref={fileUploadRef}
              disabled={isUploading}
              url="/api/drink/importDrinks"
              accept=".zip"
              auto
              maxFileSize={10000000}
              uploadHandler={customBase64Uploader}
              chooseLabel="Импортировать напитки"
              customUpload
              chooseOptions={{ icon: "pi pi-file-import", className: "mt-2" }}
            />
          </div>
        </div>
        <DataTable value={drinks} removableSort showGridlines emptyMessage="В базе данных нет напитков" >
          <Column field="name" sortable header="Название"></Column>
          <Column field="amount" sortable header="Количество"></Column>
          <Column field="price" sortable header="Цена"></Column>
          <Column field="photo" header="Фотография" body={imageBodyTemplate}></Column>
          <Column className="max-w-10rem" body={buttonsBodyTemplate} />
        </DataTable>
      </div>

    </>
  )
}