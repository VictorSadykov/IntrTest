import { CoinChangeDTO, InsertCoinsDTO } from "entities/coin";
import { giveChangeAsync } from "entities/coin/api/giveChangeAsync";
import { ChangeDialogProps } from "entities/props";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { ProgressSpinner } from "primereact/progressspinner";
import React, { useEffect, useState } from "react";

export const ChangeDialog = ({ visible, setVisible, toastRef, userId, userBalance, updateUserBalance }: ChangeDialogProps) => {
  const [isLoading, setIsLoading] = useState<boolean>()
  const [changeCoins, setChangeCoins] = useState<InsertCoinsDTO[]>()
  const [changeInSum, setChangeInSum] = useState<number>()
  const [startBalance, setStartBalance] = useState<number>()
  const [currentBalance, setCurrentBalance] = useState<number>()

  useEffect(() => {
    if (visible) {
      (async () => {
        setIsLoading(true)
        try {
          var resp = await giveChangeAsync(userId)
          updateChangeInfo(resp)
          updateUserBalance(userId)
          toastRef.current.show({severity: "success", summary: "Сдача выдана"})
        } catch (ex) {
          console.error(ex)
          toastRef?.current?.show({ severity: "error", summary: "Ошибка на стороне сервера." })
          setVisible(false)
        }
        setIsLoading(false)
      })()
    }
  }, [visible])

  const updateChangeInfo = (coinChangeInfo : CoinChangeDTO) => {
    setStartBalance(userBalance)
    setChangeInSum(coinChangeInfo.changeInSum)
    setCurrentBalance(coinChangeInfo.currentUserBalance)
    setChangeCoins(coinChangeInfo.coinsOuted)
  }

  const footerContent = (
    <div>
      <Button severity="danger" label="Отмена" onClick={() => setVisible(false)} />
    </div>
  )

  return (
    <Dialog style={{ minWidth: '800px' }} header={"Ваша сдача"} visible={visible} onHide={() => setVisible(false)} footer={footerContent}>
      {isLoading
        ? <ProgressSpinner />
        :
        <div>
          <div className="mb-2">Ваш первоначальный баланс: {startBalance} ₽</div>
          <div className="mb-2">Выданная сумма: {changeInSum} ₽</div>
          {startBalance - changeInSum !== 0 && <div className="mb-2" style={{ color: 'red' }}>Монет в автомате не хватило для выдачи полной суммы</div>}
          <div className="mb-2">Ваш текущий баланс: {currentBalance} ₽</div>
          <div>Вы получили:
            <ul>
              {changeCoins?.map(item => {
                return <li key={item.value}>{item.amount} шт. по {item.value} ₽</li>
              })}
            </ul>
          </div>
        </div>
      }
    </Dialog>
  )


}