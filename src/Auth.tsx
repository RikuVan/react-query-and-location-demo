import * as React from 'react'

import { Outlet, useMatch } from 'react-location'

import { LocationGenerics } from './App'

export interface User {
  id: number
  name: string
  username: string
  email: string
}

function User() {
  const {
    data: { user },
  } = useMatch<LocationGenerics>()

  return (
    <>
      <h4>{user?.name}</h4>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </>
  )
}

type AuthContext = {
  login: (username: string) => void
  logout: () => void
} & AuthContextState

type AuthContextState = {
  status: 'loggedOut' | 'loggedIn'
  username?: string
}

export const AuthContext = React.createContext<AuthContext>(null!)

export function AuthProvider(props: { children: React.ReactNode }) {
  const [state, setState] = React.useState<AuthContextState>({
    status: 'loggedOut',
  })

  const login = (username: string) => {
    setState({ status: 'loggedIn', username })
  }

  const logout = () => {
    setState({ status: 'loggedOut' })
  }

  const contextValue = React.useMemo(
    () => ({
      ...state,
      login,
      logout,
    }),
    [state]
  )

  return <AuthContext.Provider value={contextValue} children={props.children} />
}

export function useAuth() {
  return React.useContext(AuthContext)
}

export function Auth() {
  const auth = useAuth()
  const [username, setUsername] = React.useState('')

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    auth.login(username)
  }

  return auth.status === 'loggedIn' ? (
    <Outlet />
  ) : (
    <main>
      <h3>You must log in!</h3>
      <form onSubmit={onSubmit}>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <button onClick={() => auth.logout()}>Login</button>
      </form>
    </main>
  )
}

export function Authenticated() {
  const auth = useAuth()

  return (
    <main>
      <p>
        You're authenticated! Your username is <strong>{auth.username}</strong>
      </p>
      <button onClick={() => auth.logout()}>Log out</button>
    </main>
  )
}
