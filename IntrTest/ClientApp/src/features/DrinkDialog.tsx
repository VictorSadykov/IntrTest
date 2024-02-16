import { DrinkDialogProps } from "entities/props";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { getFormErrorMessage } from "shared/components";
import { FileUpload } from 'primereact/fileupload';


export const DrinkDialog = ({ visible, setVisible }: DrinkDialogProps) => {
  const { control, formState: { errors } } = useForm()


  const footerContent = (
    <div>
      <Button severity="success" label="Сохранить" />
      <Button severity="danger" label="Отмена" onClick={() => setVisible(false)} />
    </div>
  )


  return (
    <Dialog header="Header" footer={footerContent} visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
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
                <InputText
                  id={field.name}
                  value={field.value}
                  className="mb-2"
                  onChange={e => field.onChange(e.target.value)}
                  placeholder="Введите количество"
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
                <InputText
                  id={field.name}
                  value={field.value}
                  className="mb-2"
                  onChange={e => field.onChange(e.target.value)}
                  placeholder="Введите цену"
                />
                {getFormErrorMessage(field.name, errors)}
              </>
            }}
          />
          <div>
            <label className="font-bold">Фотография</label>
            <div className="mt-2">
              <FileUpload
                name="demo[]" 
                uploadOptions={{style: {display: 'none'}}}
                chooseLabel="Выбрать"
                cancelLabel="Отмена"
                url={'/api/upload'} 
                accept="image/*" 
                invalidFileSizeMessageDetail={"Максимальный вес файла 5 МБ." }
                invalidFileSizeMessageSummary={"Слишком большой вес файла."}
                maxFileSize={5000000} 
                emptyTemplate={<p className="m-0">Перетащите файл, чтобы загрузить его. Максимальный вес фото 5 МБ.</p>} />
            </div>
          </div>
        </div>
      </form>
    </Dialog>
  )
}