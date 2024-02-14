import React, { useContext, useState } from "react"
import "../css/LoginPage.css"
import { LoginForm, RegistrationForm } from "widgets/index"
import { useForm } from "react-hook-form";
import { Card } from "primereact/card";
import { Context } from "index";
import { LoginDTO, RegisterDTO } from "models/auth";

export const LoginPage = () => {
  const formInfo = useForm();
  const [isLoginToShow, setIsLoginToShow] = useState<boolean>()
  const [isLoading, setIsLoading] = useState<boolean>()

  const {store} = useContext(Context)

  const toggleCard = () => {
    setIsLoginToShow((prev) => {
      return prev ? false : true
    })

    formInfo.reset()
    formInfo.clearErrors()
  }

  const auth = async(authData: LoginDTO | RegisterDTO, isLoginFunc: boolean) => {
    setIsLoading(true)
    try {
      if (isLoginFunc) {
        await store.login(authData as LoginDTO) 
      } else {
        await store.registerUser(authData as RegisterDTO)
      }
    } catch (error) {
      console.error(error)
    }

    setIsLoading(false)
  }

  const getFormErrorMessage = (name: string) : React.JSX.Element => {
    const errors = formInfo.formState.errors;
    return errors[name] ? <small className="p-error">{(errors as any)[name].message}</small> : <small className="p-error">&nbsp;</small>;
  }

  

  return (
    <div className="login_card flex flex justify-content-center align-items-center">
      <Card className="p-3" style={{ minWidth: '500px' }} title={isLoginToShow ? "Авторизация" : "Регистрация"}>
        {isLoginToShow ?
          <LoginForm
            formInfo={formInfo}
            toggleCard={toggleCard}
            getFormErrorMessage={getFormErrorMessage}
            isLoading={isLoading}
            authFunc={auth}
          /> :
          <RegistrationForm
            formInfo={formInfo}
            toggleCard={toggleCard}
            getFormErrorMessage={getFormErrorMessage}
            isLoading={isLoading}
            authFunc={auth}
          />
        }
      </Card>
    </div>
  )
}