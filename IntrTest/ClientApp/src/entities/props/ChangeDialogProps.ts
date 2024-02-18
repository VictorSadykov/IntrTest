import { Toast } from "primereact/toast"
import { Dispatch, MutableRefObject, SetStateAction } from "react"

export interface ChangeDialogProps{
  visible: boolean,
  setVisible: Dispatch<SetStateAction<boolean>>
  toastRef: MutableRefObject<Toast>
  userId: string
  userBalance: number
  updateUserBalance: (string) => Promise<void>
}