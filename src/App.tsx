import 'react-toastify/dist/ReactToastify.css'

import * as React from 'react'

import { Auth, User } from './Auth'
import {
  Link,
  MakeGenerics,
  Outlet,
  ReactLocation,
  Route,
  Router,
  useMatch,
  useMatchRoute,
  useNavigate,
} from 'react-location'
import { QueryClient, QueryClientProvider, useMutation, useQuery } from 'react-query'
import { ToastContainer, toast } from 'react-toastify'
import { Weather, fetchWeather } from './Weather'
import { WizardFailure, WizardOne, WizardSuccess, WizardTwo } from './components/Wizard'

import { Books } from './Books'
import { Home } from './Home'
import { PinBoard } from './PinBoard'
import { PinForm } from './PinBoard'
import { ReactLocationDevtools } from 'react-location-devtools'
import { ReactQueryDevtools } from 'react-query/devtools'
import { Signup } from './Signup'
import { Terms } from './components/Terms'
import axios from 'axios'

export type LocationGenerics = MakeGenerics<{
  LoaderData: {
    user: User
    dude: {
      id: string
      name: string
      avatar_url: string
    }
  }
  Params: {
    city: string
  }
}>

const routes: Route<LocationGenerics>[] = [
  {
    path: '/',
    element: <Home />,
    loader: async () => {
      return queryClient.prefetchQuery('weather', () => fetchWeather('tampere')).then(() => ({}))
    },
  },
  {
    path: '/weather',
    children: [
      {
        path: '/',
        element: <Weather />,
        loader: async () => {
          return (
            queryClient.getQueryData('weather') ??
            queryClient.fetchQuery('weather', () => fetchWeather('tampere')).then(() => ({}))
          )
        },
      },
      {
        path: ':city',
        element: <Weather />,
      },
    ],
  },
  {
    path: '/books',
    element: <Books />,
  },
  {
    path: '/pinboard',
    element: <Auth />,
    children: [
      {
        path: '/',
        element: <PinBoard />,
      },
      {
        path: '/new',
        element: <PinForm />,
      },
    ],
  },
  { path: 'signup', element: <Signup /> },
  {
    path: '/form',
    element: <Form />,
    children: [
      {
        path: '1',
        element: <WizardOne />,
      },
      {
        path: '2',
        element: <WizardTwo />,
      },
      {
        path: 'success',
        element: <WizardSuccess />,
      },
      {
        path: 'failure',
        element: <WizardFailure />,
      },
    ],
  },
  {
    path: '/about',
    element: <About />,
    loader: async () => {
      return { dude: await fetchGithubUser('tannerlinsley') }
    },
  },
]

const location = new ReactLocation<LocationGenerics>()

// also passed variables and context
const globalOnError = (err: unknown) => {
  toast.dismiss()
  toast.error(err instanceof Error ? err.message : 'Fetching error', {
    position: toast.POSITION.TOP_RIGHT,
  })
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // default 3
      retry: 1,
      staleTime: 1000 * 60,
      cacheTime: 1000 * 60 * 60,
      onError: globalOnError,
    },
    mutations: {
      retry: 0,
      onError: globalOnError,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router location={location} routes={routes}>
        <header>
          <Menu />
        </header>
        <Outlet />
        <ReactQueryDevtools initialIsOpen={false} />
        <ReactLocationDevtools position="bottom-right" />
      </Router>
      <ToastContainer />
    </QueryClientProvider>
  )
}

function Menu() {
  return (
    <nav>
      <ul>
        {[
          ['.', 'Home'],
          ['books', 'Books'],
          ['weather', 'Weather'],
          ['pinboard', 'Pinboard'],
          ['form', 'Form'],
          ['about', 'About'],
        ].map(([to, label]) => {
          return (
            <li key={to}>
              <Link
                to={to}
                getActiveProps={() => ({
                  style: {
                    textDecoration: 'underline',
                  },
                })}
                preload={3000}
              >
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

function About() {
  const {
    data: { dude },
  } = useMatch() as any
  return (
    <main>
      <h1>About</h1>
      <p>{dude?.name}</p>
      <img src={dude.avatar_url as string} />
      <Terms />
    </main>
  )
}

export type FormData = {
  name: string
  favoriteCity: string
}

export function useForm() {
  const navigate = useNavigate()
  const setData = (data: Partial<FormData>) => {
    queryClient.setQueryData<Partial<FormData>>('form', (queryData) => {
      return { ...queryData, ...data }
    })
  }
  const mutation = useMutation(() => axios.post(`/api/form`, queryClient.getQueryState('form')))
  React.useEffect(() => {
    if (mutation.isSuccess) {
      navigate({ to: `/form/success` })
    } else if (mutation.isError) {
      navigate({ to: `/form/error` })
    }
  }, [mutation])
  return { mutation, setData }
}

function Form() {
  const navigate = useNavigate()
  const matchRoute = useMatchRoute()
  return (
    <main>
      <h1>Form</h1>
      <Outlet />
      {matchRoute({ to: '/form' }) && (
        <button onClick={() => navigate({ to: '/form/1' })}>Start</button>
      )}
    </main>
  )
}

async function fetchGithubUser(username: string) {
  return await axios.get(`https://api.github.com/users/${username}`).then((r) => r.data)
}

export default App
