import { BoughtDrinkItemInfo } from "./BoughtDrinkItemInfo";
import { UserDrink } from "./UserDrink";

export interface BoughtDrinksInfo {
  currentUserBalance: number,
  totalBuySum: number,
  userDrinksBought: BoughtDrinkItemInfo[]
} 