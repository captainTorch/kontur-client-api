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
      if (!response.ok) {
        /* TODO
            Вот этот момент надо продумать. Если использовать http коды, можно проебаться -
            непонятно будет, пришел ответ 401, например, от сервера контур-клиента или до него
            запрос даже не дошел и это отработал nginx. По-хорошему, любой код кроме 200
            должен расцениваться как ошибка.
            На стороне сервера это можно реализовать так https://docs.nestjs.com/exception-filters
         */
        throw new Error(`HTTP_ERROR_${response.status.toString()}`)
      }
      try {
        response = await response.json()
      } catch (e) {
        throw new Error('PARSE_RESPONSE_ERROR')
      }
      if ((response as Record<string, unknown>).error) {
        throw new Error(response.error)
      }
      return response
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
