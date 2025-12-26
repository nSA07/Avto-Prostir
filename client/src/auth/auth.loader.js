import { redirect } from 'react-router'
import { useAuthStore } from './auth.store'

export const requireAuthLoader = () => {
  const token = useAuthStore.getState().token
  if (!token) {
    throw redirect('/login')
  }
  return null
}

export const publicOnlyLoader = () => {
  const token = useAuthStore.getState().token
  if (token) {
    throw redirect('/i')
  }
  return null
}