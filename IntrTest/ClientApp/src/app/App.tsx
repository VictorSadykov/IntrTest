import React, { Component, useContext, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import {RouterProvider} from 'react-router-dom'
import "primereact/resources/themes/saga-blue/theme.css"
import "primereact/resources/primereact.min.css";
import "primeflex/primeflex.css";    
import 'primeicons/primeicons.css';   
import { Context } from 'index';
import { NAV_LOGIN } from 'shared/routes/pageRoutes';
import { router } from 'shared/routes/router';
import { observer } from 'mobx-react-lite';


export const App = observer(() => {
  const {store} = useContext(Context)

  useEffect(() => {

    (async () => {
      await store.checkAuth()
    })()

  }, [])
  
  if (store.isLoading) {
    return <div>Загрузка...</div> //Loader
  }

  if (!store.isAuth) {
    <Navigate replace to={NAV_LOGIN} />
  }

  return (
    <RouterProvider router={router} />
  );

})
