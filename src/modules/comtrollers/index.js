import axios from 'axios';
export default axios.create({
    baseURL: 'http://localhost:4000'
})
axios.defaults.baseURL = 'http://localhost:4000'

export const getUsersAPI = async () => axios.get('/users')
export const getUserByIdAPI = async (id) => axios.get(`/users/${id}`)
export const createUserAPI = async (user) => axios.post(`/users`,user)
export const updateUserAPI = async (user) => axios.put(`/users/${user.id}`,user)
export const deleteUserByIdAPI = async (id) => axios.delete(`/users/${id}`) 
