import { AxiosError } from 'axios';
import { makeAutoObservable } from 'mobx'
import { LoginDTO, RegisterDTO } from 'entities/auth';
import { MutableRefObject } from 'react';
import authService from 'shared/services/auth.service';
import tokenService from 'shared/services/token.service';
import {Toast} from 'primereact/toast'

export default class Store {
  isAuth = false;
  globalToast = null;
  isLoading = true;
  

  constructor() {
    makeAutoObservable(this)
  }

  setAuth(bool: boolean) {
    this.isAuth = bool
  }

  setGlobalToast(toast: MutableRefObject<Toast>) {
    this.globalToast = toast
  }

  setLoading(bool: boolean) {
    this.isLoading = bool;
  }

  async login(data: LoginDTO){
    const response = await authService.login(data)
    tokenService.setAccessToken(response.data.accessToken)
    tokenService.setRefreshToken(response.data.refreshToken)
    this.setAuth(true)
  }

  async registerUser(data: RegisterDTO) {
    try {
      const response = await authService.registerUser(data)
      return response
    } catch (ex) {
      throw (ex as AxiosError)?.response
    }
  }

  async logout() {
    const response = await authService.logout()
    tokenService.clearTokens()
    this.setAuth(false)
  }

  async checkAuth() {
    this.setLoading(true);
        try {
            console.log(3)
            this.setAuth(await authService.checkAuth());
        }
        catch (ex) {
        }
        finally {
            this.setLoading(false);
        }
  }
}