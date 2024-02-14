import { AxiosResponse } from "axios";
import { LoginDTO, RegisterDTO, TokenResponceDTO } from "models/auth";
import $api from "shared/api/axiosInstance"
import { AUTH_LOGIN_ROUTE, AUTH_LOGOUT_ROUTE, AUTH_REFRESH_TOKEN_ROUTE, AUTH_REGISTER_USER_ROUTE } from "shared/routes/apiRoutes/authRoutes";
import { API_AUTH } from "shared/routes/apiRoutes/routes";
import tokenService from "./token.service";

class AuthService {

  async login({login,password,}: LoginDTO): Promise<AxiosResponse<TokenResponceDTO>> {
    return await $api.post<TokenResponceDTO>(`${API_AUTH}${AUTH_LOGIN_ROUTE}`, {
      login,
      password,
    });
  }

  async registerUser({login, password, passwordReply}: RegisterDTO) {
    return await $api.post<TokenResponceDTO>(`${API_AUTH}${AUTH_REGISTER_USER_ROUTE}`, {
      login,
      password,
      passwordReply
    })
  }

  async logout(): Promise<void> {
    return await $api.post(`${API_AUTH}${AUTH_LOGOUT_ROUTE}`)
  }


  async checkAuth() {
    if (tokenService.getAccessToken()) {
      const response = await $api.post<TokenResponceDTO>(
        `${API_AUTH}${AUTH_REFRESH_TOKEN_ROUTE}`,
        {
          accessToken: tokenService.getAccessToken(),
          refreshToken: tokenService.getRefreshToken(),
        },
        { withCredentials: true }
      );

      tokenService.setAccessToken(response.data.accessToken);
      tokenService.setRefreshToken(response.data.refreshToken);
      return true;
    }
    return false;
  }
}

export default new AuthService()