import { Toast } from "primereact/toast";
import { Dispatch, MutableRefObject, SetStateAction } from "react";

export interface MyDialogProps{
  visible: boolean,
  setVisible: Dispatch<SetStateAction<boolean>>
  toastRef: MutableRefObject<Toast>
  userId: string
  updateUserBalance: (string) => Promise<void>
}