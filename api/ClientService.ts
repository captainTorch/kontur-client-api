import { ApiService } from './ApiService'
import { ClientDto } from '../dto'

type ClientAuthParams = {
    username: string,
    password: string
}

export class ClientService extends ApiService {
    module = '/client';

    checkCard (card: string): Promise<void> {
        return this.post('/check-card', { card }) as Promise<void>
    }

    register (card: string, password: string): Promise<void> {
        return this.post('/register', { card, password }) as Promise<void>
    }

    authorize (params: ClientAuthParams): Promise<ClientDto> {
        return (this.post('/auth', params) as Promise<{ accessToken: string }>)
            .then(({ accessToken }) => localStorage.setItem('accessToken', accessToken))
            .then(() => this.getAuthorized())
    }

    getAuthorized (): Promise<ClientDto> {
        return this.get('/authorized') as Promise<ClientDto>
    }

    logOut (): void {
        localStorage.removeItem('accessToken')
    }
}
