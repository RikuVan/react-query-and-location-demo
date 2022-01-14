import * as React from 'react'

import { proxy, useSnapshot } from 'valtio'

import { Book as BookItem } from './components/Book'
import { Loading } from './components/Loading'
import axios from 'axios'
import { useInfiniteQuery } from 'react-query'

export type Book = {
  key: string
  isbn: Array<string>
  title: string
  first_publish_year: number
  publisher: string
  author_name: string
  cover_i: string
}

type Data = {
  numFound: number
  start: number
  docs: Book[]
}

const searchState = proxy({
  query: '',
})

const setQuery = (e: React.ChangeEvent<HTMLInputElement>) => (searchState.query = e.target.value)

export function Books() {
  const observerRef = React.useRef<IntersectionObserver | null>(null)
  // search query state
  const snap = useSnapshot(searchState)

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery<Data>(
    ['books', snap.query],
    // pass the abort signal to axios/fetch to get automatic cancellation if the keys change
    ({ signal, pageParam = 1 }) => fetchBooks(signal, snap.query, pageParam),
    {
      // this is called by react-query to compute the pageParam
      getNextPageParam: (data) => {
        if (!data) return 1
        if (data.numFound - data.start > 100) {
          return data.start / 100 + 2
        }
        return undefined
      },
      enabled: snap.query?.length > 1,
    }
  )
  // every there is a new last item, call this function to create a new IntersectionObserver
  const lastItemRef = React.useCallback(
    (node) => {
      if (isFetching || !node) return
      if (observerRef.current) observerRef.current.disconnect()
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage()
        }
      })
      observerRef.current.observe(node)
    },
    [isFetching, hasNextPage]
  )

  // we need to know where to put the last item ref
  // could be placed earlier to start loading before we hit the bottom
  const lastItemKey = React.useMemo(() => {
    if (!data) return
    const lastPage = data.pages[data.pages.length - 1]
    return lastPage.docs[lastPage.docs.length - 1]?.key
  }, [data])

  return (
    <main>
      <h1>Books</h1>
      <input onChange={setQuery} value={snap.query} placeholder="search..." />
      <ul className="book-list">
        {data &&
          data?.pages.flatMap((page) =>
            page.docs.map((book) => {
              return (
                <BookItem
                  key={book.key}
                  book={book}
                  ref={book.key === lastItemKey ? lastItemRef : null}
                />
              )
            })
          )}
        {isFetching && <Loading />}
      </ul>
    </main>
  )
}

function fetchBooks(signal: AbortSignal | undefined, query: string, page: number) {
  return axios({
    url: 'http://openlibrary.org/search.json',
    params: { q: query, page },
    signal,
  }).then((r) => r.data)
}
