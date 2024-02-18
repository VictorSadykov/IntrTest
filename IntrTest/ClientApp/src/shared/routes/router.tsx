import { RouteAnonymous } from "app/hoc/routeAnonymous";
import { RouteAuth } from "app/hoc/routeAuth";
import { AdminPage, LoginPage, ShopPage } from "pages/index";
import React from "react";
import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import { LayoutCommon, LayoutSecurity } from "shared/components";

export const router = createBrowserRouter(createRoutesFromElements(
  <>
    <Route path='/' element={<RouteAuth jsx={<LayoutSecurity />} />}>
      <Route path="admin" element={<RouteAuth jsx={<AdminPage />} />} />
      <Route index element={<RouteAuth jsx={<ShopPage />} />} />
    </Route>
    <Route path='/security' element={<RouteAnonymous jsx={<LayoutCommon />} />}>
      <Route path='login' element={<RouteAnonymous jsx={<LoginPage />} />} />
    </Route>
  </>))