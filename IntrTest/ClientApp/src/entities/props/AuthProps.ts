import { LoginDTO, RegisterDTO } from "entities/auth";
import { Dispatch, ReactNode, SetStateAction } from "react";
import { UseFormProps, UseFormReturn } from "react-hook-form";
import Store from "shared/store/store";

export interface AuthProps {
  formInfo: UseFormReturn,
  toggleCard: () => void
  getFormErrorMessage: (str: string) => React.JSX.Element
  isLoading: boolean
  authFunc: (authData: LoginDTO | RegisterDTO, isLoginFunc: boolean) => Promise<void>
}