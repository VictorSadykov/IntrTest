import { DrinkDialogProps } from "entities/props";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { getFormErrorMessage } from "shared/components";
import { FileUpload } from 'primereact/fileupload';
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";
import { addDrinkAsync, editDrinkAsync } from "entities/drink";


export const DrinkDialog = ({ visible, setVisible, toastRef, drinkForEdition, setDrinkForEdition, updateDrinks }: DrinkDialogProps) => {
  const { control, formState: { errors }, getValues, handleSubmit, setValue, reset } = useForm()
  const fileUploadRef = useRef<FileUpload>(null)

  useEffect(() => {
    if (drinkForEdition !== null) {
      setValue("name", drinkForEdition.name)
      setValue("amount", drinkForEdition.amount)
      setValue("price", drinkForEdition.price)
    }

  }, [drinkForEdition])
  

  const onSubmit = async (data) => {

    const formData = new FormData()
    formData.append("name", data.name)
    formData.append("amount", data.amount)
    formData.append("price", data.price)
    formData.append("photo", data.photo)

    if (!data.photo) {
      formData.set("photo", null)
    }

    try {

      drinkForEdition === null ? await addDrinkAsync(formData) : await editDrinkAsync(drinkForEdition.id, formData)
      toastRef?.current?.show({ severity: "success", summary: drinkForEdition === null ? "Напиток успешно добавлен" : "Напиток успешно изменен" })
      await updateDrinks()
      setVisible(false)
    } catch (ex) {
      console.error(ex)
      toastRef?.current?.show({ severity: "error", summary: "Ошибка на стороне сервера." })

    }
  }

  useEffect(() => {
    if (!visible) {
      setDrinkForEdition(null)
      setValue("name", null)
      setValue("amount", null)
      setValue("price", null)
      setValue("photo", null)
    }

  }, [visible])

  const footerContent = (
    <div>
      <Button severity="success" label="Сохранить" onClick={handleSubmit(onSubmit)} />
      <Button severity="danger" label="Отмена" onClick={() => setVisible(false)} />
    </div>
  )

  return (
    <Dialog header={drinkForEdition === null ? "Изменить напиток" : "Добавить напиток"} footer={footerContent} visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
      <form>
        <div className="flex flex-column">
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Заполните обязательное поле' }}
            render={({ field, fieldState }) => {
              return <>
                <label className="font-bold mb-2">Название</label>
                <InputText
                  id={field.name}
                  value={field.value}
                  className="mb-2"
                  onChange={e => field.onChange(e.target.value)}
                  placeholder="Введите название"
                />
                {getFormErrorMessage(field.name, errors)}
              </>
            }}
          />
          <Controller
            name="amount"
            control={control}
            rules={{ required: 'Заполните обязательное поле' }}
            render={({ field, fieldState }) => {
              return <>
                <label className="font-bold mb-2">Количество</label>
                <InputNumber
                  id={field.name}
                  value={field.value}
                  className="mb-2"
                  onChange={(e) => { field.onChange(e.value) }}
                  placeholder="Введите количество"
                  locale="ru-RU"
                  min={1}
                  max={100}
                />
                {getFormErrorMessage(field.name, errors)}
              </>
            }}
          />
          <Controller
            name="price"
            control={control}
            rules={{ required: 'Заполните обязательное поле' }}
            render={({ field, fieldState }) => {
              return <>
                <label className="font-bold mb-2">Цена</label>
                <InputNumber
                  id={field.name}
                  value={field.value}
                  className="mb-2"
                  onChange={e => field.onChange(e.value)}
                  placeholder="Введите цену"
                  locale="ru-RU"
                  min={1}
                  max={100000}
                />
                {getFormErrorMessage(field.name, errors)}
              </>
            }}
          />
          <div>
            <label className="font-bold">Фотография</label>
            <div className="mt-2">
              <Controller
                control={control}
                name={'photo'}
                rules={{ required: drinkForEdition === null ? 'Заполните обязательное поле' : false }}
                render={({ field: { value, onChange, ...field } }) => {
                  return <>
                    <FileUpload
                      {...field}
                      ref={fileUploadRef}
                      name={field.name}
                      accept=".jpg, .png"
                      multiple={false}
                      uploadOptions={{ style: { display: 'none' } }}
                      chooseLabel="Выбрать"
                      cancelLabel="Отмена"
                      url={'/api/upload'}
                      onSelect={(e) => onChange(e.files[0])}
                      onClear={() => onChange(null)}
                      customUpload={true}
                      invalidFileSizeMessageDetail={"Максимальный вес файла 5 МБ."}
                      invalidFileSizeMessageSummary={"Слишком большой вес файла."}
                      maxFileSize={5000000}
                      emptyTemplate={<p className="m-0">Перетащите файл, чтобы загрузить его. Максимальный вес фото 5 МБ.</p>}
                    />
                    {getFormErrorMessage(field.name, errors)}
                  </>
                }}
              />

            </div>
          </div>
        </div>

      </form>
    </Dialog>
  )
}