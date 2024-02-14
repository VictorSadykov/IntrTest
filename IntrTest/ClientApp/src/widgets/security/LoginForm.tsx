import { AuthProps } from "models/props"
import { Button } from "primereact/button"
import { Card } from "primereact/card"
import { InputText } from "primereact/inputtext"
import { Password } from "primereact/password"
import React, { useState } from "react"
import { Controller, useForm } from "react-hook-form";

export const LoginForm = ({formInfo, toggleCard, getFormErrorMessage} : AuthProps) => {
  const { control, formState: { errors }, handleSubmit } = formInfo;

  han

  return (
    <form>
      <div className="flex flex-column mb-3">
        <Controller
          name="login"
          control={control}
          rules={{ required: 'Заполните обязательное поле' }}
          render={({ field, fieldState }) => {
            return <>
              <InputText
                id={field.name}
                value={field.value}
                className="mb-2"
                onChange={e => field.onChange(e.target.value)}
                placeholder="Логин"
              />
              {getFormErrorMessage(field.name)}
            </>
          }}
        />
        <Controller
          name="password"
          control={control}
          rules={{ required: 'Заполните обязательное поле' }}
          render={({ field, fieldState }) => {
            return <>
              <Password
                id={field.name}
                value={field.value}
                toggleMask
                feedback={false}
                onChange={e => field.onChange(e.target.value)}
                placeholder="Пароль" />
              {getFormErrorMessage(field.name)}
            </>
          }}
        />
      </div>
      <div className="flex flex-column">
        <Button className="mb-1" label="Войти" onClick={handleSubmit(onSumbit)}/>
        <Button outlined label="Регистрация" onClick={() => toggleCard()}/>
      </div>
    </form>
  )
}