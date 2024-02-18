import { Toast } from "primereact/toast";
import { Dispatch, MutableRefObject, SetStateAction } from "react";

export interface MyToastProps{
  visible: boolean,
  setVisible: Dispatch<SetStateAction<boolean>>
  toastRef: MutableRefObject<Toast>
  userId: string
}