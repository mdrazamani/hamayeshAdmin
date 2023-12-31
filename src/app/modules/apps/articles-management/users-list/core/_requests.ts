import axios, {AxiosResponse} from 'axios'
import {saveAs} from 'file-saver'
import {ID, Response} from '../../../../../../_metronic/helpers'
import {User, UsersQueryResponse} from './_models'

const API_URL = process.env.REACT_APP_API_URL
const GET_USERS_URL = `${API_URL}/articles`
const USER_URL = `${API_URL}/article-categories`
const USER_URL1 = `${API_URL}/admin/users`
const GET_USERS_URL1 = `${API_URL}/judging`

const getUsers = (query: string): Promise<UsersQueryResponse> => {
  return axios.get(`${GET_USERS_URL}?${query}`).then((d) => d.data.data)
}

const getUserById = (id: ID): Promise<User | undefined> => {
  return axios
    .get(`${GET_USERS_URL}/${id}`)
    .then((response: AxiosResponse<Response<User>>) => response.data)
    .then((response: Response<User>) => response.data)
}

const createUser = (user) => {
  return axios
    .post(GET_USERS_URL, user)
    .then((response: AxiosResponse<Response<User>>) => response.data)
    .then((response: Response<User>) => response.data)
}

const updateUser = (id, user: User): Promise<User | undefined> => {
  return axios
    .patch(`${GET_USERS_URL}/${id}`, user)
    .then((response: AxiosResponse<Response<User>>) => response.data)
    .then((response: Response<User>) => response.data)
}

const updateReferees = (id, user: User): Promise<User | undefined> => {
  return axios
    .post(`${GET_USERS_URL1}`, {article: id, referees: user})
    .then((response: AxiosResponse<Response<User>>) => response.data)
    .then((response: Response<User>) => response.data)
}

const deleteUser = (userId: ID): Promise<void> => {
  return axios.delete(`${GET_USERS_URL}/${userId}`).then(() => {})
}

// const downloadArticles = (userId: ID): Promise<void> => {
//   return axios.get(`${GET_USERS_URL}/download/all/${userId}`).then((data) => {
//     console.log(data);
//     const link = document.createElement('a');
//     const blob = new Blob([data.data], { type: 'application/zip' });
//     const url = URL.createObjectURL(blob);

//     link.href = url;
//     link.download = 'articleFiles.zip';
//     link.click();
//   })
// }

const downloadArticles = (userId) => {
  axios({
    url: `${GET_USERS_URL}/download/all/${userId}`,
    method: 'GET',
    responseType: 'blob', // Important: responseType should be 'blob' for binary data
  }).then((response) => {
    const blob = new Blob([response.data], {type: 'application/zip'})

    // Extracting and decoding filename from the Content-Disposition header
    const contentDisposition = response.headers['content-disposition']
    let filename = 'articleFiles.zip' // Default filename
    if (contentDisposition) {
      const filenameRegex = /filename\*[^;=\n]*=(UTF-8'')?((['"]).*?\3|[^;\n]*)/
      let matches = filenameRegex.exec(contentDisposition)
      if (matches != null && matches[2]) {
        filename = decodeURIComponent(matches[2].replace(/['"]/g, '')) // Decode and remove quotes around the filename
      }
    }

    saveAs(blob, filename)
  })
}

const deleteSelectedUsers = (userIds: Array<ID>): Promise<void> => {
  const requests = userIds.map((id) => axios.delete(`${GET_USERS_URL}/${id}`))
  return axios.all(requests).then(() => {})
}

const getAllCategories = () => {
  return axios.get(`${USER_URL}`).then((d) => d.data.data)
}
const getAllUsers = () => {
  return axios.get(`${USER_URL1}?role=referee`).then((d) => d.data.data)
}
export {
  getUsers,
  getAllUsers,
  deleteUser,
  deleteSelectedUsers,
  getUserById,
  createUser,
  updateUser,
  getAllCategories,
  downloadArticles,
  updateReferees,
}
