import { Api } from './Api'
import { Client, ClientBalance, ClientCard, Transaction } from "../types";

/**
 * Содержит методы для получения и обновления информации о клиенте
 */
export class ClientApi extends Api {
    module = '/client';

    /**
     * Позволяет проверить, зарегистрирована ли карта с номером в системе
     *
     * @param {string} card Номер карты
     * @returns {Promise<void>}
     */
    checkCard (card: string): Promise<void> {
        return this.post('/check-card', { card }) as Promise<void>
    }

    /**
     * Создает новый аккаунт клиента, связанный с аккаунтом в системе Контур
     *
     * @param {string} card Номер карты
     * @param {string} password Пароль
     * @returns {Promise<void>}
     */
    register (card: string, password: string): Promise<void> {
        return this.post('/register', { card, password }) as Promise<void>
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
