import { api } from './axios'

export const userService = {

    getUser: async () => {
        const res = await api.get('/user/profile')
        return res.data
    },
}