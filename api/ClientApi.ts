import { Api } from './Api'
import { Client, Gender, KonturAccount } from "../types";
import { PaymentFormRequestResponse } from "./PaymentApi";

/**
 * Параметры запроса для {@link ClientApi#signUp | создания клиента}
 */
export type SignUpParams = {
    /**
     * Имя
     */
    firstName: string,
    /**
     * Фамилия
     */
    lastName: string,
    /**
     * Номер телефона в любом формате
     */
    phone: string,
    /**
     * Пароль пользователя. Не менее 8 символов, должен содержать буквы в верхнем и нижнем
     * регистре, цифры и символы.
     */
    password: string,
    /**
     * Электронная почта. Не обязательный параметр
     */
    email?: string,
    /**
     * Пол. Не обязательный параметр
     */
    gender?: Gender
}

/**
 * Параметры запроса для {@link ClientApi#signUpWithCard | импорта клиента}
 */
export type SignUpWithCardParams = {
    /**
     * Номер карты в системе Контур. Данные для регистрации клиента (телефон, почта и т.д.)
     * будут импортированы из аккаунта, связанного с этой картой.
     */
    card: string,
    /**
     * Пароль пользователя. Не менее 8 символов, должен содержать буквы в верхнем и нижнем
     * регистре, цифры и символы.
     */
    password: string
}

/**
 * Параметры запроса для {@link ClientApi#authWithCode}
 */
export type AuthWithCodeParams = {
    phone: number;
    code: string;
}

/**
 * Параметры запроса для {@link ClientApi#getAuthCode}
 */
export type GetAuthCodeParams = {
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

export type StoredPhoneCode = {
   phone: number,
   timeout: number,
   timestamp: number
}

const LOCAL_STORAGE_PHONES_KEY = 'checkedPhones';

/**
 * Содержит методы для получения и обновления информации о клиенте
 */
export class ClientApi extends Api {
    module = '/client';

    /**
     * Позволяет определить, существует ли аккаунт, привязанный к данному номеру
     *
     * @param {string} phone Номер телефона
     * @returns {Promise<boolean>} true, если клиент зарегистрирован
     */
    checkIfClientExists (phone: string): Promise<boolean> {
        return this.post('/exists-with-phone', { phone }) as Promise<boolean>
    }

    /**
     * В зависимости от настроек сервера отправляет SMS на указанный номер либо
     * совершает звонок-сброс для подтверждения какого-либо действия пользователя
     *
     * @param {GetAuthCodeParams} params Номер телефона
     * @returns {Promise<number>} Время жизни кода в секундах
     */
    async getAuthCode (params: GetAuthCodeParams): Promise<StoredPhoneCode> {
        const existing = this.getSentCodes().find(v => v.phone === params.phone);
        if (existing) {
            throw new Error(`Please, wait for ${existing.timeout} secs to send code again`);
        }
        const timeout = await this.post('/get-auth-code', params) as number;
        return this.setCodeSent(params.phone, timeout);
    }

    /**
     * Позволяет проверить, зарегистрирована ли карта с номером в системе Контур
     *
     * @param {string} card Номер карты
     * @returns {Promise<void>}
     */
    checkCard (card: string): Promise<void> {
        return this.post('/check-card', { card }) as Promise<void>
    }

    /**
     * При совпадении ранее высланного на номер кода (см. {@link ClientApi#getAuthCode}) открывает сессию
     * В случае, если аккаунта с данным номером телефона еще нет в базе, создает новый аккаунт
     *
     * @param {AuthWithCodeParams} params Номер телефона и код
     * @returns {Promise<Client>} Авторизованный клиент
     */
    async authWithCode (params: AuthWithCodeParams): Promise<Client> {
        const token = await this.post('/auth-with-code', params) as AccessTokenResponse
        return this.setTokenAndGetAuthorized(token);
    }

    /**
     * При наличии сессии на сервере возвращает авторизованного клиента
     *
     * @returns {Promise<Client>} Авторизованный клиент
     */
    getAuthorized (): Promise<Client> {
        return this.get('/authorized') as Promise<Client>
    }
    
    /**
     * Позволяет изменить данные о клиенте в системе
     *
     * @param {Partial<Client>} params Обновленные данные пользователя
     * @returns {Promise<void>}
     */
    update(params: Partial<Client>): Promise<void> {
        return this.post('/update', params) as Promise<void>
    }

    /**
     * Возвращает список аккаунтов Контур, привязанных к аккаунту текущего авторизованного пользователя
     *
     * @returns {Promise<KonturAccount[]>} список карт
     */
    getAccounts (): Promise<KonturAccount[]> {
        return this.get('/accounts') as Promise<KonturAccount[]>
    }

    /**
     * Привязывает существующий аккаунт Контура к аккаунту клиента
     *
     * @param {AttachAccountParams} params Номер и имя карты
     * @returns {Promise<void>}
     */
    attachAccount (params: AttachAccountParams): Promise<unknown> {
        return this.post('/accounts/attach', params) as Promise<unknown>
    }

    /**
     * Привязывает новый аккаунт Контура к аккаунту клиента
     *
     * @param {CreateAccountParams} params Имя карты
     * @returns {Promise<void>}
     */
    createAccount (params: CreateAccountParams): Promise<AccountResponse> {
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
    createRefilledAccount (
      params: CreateRefilledAccountParams,
      paymentGateId: string
    ): Promise<PaymentFormRequestResponse> {
        return this.post(`/accounts/create-refilled/${paymentGateId}`, params) as Promise<PaymentFormRequestResponse>
    }

    /**
     * Завершает сессию пользователя
     */
    logOut (): void {
        localStorage.removeItem('accessToken')
    }

    /**
     * @internal
     * @param {AccessTokenResponse} params Ответ на запрос авторизации
     * @returns {Promise<Client>} Авторизованный пользователь
     */
    private async setTokenAndGetAuthorized({ accessToken }: AccessTokenResponse): Promise<Client> {
        localStorage.removeItem(LOCAL_STORAGE_PHONES_KEY)
        localStorage.setItem('accessToken', accessToken);
        return this.getAuthorized();
    }

    /**
     * Возвращает сохраненные данные о телефонах, на которые высланы коды подтверждения
     *
     * @returns {StoredPhoneCode[]} Сохраненные данные
     */
    getSentCodes(): StoredPhoneCode[] {
        try {
            return JSON.parse(localStorage.getItem(LOCAL_STORAGE_PHONES_KEY) as string) || []
        } catch (e) {
            return [];
        }
    }

    /**
     * @param {number} phone Номер телефона
     * @param {number} timeout Время до следующего запроса кода
     * @returns {StoredPhoneCode} Сохраненные данные
     * @internal
     */
    private setCodeSent(phone: number, timeout: number): StoredPhoneCode {
        const code = {
            phone,
            timeout,
            timestamp: new Date().getTime()
        }
        this.saveSentCodes([...this.getSentCodes(), code]);
        setTimeout(() => this.saveSentCodes(
          this.getSentCodes().filter(p => p.phone !== phone)
        ), timeout * 1000);
        return code;
    }

    /**
     * @param {StoredPhoneCode} phones Сохраняет номера в localStorage
     * @internal
     */
    private saveSentCodes(phones: StoredPhoneCode[]): void {
        localStorage.setItem(LOCAL_STORAGE_PHONES_KEY, JSON.stringify(phones));
    }

    // TODO НЕ ТЕСТИРОВАЛОСЬ. ПРОВЕРИТЬ И ОБНОВИТЬ
    /**
     * Создает новый аккаунт клиента
     * По умалчанию не привязывает его к системе Контур
     *
     * @param {SignUpParams} params Параметры запроса
     * @returns {Promise<Client>} Созданный аккаунт
     */
    signUp (params: SignUpParams): Promise<Client> {
        return this.post('/sign-up', params) as Promise<Client>
    }

    // TODO НЕ ТЕСТИРОВАЛОСЬ. ПРОВЕРИТЬ И ОБНОВИТЬ
    /**
     * Создает новый аккаунт клиента, импортируя данные из аккаунта в системе Контур
     * Найденный аккаунт Контур будет автоматически привязан к аккаунту клиента
     *
     * @param {SignUpWithCardParams} params Параметры запроса
     * @returns {Promise<Client>} Созданный аккаунт
     */
    signUpWithCard (params: SignUpWithCardParams): Promise<Client> {
        return this.post('/sign-up-with-card', params) as Promise<Client>
    }

    // TODO НЕ ТЕСТИРОВАЛОСЬ. ПРОВЕРИТЬ И ОБНОВИТЬ
    /**
     * При успешной авторизации открывает сессию и возвращает объект с информацией о клиенте
     *
     * @param {string} username Email, номер телефона или логин
     * @param {string} password Пароль
     * @returns {Promise<Client>} Авторизованный клиент
     */
    async authWithPassword (username: string, password: string): Promise<Client> {
        const token = await this.post('/auth', {username, password}) as AccessTokenResponse;
        return this.setTokenAndGetAuthorized(token);
    }
}
