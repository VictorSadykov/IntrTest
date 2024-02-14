import React, { useState } from "react"
import "../css/LoginPage.css"
import { LoginForm, RegistrationForm } from "widgets/index"
import { useForm } from "react-hook-form";
import { Card } from "primereact/card";

export const LoginPage = () => {
  const formInfo = useForm();
  const [isLoginToShow, setIsLoginToShow] = useState<boolean>()

  const toggleCard = () => {
    setIsLoginToShow((prev) => {
      return prev ? false : true
    })

    formInfo.reset()
    formInfo.clearErrors()
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
            
          /> :
          <RegistrationForm
            formInfo={formInfo}
            toggleCard={toggleCard}
            getFormErrorMessage={getFormErrorMessage}
          />
        }
      </Card>
    </div>
  )
}