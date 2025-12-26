import { api } from './axios'

export const carService = {
  getAllCars: async () => {
    const res = await api.get('/cars')
    return res.data
  },

  getCarById: async (id) => {
    const res = await api.get(`/cars/${id}`)
    return res.data
  },

  createCar: async (data) => {
    const res = await api.post('/cars', data)
    return res.data
  },

  updateCar: async (id, data) => {
    const res = await api.patch(`/cars/${id}`, data)
    return res.data
  },

  deleteCar: async (id) => {    
    const res = await api.delete(`/cars/${id}`)
    return res.data
  }
}