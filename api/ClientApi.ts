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
 * Содержит методы для получения и обновления информации о клиенте
 */
export class ClientApi extends Api {
    module = '/client';

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
    authorize (username: string, password: string): Promise<Client> {
        return (this.post('/auth', {username, password}) as Promise<{ accessToken: string }>)
            .then(({ accessToken }) => localStorage.setItem('accessToken', accessToken))
            .then(() => this.getAuthorized())
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
    public logOut (): void {
        localStorage.removeItem('accessToken')
    }
}
