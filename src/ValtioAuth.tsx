import { AuthContextState } from './Auth'
import { proxy } from 'valtio'

export const auth = proxy<AuthContextState>({ status: 'loggedOut', username: '' })
export const login = (username: string) => {
  auth.username = username
  auth.status = 'loggedIn'
}
export const logout = () => {
  auth.username = ''
  auth.status = 'loggedOut'
}
