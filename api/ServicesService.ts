import { ApiService } from './ApiService'
import { CategoryDto } from '../dto'

export class ServicesService extends ApiService {
  module = '/services'

  loadTree (rootCategoryId: number): Promise<CategoryDto> {
      return this.post('/tree', { rootCategoryId }) as Promise<CategoryDto>
  }
}
