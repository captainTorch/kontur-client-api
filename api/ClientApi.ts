import { Api } from "./Api";
import { Client, KonturAccount, TransactionStatus } from "../types";
import { PaymentFormRequestResponse } from "./PaymentApi";
import { AuthApi } from "./AuthApi";
import { io, Socket } from "socket.io-client";

export type CreateAccountParams = {
    name: string,
    isMutable?: boolean,
    isRefillable?: boolean
}

export type AttachAccountParams = CreateAccountParams & {
    code: string
}

export type CreateRefilledAccountParams = CreateAccountParams & {
    amount: number,
    currency: string,
    callbackUrl: string
}

export type AccountResponse = {
    accountId: string
}

type RefillSuccessfulEventListener = (payload: { accountId: string, amount: number }) => void;
type RefillFailedPaymentGateListener = (payload: { accountId: string, transactionId: string }) => void;
type RefillFailedKonturListener = (payload: { accountId: string, paymentGateId: string, transactionId: string }) => void;
type TransactionStatusChangedEventListener = (payload: { transactionId: string, transactionStatus: TransactionStatus }) => void;

export type ServerToClientEvents = {
    'refill-successful': (event: string) => void,
    'refill-failed-kontur': (event: string) => void,
    'refill-failed-payment-gate': (event: string) => void,
    'transaction-status-changed': (event: string) => void
}

export type ClientToServerEvents = Record<string, never>

/**
 * Содержит методы для получения и обновления информации о клиенте
 */
export class ClientApi extends Api {
    path = '/client';

    auth: AuthApi<Client> = new AuthApi(
      this.host, 
      '/client/auth',
      () => this.connectEventBus(),
      () => this.disconnectEventBus()
    )
    socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

    /**
     * @param {string} host URL сервера с экземпляром kontur-client
     */
    constructor(host: string) {
        super(host);
        if (this.token) this.connectEventBus();
    }

    /**
     * @internal
     * @returns {string | null} Bearer токен, хранящийся в localStorage
     */
    private get token (): string | null {
        return localStorage.getItem('accessToken');
    }

    /**
     * @internal
     */
    private connectEventBus () {
        if (!this.token) {
            console.error('Unable to connect to event bus, no bearer token stored')
            return
        }
        this.socket = io(
          this.host + '/client', {
              transports: ['polling', 'websocket'],
              extraHeaders: { Authorization: `Bearer ${this.token}` }
          }
        )
    }
    
    /**
     *
     * @param {TransactionStatusChangedEventListener} listener Обработчик события изменения статуса транзакции
     */
    public onTransactionStatusChanged (listener: TransactionStatusChangedEventListener) {
        this.socket?.on('transaction-status-changed', payload => listener(JSON.parse(payload)))
    }

    /**
     *
     * @param {TransactionStatusChangedEventListener} listener Обработчик события пополнения аккаунта
     */
    public onRefillSuccessful (listener: RefillSuccessfulEventListener) {
        this.socket?.on('refill-successful', payload => listener(JSON.parse(payload)))
    }

    /**
     *
     * @param {TransactionStatusChangedEventListener} listener Обработчик события пополнения аккаунта
     */
    public onRefillFailedPaymentGate (listener: RefillFailedPaymentGateListener) {
        this.socket?.on('refill-failed-payment-gate', payload => listener(JSON.parse(payload)))
    }

    /**
     *
     * @param {TransactionStatusChangedEventListener} listener Обработчик события пополнения аккаунта
     */
    public onRefillFailedKontur (listener: RefillFailedKonturListener) {
        this.socket?.on('refill-failed-kontur', payload => listener(JSON.parse(payload)))
    }


    /**
     * @internal
     */
    private disconnectEventBus () {
        this.socket?.close();
        this.socket = null;
    }

    /**
     * Позволяет определить, существует ли аккаунт, привязанный к данному номеру
     *
     * @param {string} phone Номер телефона
     * @returns {Promise<boolean>} true, если клиент зарегистрирован
     */
    public checkIfClientExists (phone: string): Promise<boolean> {
        return this.post('/exists-with-phone', { phone }) as Promise<boolean>
    }

    /**
     * Позволяет проверить, зарегистрирована ли карта с номером в системе Контур
     *
     * @param {string} card Номер карты
     * @returns {Promise<void>}
     */
    public checkIfCardExists (card: string): Promise<void> {
        return this.post('/check-card', { card }) as Promise<void>
    }
    
    /**
     * Позволяет изменить данные о клиенте в системе
     *
     * @param {Partial<Client>} params Обновленные данные пользователя
     * @returns {Promise<void>}
     */
    public update(params: Partial<Client>): Promise<void> {
        return this.post('/update', params) as Promise<void>
    }

    /**
     * Возвращает список аккаунтов Контур, привязанных к аккаунту текущего авторизованного пользователя
     *
     * @returns {Promise<KonturAccount[]>} список карт
     */
    public getAccounts (): Promise<KonturAccount[]> {
        return this.get('/accounts') as Promise<KonturAccount[]>
    }

    /**
     * Привязывает существующий аккаунт Контура к аккаунту клиента
     *
     * @param {AttachAccountParams} params Номер и имя карты
     * @returns {Promise<void>}
     */
    public attachAccount (params: AttachAccountParams): Promise<unknown> {
        return this.post('/accounts/attach', params) as Promise<unknown>
    }

    /**
     * Привязывает новый аккаунт Контура к аккаунту клиента
     *
     * @param {CreateAccountParams} params Имя карты
     * @returns {Promise<void>}
     */
    public createAccount (params: CreateAccountParams): Promise<AccountResponse> {
        return this.post('/accounts/create', params) as Promise<AccountResponse>
    }

    /**
     * Создает новый аккаунт Контура и привязывает его к аккаунту клиента
     * При успешном создании аккаунта создает в нем карту и перенаправляет пользователя
     * на платежный шлюз
     *
     * @param {CreateRefilledAccountParams} params Параметры запроса
     * @param {string} paymentGateId Идентификатор платежного шлюза
     * @returns {Promise<PaymentFormRequestResponse>} URL для перенаправления на оплату
     */
    public createRefilledAccount (
      params: CreateRefilledAccountParams,
      paymentGateId: string
    ): Promise<PaymentFormRequestResponse> {
        return this.post(`/accounts/create-refilled/${paymentGateId}`, params) as Promise<PaymentFormRequestResponse>
    }
}
