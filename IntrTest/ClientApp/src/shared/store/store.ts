import { makeAutoObservable } from 'mobx'
import { LoginDTO } from 'models/auth';
import authService from 'shared/services/auth.service';
import tokenService from 'shared/services/token.service';

export default class Store {
  isAuth = false;
  

  constructor() {
    makeAutoObservable(this)
  }

  setAuth(bool: boolean) {
    this.isAuth = bool
  }

  async login({userName, password}: LoginDTO){
    const response = await authService.login({userName, password})
    tokenService.setAccessToken(response.data.accessToken)
    tokenService.setRefreshToken(response.data.refreshToken)
    this.setAuth(true)
  }

  async logout() {
    const response = await authService.logout()
    tokenService.clearTokens()
    this.setAuth(false)
  }

  async checkAuth() {
    this.setAuth(await authService.checkAuth())
  }
}