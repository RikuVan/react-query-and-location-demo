import 'react-confirm-alert/src/react-confirm-alert.css'

import * as React from 'react'

import { useMutation, useQuery } from 'react-query'

import { Loading } from './components/Loading'
import { confirmAlert } from 'react-confirm-alert'
import { queryClient } from './App'
import { supabase } from './supabase'
import { useAuth } from './Auth'
import { useNavigate } from 'react-location'

type PinnedLink = {
  id: string
  url: string
  description: string
  created_at: string
  updated_at: string
  user_id: string
}

export function PinBoard() {
  const { logout, user } = useAuth()
  const { data, isLoading } = useQuery(
    ['pinboard', user?.id],
    () => fetchPins(user?.id as string),
    { enabled: !!user?.id }
  )
  const { mutate } = useMutation<unknown, PinnedLink[], string, { previousPins: PinnedLink[] }>(
    (id: string) => deletePin(id),
    {
      onMutate: async (id) => {
        await queryClient.cancelQueries(['pinboard', user?.id])
        // make sure the optimistic update is not overwritten
        const previousPins = queryClient.getQueryData(['pinboard', user?.id])
        // Optimistically remove the pin
        queryClient.setQueryData(['pinboard', user?.id], (old: PinnedLink[] | undefined) =>
          old ? old?.filter((pin) => pin.id !== id) : []
        )
        return { previousPins } as { previousPins: PinnedLink[] }
      },
      // If the mutation fails, use the context returned from onMutate to roll back
      onError: (err, newTodo, context) => {
        queryClient.setQueryData(['pinboard', user?.id], context?.previousPins as PinnedLink[])
      },
      onSettled: () => {
        // notice the prefix is enough for invalidation
        queryClient.invalidateQueries('pinboard')
      },
    }
  )

  const navigate = useNavigate()

  const confirmDelete = (id: string) => {
    confirmAlert({
      title: 'Confirm to submit',
      message: 'Are you sure to delete this pin?',
      overlayClassName: 'pinboard-overlay',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            mutate(id)
          },
        },
        {
          label: 'No',
          onClick: () => {},
        },
      ],
    })
  }

  return (
    <main>
      <h2>Pinboard</h2>
      {isLoading ? (
        <Loading />
      ) : (
        <table>
          <thead>
            <tr>
              <th style={{ width: '45%' }}>Link</th>
              <th style={{ width: '45%' }}>Description</th>
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
                  <td>
                    <button className="ghost" onClick={() => confirmDelete(entry.id)}>
                      <svg className="feather">
                        <use href="/icon-sprite.svg#x" />
                      </svg>
                    </button>
                  </td>
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

async function fetchPins(id: string) {
  const { data } = await supabase
    .from('pinned_link')
    .select('*')
    .eq('user_id', id)
    .order('inserted_at')
  return data
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

async function deletePin(id: string) {
  const response = await supabase.from('pinned_link').delete().eq('id', id).single()
  return response
}
