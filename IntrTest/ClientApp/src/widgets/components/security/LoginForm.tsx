import { LoginDTO } from "entities/auth"
import { AuthProps } from "entities/props"
import { Button } from "primereact/button"
import { Card } from "primereact/card"
import { InputText } from "primereact/inputtext"
import { Password } from "primereact/password"
import React, { useState } from "react"
import { Controller, useForm } from "react-hook-form";
import { getFormErrorMessage } from "shared/components"

export const LoginForm = ({formInfo, toggleCard, isLoading, authFunc} : AuthProps) => {
  const { control, formState: { errors }, handleSubmit } = formInfo;
  
  const onSubmit = async(data) => {

    let loginData: LoginDTO = {
      login: data.login,
      password: data.password
    }
    
    await authFunc(loginData, true)
  }


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
              {getFormErrorMessage(field.name, errors)}
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
              {getFormErrorMessage(field.name, errors)}
            </>
          }}
        />
      </div>
      <div className="flex flex-column">
        <Button loading={isLoading} className="mb-1" label="Войти" onClick={handleSubmit(onSubmit)}/>
        <Button disabled={isLoading} outlined label="Регистрация" onClick={() => toggleCard()}/>
      </div>
    </form>
  )
}