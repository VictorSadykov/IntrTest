import { Drink } from "entities/drink";
import { Toast } from "primereact/toast";
import { Dispatch, MutableRefObject, SetStateAction } from "react";

export interface DrinkDialogProps {
  visible: boolean,
  setVisible: Dispatch<SetStateAction<boolean>>
  toastRef: MutableRefObject<Toast>
  drinkForEdition: Drink | null,
  setDrinkForEdition: Dispatch<SetStateAction<Drink>>
  updateDrinks: () => Promise<void>
}