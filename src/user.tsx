import { User } from '@supabase/supabase-js'
import { proxy } from 'valtio'

export type UserState = {
  status: 'loggedOut' | 'loggedIn' | 'pending'
  user: User | null
}

export const userState = proxy<UserState>({ status: 'loggedOut', user: null })
export const login = (user: User) => {
  userState.user = user
  userState.status = 'loggedIn'
}
export const logout = () => {
  userState.user = null
  userState.status = 'loggedOut'
}
export const setUser = (user?: User | null) => {
  if (user) {
    login(user)
  } else {
    logout()
  }
}
