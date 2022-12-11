import { Api } from "./Api";
import { Client, KonturAccount } from "../types";
import { PaymentFormRequestResponse } from "./PaymentApi";
import { AuthApi } from "./AuthApi";

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

/**
 * Содержит методы для получения и обновления информации о клиенте
 */
export class ClientApi extends Api {
    path = '/client';

    auth: AuthApi<Client> = new AuthApi(this.host, '/client/auth')

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
