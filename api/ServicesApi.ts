import { Api } from './Api'
import { CategoryDto } from '../dto'

export class ServicesApi extends Api {
  module = '/services'

  loadTree (rootCategoryId: number): Promise<CategoryDto> {
      return this.post('/tree', { rootCategoryId }) as Promise<CategoryDto>
  }
}
