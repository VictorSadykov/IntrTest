import { RegisterDTO } from "models/auth";
import { AuthProps } from "models/props";
import { Button } from "primereact/button";
import { Card } from "primereact/card"
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import React from "react"
import { Controller, useForm } from "react-hook-form"

export const RegistrationForm = ({ formInfo, toggleCard, getFormErrorMessage, isLoading, authFunc }: AuthProps) => {
  const { control, formState: { errors }, handleSubmit } = formInfo;

  const onSubmit = async (data) => {   

    let registerData: RegisterDTO = {
      login: data.login,
      password: data.password,
      passwordReply: data.passwordReply
    }

    await authFunc(registerData, false)
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
              {getFormErrorMessage(field.name)}
            </>
          }}
        />
        <Controller
          name="password"
          control={control}
          rules={{ required: 'Заполните обязательное поле', minLength: { value: 6, message: "Пароль должен состоять минимум 6 символов" } }}
          render={({ field, fieldState }) => {
            return <>
              <Password
                id={field.name}
                value={field.value}
                toggleMask
                feedback={false}
                onChange={e => field.onChange(e.target.value)}
                className="mb-2"
                placeholder="Пароль" />
              {getFormErrorMessage(field.name)}
            </>
          }}
        />
        <Controller
          name="passwordReply"
          control={control}
          rules={{
            required: 'Заполните обязательное поле',
            validate: (val: string) => {
              if (formInfo.watch('password') !== val) {
                return 'Пароли не совпадают'
              }
            }
          }}
          render={({ field, fieldState }) => {
            return <>
              <Password
                id={field.name}
                value={field.value}
                toggleMask
                feedback={false}
                onChange={e => field.onChange(e.target.value)}
                placeholder="Повтор пароля" />
              {getFormErrorMessage(field.name)}
            </>
          }}
        />
      </div>
      <div className="flex flex-column">
        <Button loading={isLoading} className="mb-1" label="Зарегистрироваться" onClick={handleSubmit(onSubmit)} />
        <Button disabled={isLoading} outlined label="Авторизация" onClick={() => toggleCard()} />
      </div>
    </form>
  )
}