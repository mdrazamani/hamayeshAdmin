import axios, {AxiosResponse} from 'axios'
import {ID, Response} from '../../../../../../_metronic/helpers'
import changeFormat from '../../../../d-components/dateConverter'
import {User, UsersQueryResponse} from './_models'

const API_URL = process.env.REACT_APP_API_URL
const USER_URL = `${API_URL}/billing/pricing`
const GET_USERS_URL = `${API_URL}/billing/discount`
const TAGS_URL = `${API_URL}/news-tags`

const getUsers = (query: string): Promise<UsersQueryResponse> => {
  return axios.get(`${GET_USERS_URL}?${query}`).then((d) => d.data.data)
}

const getUserById = (slug: ID): Promise<User | undefined> => {
  return axios
    .get(`${GET_USERS_URL}/${slug}`)
    .then((response: AxiosResponse<Response<User>>) => response.data)
    .then((response: Response<User>) => response.data)
}

const createUser = (user: User): Promise<User | undefined> => {
  user['expiresAt'] = changeFormat(user['expiresAt'])
  user['percent'] = Number(user['percent'])
  user['amount'] = Number(user['amount'])
  return axios
    .post(GET_USERS_URL, user)
    .then((response: AxiosResponse<Response<User>>) => response.data)
    .then((response: Response<User>) => response.data)
}

const updateUser = (id, user: User): Promise<User | undefined> => {
  user['expiresAt'] = changeFormat(user['expiresAt'])
  user['amount'] = Number(user['amount'])
  return axios
    .patch(`${GET_USERS_URL}/${id}`, user)
    .then((response: AxiosResponse<Response<User>>) => response.data)
    .then((response: Response<User>) => response.data)
}

const deleteUser = (userId: ID): Promise<void> => {
  return axios.delete(`${GET_USERS_URL}/${userId}`).then(() => {})
}

const deleteSelectedUsers = (userIds: Array<ID>): Promise<void> => {
  const requests = userIds.map((id) => axios.delete(`${GET_USERS_URL}/${id}`))
  return axios.all(requests).then(() => {})
}

const getAllRules = () => {
  return axios.get(`${USER_URL}`).then((d) => d.data.data)
}

const getAllTags = () => {
  return axios.get(`${TAGS_URL}`).then((d) => d.data.data)
}

export {
  getUsers,
  deleteUser,
  deleteSelectedUsers,
  getUserById,
  createUser,
  updateUser,
  getAllRules,
  getAllTags,
}
