import { InsertCoinsDTO } from "./InsertCoinsDTO";

export interface CoinChangeDTO {
  currentUserBalance: number,
  changeInSum: number,
  coinsOuted: InsertCoinsDTO[]
}