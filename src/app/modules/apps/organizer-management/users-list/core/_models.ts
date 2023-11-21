import {Response} from '../../../../../../_metronic/helpers'

export type Address = {
  state: string | {_id: string; name: string} // It seems that state and city can be an object or just a string, based on the toJSON transformation
  city: string | {_id: string; name: string}
  address: string
  longitude?: number
  latitude?: number
}

export type Details = {
  address: Address
  emails: string[]
  phoneNumbers: string[]
}

export type Socials = {
  facebook: string
  twitter: string
  linkedIn: string
  whatsapp: string
  telegram: string
}

export type User = {
  id?: string
  name?: string
  logo?: string
  link?: string
  isMain?: boolean
  details?: Details
  socials?: Socials
  createdAt?: Date
  updatedAt?: Date
  description?: string
}

export type UsersQueryResponse = Response<Array<User>>

export const initialOrganizer: User = {
  name: '',
  logo: '',
  details: {
    address: {
      state: '',
      city: '',
      address: '',
    },
    emails: [],
    phoneNumbers: [],
  },
  socials: {
    facebook: '',
    twitter: '',
    linkedIn: '',
    whatsapp: '',
    telegram: '',
  },
}
