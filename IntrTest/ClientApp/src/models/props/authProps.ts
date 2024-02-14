import { Dispatch, ReactNode, SetStateAction } from "react";
import { UseFormProps, UseFormReturn } from "react-hook-form";

export interface AuthProps {
  formInfo: UseFormReturn,
  toggleCard: () => void
  getFormErrorMessage: (str: string) => React.JSX.Element
}