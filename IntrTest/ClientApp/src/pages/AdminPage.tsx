import { Card } from "primereact/card"
import React from "react"
import { TabView, TabPanel } from 'primereact/tabview';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import PaidIcon from '@mui/icons-material/Paid';



export const AdminPage = () => {
  return (
    <div className="flex justify-content-center">
      <div style={{marginTop: '50px', minWidth: '80%'}}>
        <h1>Админ панель</h1>
        <Card style={{ minWidth: '100%', minHeight: '1400px' }}>
          <TabView>
            <TabPanel header="Напитки" leftIcon={<LocalDrinkIcon className="mr-2" />}>

            </TabPanel>
            <TabPanel header="Монеты" leftIcon={<PaidIcon className="mr-2" />}>

            </TabPanel>
          </TabView>
        </Card>
      </div>
    </div>
  )
}