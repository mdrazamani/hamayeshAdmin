import {Response} from '../../../../../../_metronic/helpers'

// Define a type for PricingRule
export type PricingRule = {
  item?: string
  itemType?: string
  number?: number
}

export type User = {
  id?: string
  user?: string // Assuming type is a string, e.g., 'article'
  items?: Array<PricingRule>
  createdAt?: Date
}

export type UsersQueryResponse = Response<Array<User>>

export const initialUser: User = {
  user: '',
  items: [], // Initialize with an empty array of rules or default values
}
