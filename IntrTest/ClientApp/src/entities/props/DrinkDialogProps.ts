import { Dispatch, SetStateAction } from "react";

export interface DrinkDialogProps {
  visible: boolean,
  setVisible: Dispatch<SetStateAction<boolean>>
}