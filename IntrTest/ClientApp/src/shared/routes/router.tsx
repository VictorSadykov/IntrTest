import { RouteAnonymous } from "app/hoc/routeAnonymous";
import { RouteAuth } from "app/hoc/routeAuth";
import { LoginPage, ShopPage } from "pages/index";
import React from "react";
import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import { LayoutCommon } from "shared/components";

export const router = createBrowserRouter(createRoutesFromElements(
  <>
    <Route path='/' element={<RouteAuth jsx={<LayoutCommon />} />}>
      <Route index element={<RouteAuth jsx={<ShopPage/>} />} />
    </Route>
    <Route path='/security' element={<RouteAnonymous jsx={<LayoutCommon />} />}>
      <Route path='login' element={<RouteAnonymous jsx={<LoginPage/>} />} />
    </Route>
  </>))