import { Api } from "./Api";
import { Client, User } from "../types";
import { io, Socket } from "socket.io-client";

/**
 * Параметры запроса для {@link AuthApi#useCode}
 */
export type UseCodeParams = {
  phone: number;
  code: string;
}

/**
 * Параметры запроса для {@link AuthApi#getCode}
 */
export type GetCodeParams = {
  /**
   * Номер телефона, на который будет отправлен проверочный код
   */
  phone: number
}

/**
 * Параметры ответа на успешный запрос авторизации
 */
export type AccessTokenResponse = {
  /**
   * JWT токен для аутентификации пользователя
   */
  accessToken: string;
}

type ServerToClientEvents = {
  'authorized': () => void,
  'loggedOut': () => void,
  'phoneTimeout': (phone: number, timeout: number) => void
}

type ClientToServerEvents = Record<string, never>

/**
 * Базовый класс, содержащий методы для авторизации разных ролей пользователей в системе
 */
export class AuthApi<T extends User> extends Api {

  /**
   * @param {string} host URL сервера с экземпляром kontur-client
   * @param {string} path endpoint
   */
  constructor(host: string, protected path: string) {
    super(host);
  }

  private socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(this.host + '/auth');

  /**
   * При наличии сессии на сервере возвращает авторизованного пользователя
   *
   * @returns {Promise<User>} Авторизованный пользователь
   */
  public getUser (): Promise<T> {
    return this.get('/') as Promise<T>
  }

  /**
   * В зависимости от настроек сервера отправляет SMS на указанный номер либо
   * совершает звонок-сброс для подтверждения какого-либо действия пользователя
   *
   * @param {GetCodeParams} params Номер телефона
   * @returns {Promise<number>} Время жизни кода в секундах
   */
  public async getCode (params: GetCodeParams): Promise<void> {
    await this.post('/get-code', params);
  }

  /**
   * При совпадении ранее высланного на номер кода (см. {@link AuthApi#getCode}) открывает сессию
   * В случае, если аккаунта с данным номером телефона еще нет в базе, создает новый аккаунт
   *
   * @param {UseCodeParams} params Номер телефона и код
   * @returns {Promise<Client>} Авторизованный клиент
   */
  public async useCode (params: UseCodeParams): Promise<T> {
    const token = await this.post('/use-code', params) as AccessTokenResponse
    return this.setTokenAndGetAuthorized(token);
  }

  /**
   * Завершает сессию пользователя
   */
  public logout (): void {
    localStorage.removeItem('accessToken');
  }

  /**
   * @param {(user: User) => any} listener Обработчик события входа в систему
   */
  public onUserAuthorized (listener: (user: T) => void) {
    this.socket.once('authorized', async () => listener(await this.getUser()))
  }

  /**
   * @param {() => any | void} listener Обработчик события выхода из системы
   */
  public onUserLoggedOut (listener: () => void) {
    this.socket.once('loggedOut', listener)
  }

  /**
   * @param {(phone: number, timeout: number) => void} listener Обработчик для таймера ожидания запроса кода
   */
  public onPhoneTimeout (listener: (phone: number, timeout: number) => void) {
    this.socket.once('phoneTimeout', listener)
  }

  /**
   * @internal
   * @param {AccessTokenResponse} params Ответ на запрос авторизации
   * @returns {Promise<Client>} Авторизованный пользователь
   */
  private async setTokenAndGetAuthorized({ accessToken }: AccessTokenResponse): Promise<T> {
    localStorage.setItem('accessToken', accessToken);
    return this.getUser();
  }
}