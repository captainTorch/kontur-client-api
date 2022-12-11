import { Api } from './Api'
import { Category } from '../types'

/**
 * Содержит методы для получения информации об услугах, предлагаемых клиенту
 */
export class ServicesApi extends Api {
  path = '/services'

  /**
   * @param {number} rootCategoryId id корневой категории
   * @returns {Promise<Category>} услуги в виде дерева
   */
  loadTree (rootCategoryId: number): Promise<Category> {
      return this.post('/tree', { rootCategoryId }) as Promise<Category>
  }
}
