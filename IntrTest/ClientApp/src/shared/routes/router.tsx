import { RouteAnonymous } from "app/hoc/routeAnonymous";
import { RouteAuth } from "app/hoc/routeAuth";
import { IndexPage } from "pages/IndexPage";
import React from "react";
import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import { LayoutCommon } from "shared/components";

export const router = createBrowserRouter(createRoutesFromElements(
  <>
    <Route path='/' element={<RouteAuth jsx={<LayoutCommon />} />}>
      <Route index element={<RouteAuth jsx={<IndexPage/>} />} />
    </Route>
    <Route path='/security' element={<RouteAnonymous jsx={<LayoutCommon />} />}>
      <Route path='login' element={<RouteAuth jsx={<IndexPage/>} />} />
    </Route>
  </>))