  import {Response} from '../../../../../../_metronic/helpers'

  // Define a type for PricingRule
  export type PricingRule = {
    _id?: string
    name?: string
    description?: string
    number?: number
    price?: number
    additionalInfo?: any // Adjust the type according to your needs
  }

  export type User = {
    id?: string
    type?: string // Assuming type is a string, e.g., 'article'
    rules?: Array<PricingRule>
    createdAt?: Date
  }

  export type UsersQueryResponse = Response<Array<User>>

  export const initialUser: User = {
    type: 'article',
    rules: [], // Initialize with an empty array of rules or default values
  }
