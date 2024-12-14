import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DeleteAccountForm, LoginForm, RegisterForm} from '../../../interfaces/http/account';
import {ResponseDTO} from '../../../interfaces/http/api';
import {
  ANON_BASE,
  ANON_REGISTER,
  AUTH_BASE,
  AUTH_LOGIN,
  AUTH_LOGOUT,
  BASE,
  PATH,
  USER_BASE,
  V1
} from '../../../utils/apiRoutes';

@Injectable({
  providedIn: 'root'
})
export class AccountHttpService {
  private httpClient = inject(HttpClient);

  public login(data: LoginForm) {
    return this.httpClient.post(`${PATH + BASE + V1 + AUTH_BASE + AUTH_LOGIN}?username=${data.email}&password=${data.password}`,
      {responseType: "text"}, // -> without this, cookies won't be set
      {withCredentials: true});
  }

  public logout() {
    return this.httpClient.post(`${PATH + BASE + V1 + AUTH_BASE + AUTH_LOGOUT}`,
      {responseType: "text"}, // -> without this, cookies won't be set
      {withCredentials: true});
  }

  public create(data: RegisterForm) {
    return this.httpClient.post<ResponseDTO>(`${PATH + BASE + V1 + ANON_BASE + ANON_REGISTER}`, data);
  }

  public delete(data: DeleteAccountForm) {
    return this.httpClient.delete<ResponseDTO>(`${PATH + BASE + V1 + USER_BASE}?id=${data.userId}&password=${data.password}`,
      {withCredentials: true});
  }
}
