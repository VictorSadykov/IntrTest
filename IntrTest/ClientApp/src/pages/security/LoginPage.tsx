import React, { useContext, useRef, useState } from "react"
import "../css/LoginPage.css"
import { LoginForm, RegistrationForm } from "widgets/index"
import { useForm } from "react-hook-form";
import { Card } from "primereact/card";
import { Context } from "index";
import { LoginDTO, RegisterDTO } from "entities/auth";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "shared/routes/apiRoutes/routes";

export const LoginPage = () => {
  const formInfo = useForm();
  const [isLoginToShow, setIsLoginToShow] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>()
  const toast = useRef(null)
  const { store } = useContext(Context)
  const navigate = useNavigate()

  const toggleCard = () => {
    setIsLoginToShow((prev) => {
      return prev ? false : true
    })
    formInfo.reset()
    formInfo.clearErrors()
  }

  const auth = async (authData: LoginDTO | RegisterDTO, isLoginFunc: boolean) => {
    setIsLoading(true)

    if (isLoginFunc) {
      await login(authData as LoginDTO)
    } else {
      await register(authData as RegisterDTO)
    }

    setIsLoading(false)
  }

  const register = async (authData: RegisterDTO) => {
    try {
      const resp = await store.registerUser(authData as RegisterDTO)

      if (resp.status === 200) {
        toast.current.show({ severity: "success", summary: "Вы успешно зарегестрировались" })
        toggleCard()
      }
    } catch (error) {
      console.error(error)

      if (error?.data?.regError[0] === "Пользователь с таким логином уже существует") {
        toast.current.show({ severity: "error", summary: error?.data?.regError[0] })
      } else {
        toast.current.show({ severity: "error", summary: "Ошибка на стороне сервера" })
      }
    }
  }

  const login = async (authData: LoginDTO) => {
    try {
      const resp = await store.login(authData as LoginDTO)

      if (store.isAuth) {
        navigate(BASE_URL);
      }

    } catch (error) {
      if (error?.response?.data?.loginError[0] == "Неверное имя пользователя или пароль") {
        toast.current.show({ severity: "error", summary: error?.response?.data?.loginError[0] })
      } else {
        toast.current.show({ severity: "error", summary: "Ошибка на стороне сервера" })
      }
    }
  }

  const getFormErrorMessage = (name: string): React.JSX.Element => {
    const errors = formInfo.formState.errors;
    return errors[name] ? <small className="p-error mb-2">{(errors as any)[name].message}</small> : <small className="p-error mb-2">&nbsp;</small>;
  }



  return (
    <>
      <Toast ref={toast} position="bottom-right" />
      <div className="login_card flex flex justify-content-center align-items-center">
        <Card className="p-3 shadow-4" style={{ minWidth: '500px' }} title={isLoginToShow ? "Авторизация" : "Регистрация"}>
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
    </>
  )
}