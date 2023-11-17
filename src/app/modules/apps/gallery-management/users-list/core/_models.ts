import {Response} from '../../../../../../_metronic/helpers'

export type images = {
  _id?: string
  path: string
  title: string
}

export type User = {
  id?: string
  category?: string
  images?: images[]
  isActive?: boolean
  slug?: string
  createdAt?: Date
  description?: string
}

export type UsersQueryResponse = Response<Array<User>>

export const initialUser: User = {
  category: 'Administrator',
  slug: '',
}
