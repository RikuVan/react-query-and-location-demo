import * as React from 'react'

import { Outlet, useMatch } from 'react-location'
import { UserState, setUser, userState } from './user'

import { Credentials } from './Signup'
import { LocationGenerics } from './App'
import { supabase } from './supabase'
import { useMutation } from 'react-query'
import { useSnapshot } from 'valtio'

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

export function useUser(): UserState {
  const snap = useSnapshot(userState)

  React.useEffect(() => {
    const session = supabase.auth.session()
    setUser(session?.user)
    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user)
    })

    return () => {
      listener?.unsubscribe()
    }
  }, [])

  return snap
}

export function useAuth() {
  const user = useUser()
  async function login(email: string, password: string) {
    const { error, user } = await supabase.auth.signIn({
      email,
      password,
    })
    if (error) {
      throw error
    } else {
      setUser(user)
    }
    return user
  }

  async function logout() {
    await supabase.auth.signOut()
  }
  return { login, logout, ...user }
}

export function Auth() {
  const { login, logout, status } = useAuth()
  const { mutate } = useMutation(({ email, password }: Credentials) => login(email, password))
  const emailRef = React.useRef<HTMLInputElement>(null)
  const passwordRef = React.useRef<HTMLInputElement>(null)

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutate({
      email: emailRef.current?.value as string,
      password: passwordRef.current?.value as string,
    })
  }

  return status === 'loggedIn' ? (
    <Outlet />
  ) : (
    <main>
      <h3>You must log in!</h3>
      <form onSubmit={onSubmit}>
        <input ref={emailRef} placeholder="email" />
        <input ref={passwordRef} placeholder="password" type="password" />
        <button type="submit">Login</button>
      </form>
    </main>
  )
}
