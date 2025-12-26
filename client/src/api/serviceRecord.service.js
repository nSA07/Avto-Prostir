import { api } from './axios'

export const serviceRecordService = {

    createRecord: async (carId, data) => {
        const res = await api.post(`/service-record/cars/${carId}`, data)
        return res.data
    },
    
    getRecordById: async (id) => {
        const res = await api.get(`/service-record/${id}`)
        return res.data
    },

    updateRecord: async (id, data) => {
        
        const res = await api.patch(`/service-record/${id}`, data)
        return res.data
    },

    deleteRecord: async (id) => {
        const res = await api.delete(`/service-record/${id}`)
        return res.data
    }
}