import {Response} from '../../../../../../_metronic/helpers'

export type User = {
  amount?: number
  percent?: number
  type?: string // You might want to replace 'string' with a specific type or enum if you have predefined pricing types
  rules?: string[]
  users?: string[]
  code?: string
  useNumber?: number
  activity?: boolean
  expiresAt?: Date
  id?: string
}

export type UsersQueryResponse = Response<Array<User>>

export const initialUser: User = {}
