/**
 * Базовый класс для всех сервисов API
 */
export abstract class Api {
  protected abstract path: string;

  /**
   * @param {string} host URL сервера с экземпляром kontur-client
   */
  constructor(protected host: string) {
  }

  /**
   * @internal
   * @param {string} path URL запроса
   * @param {string} method метод HTTP
   * @param {Record<string, unknown>} body тело запроса
   */
  private async request (path: string, method: string, body?: Record<string, unknown>): Promise<unknown> {
      const headers = new Headers({
          'Content-Type': 'application/json'
      })
      const accessToken = localStorage.getItem('accessToken')
      if (accessToken) {
          headers.set('Authorization', `Bearer ${accessToken}`)
      }
      const init = {
          method,
          headers,
          body: JSON.stringify(body)
      }
      const request = new Request(this.host + this.path + path, init)
      let response;
      try {
        response = await fetch(request)
      } catch (e) {
        throw new Error('NETWORK_ERROR')
      }
      try {
        response = await response.json()
      } catch (e) {
        throw new Error('PARSE_RESPONSE_ERROR')
      }
      if ((response as Record<string, unknown>).error) {
        throw new Error(response.error)
      }
      throw new Error('UNKNOWN_ERROR')
  }

  /**
   * @internal
   * @param {string} path URL запроса
   * @returns {Promise} HTTP response
   */
  protected get (path = ''): Promise<unknown> {
      return this.request(path, 'GET')
  }

  /**
   * @internal
   * @param {string} path URL запроса
   * @param {Record} params Тело запроса
   * @returns {Promise} HTTP response
   */
  protected post (path = '', params: Record<string, unknown>): Promise<unknown> {
      return this.request(path, 'POST', params)
  }
}
