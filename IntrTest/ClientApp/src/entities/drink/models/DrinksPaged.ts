import { Drink } from "./Drink";

export interface DrinksPaged {
  currentPage: number,
  firstRowOnPage: number,
  lastRowOnPage: number,
  pageCount: number,
  pageSize: number,
  rowCount: number,
  results: Drink[]
}