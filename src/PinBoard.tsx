import * as React from 'react'

import { useMutation, useQuery } from 'react-query'

import { Loading } from './components/Loading'
import { queryClient } from './App'
import { supabase } from './supabase'
import { useAuth } from './Auth'
import { useNavigate } from 'react-location'

export function PinBoard() {
  const { logout, user } = useAuth()
  const { data, isLoading } = useQuery(
    ['pinboard', user?.id],
    () => fetchPins(user?.id as string),
    { enabled: !!user?.id }
  )
  const navigate = useNavigate()

  return (
    <main>
      <h2>Pinboard</h2>
      {isLoading ? (
        <Loading />
      ) : (
        <table>
          <thead>
            <tr>
              <th>Link</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((entry) => {
              return (
                <tr>
                  <td>
                    <a href={entry.link}>{entry.link}</a>
                  </td>
                  <td>{entry.description}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={() => navigate({ to: '/pinboard/new' })}>+</button>
      </div>
    </main>
  )
}

async function fetchPins(id: string) {
  const { data } = await supabase
    .from('pinned_link')
    .select('*')
    .eq('user_id', id)
    .order('inserted_at')
  return data
}

export const PinForm = () => {
  const { user } = useAuth()
  const linkRef = React.useRef<HTMLInputElement>(null)
  const descriptionRef = React.useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const { mutate } = useMutation(
    ({ link, description }: { link: string; description: string }) =>
      createPin(link, description, user?.id as string),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['pinboard', user?.id])
        navigate({ to: '/pinboard' })
      },
    }
  )
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    mutate({
      link: linkRef.current?.value as string,
      description: descriptionRef.current?.value as string,
    })
  }
  return (
    <main>
      <h3>Pin a new link</h3>
      <form onSubmit={onSubmit}>
        <input ref={linkRef} placeholder="link" className="lg-input" />
        <input ref={descriptionRef} placeholder="description" className="lg-input" />
        <button type="submit">Save</button>
      </form>
    </main>
  )
}

async function createPin(link: string, description: string, user_id: string) {
  const response = await supabase
    .from('pinned_link')
    .insert({
      user_id,
      link,
      description,
    })
    .single()
  return response
}
