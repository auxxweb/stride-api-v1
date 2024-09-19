import { FilterQuery, QueryOptions } from 'mongoose'
import Industry from './industry.model.js'

export interface IndustryData {
  name?: string
  image?: string
  isDeleted?: boolean
}

export interface GetAllIndustriesData {
  query: FilterQuery<typeof Industry>
  options?: QueryOptions
}
