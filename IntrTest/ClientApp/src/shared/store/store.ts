import { makeAutoObservable } from 'mobx'
import { LoginDTO, RegisterDTO } from 'models/auth';
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
      console.error(ex)
    }
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