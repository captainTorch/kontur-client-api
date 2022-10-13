export abstract class Api {
  protected abstract module: string;

  constructor(private host: string) {
  }

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
      const request = new Request(this.host + this.module + path, init)
      const response = await fetch(request)
      if (response.ok) return response.json()
      throw new Error(response.status.toString())
  }

  protected get (path = ''): Promise<unknown> {
      return this.request(path, 'GET')
  }

  protected post (path = '', params: Record<string, unknown>): Promise<unknown> {
      return this.request(path, 'POST', params)
  }
}
