import { Card } from "primereact/card"
import React, { useEffect, useRef, useState } from "react"
import { TabView, TabPanel } from 'primereact/tabview';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import PaidIcon from '@mui/icons-material/Paid';
import { CoinPanel } from "widgets/components/CoinPanel";
import { Toast } from "primereact/toast";
import { DrinkPanel } from "widgets/components/DrinkPanel";
import { IUserInfo } from "entities/user";
import authService from "shared/services/auth.service";
import { ROLE_ADMIN } from "shared/const/role";
import { useNavigate } from "react-router-dom";



export const AdminPage = () => {
  const toast = useRef(null)

  const [user, setUser] = useState<IUserInfo>()
  const navigate = useNavigate()
  useEffect(() => {
    (async () => {
      const resp = await authService.getUser()
      if(!resp.role.includes(ROLE_ADMIN)) {
        navigate("/")
      }
    })()
  }, [])
  
  return (
    <>
      <Toast ref={toast} position="bottom-right"/>
      <div className="flex justify-content-center admin_box">
        <div style={{ marginTop: '50px', minWidth: '80%' }}>
          <h1 className="mb-2">Админ панель</h1>
          <Card className="shadow-4" style={{ minWidth: '100%', minHeight: '1400px' }}>
            <TabView>
              <TabPanel header="Напитки" leftIcon={<LocalDrinkIcon className="mr-2" />}>
                <DrinkPanel toastRef={toast}/>
              </TabPanel>
              <TabPanel header="Монеты" leftIcon={<PaidIcon className="mr-2" />}>
                <CoinPanel toastRef={toast}/>
              </TabPanel>
            </TabView>
          </Card>
        </div>
      </div>
    </>

  )
}