import { Api } from './Api'
import { Client, ClientBalance, ClientCard, Gender, Transaction } from "../types";

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
    code: number;
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

/**
 * Содержит методы для получения и обновления информации о клиенте
 */
export class ClientApi extends Api {
    module = '/client';

    /**
     * Позволяет получить проверочный код для авторизации по номеру телефона
     *
     * @param {GetAuthCodeParams} params Номер телефона
     * @returns {string} Проверочный код
     */
    getAuthCode (params: GetAuthCodeParams): Promise<number> {
        return this.post('/get-auth-code', params) as Promise<number>
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
     * Создает новый аккаунт клиента
     * По умалчанию не привязывает его к системе Контур
     *
     * @param {SignUpParams} params Параметры запроса
     * @returns {Promise<Client>} Созданный аккаунт
     */
    signUp (params: SignUpParams): Promise<Client> {
        return this.post('/sign-up', params) as Promise<Client>
    }

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
     * Возвращает все транзакции текущего авторизованного клиента
     *
     * @returns {Promise<Transaction[]>} Список транзакций
     */
    getTransactions (): Promise<Transaction[]> {
        return this.get('/transactions') as Promise<Transaction[]>
    }

    /**
     * Возвращает список карт, привязанных к аккаунту текущего авторизованного пользователя
     *
     * @returns {Promise<ClientCard[]>} список карт
     */
    getCards (): Promise<ClientCard[]> {
        return this.get('/cards') as Promise<ClientCard[]>
    }

    /**
     * Возвращает счета текущего авторизованного пользователя, сгруппированные по валютам
     *
     * @returns {Promise<ClientBalance[]>} список счетов
     */
    getBalance (): Promise<ClientBalance[]> {
        return this.get('/balance') as Promise<ClientBalance[]>
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
        localStorage.setItem('accessToken', accessToken);
        return this.getAuthorized();
    }
}
