/**
 * Базовый класс для всех сервисов API
 */
export abstract class Api {
  protected abstract prefix: string;

  /**
   * @param {string} host URL сервера с экземпляром kontur-client
   */
  constructor(private host: string) {
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
      const request = new Request(this.host + this.prefix + path, init)
      const response = await fetch(request)
      if (response.ok) return response.json()
      throw new Error(response.status.toString())
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
