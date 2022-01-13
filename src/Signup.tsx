import * as React from 'react'

import { setUser } from './user'
import { supabase } from './supabase'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-location'

const createUser = async (email: string, password: string) => {
  const { user, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (signUpError) {
    throw signUpError
  }

  return user
}

export type Credentials = { email: string; password: string }

export function Signup() {
  const emailRef = React.useRef<HTMLInputElement>(null)
  const passwordRef = React.useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const { mutate } = useMutation<any, unknown, Credentials, unknown>(
    ({ email, password }: Credentials) => createUser(email, password),
    {
      onSuccess: (data) => {
        setUser(data.user)
        navigate({ to: '/auth' })
      },
    }
  )

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    mutate({
      email: emailRef.current?.value as string,
      password: passwordRef.current?.value as string,
    })
  }

  return (
    <main>
      <h3>Sign up</h3>
      <form onSubmit={handleSubmit}>
        <input ref={emailRef} placeholder="email" />
        <input ref={passwordRef} placeholder="password" type="password" />
        <button type="submit">Sign up</button>
      </form>
    </main>
  )
}
