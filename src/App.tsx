import * as React from 'react'

import { Auth, AuthProvider, Authenticated, User } from './Auth'
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
import { WizardFailure, WizardOne, WizardSuccess, WizardTwo } from './components/Wizard'

import { CityWeather } from './components/CityWeather'
import { ReactLocationDevtools } from 'react-location-devtools'
import { ReactQueryDevtools } from 'react-query/devtools'
import { ReduxVsQueryTable } from './components/ReduxVsQueryTable'
import axios from 'axios'
import { delayFn } from './utils'

export type WeatherData = {
  coord: {
    lon: string
    lat: string
  }
  weather: {
    id: number
    main: string
    description: string
    icon: string
  }[]
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
  }
  visibility: number
  wind: {
    speed: number
    deg: number
  }
  clouds: {
    all: number
  }
  dt: number
  sys: {
    type: number
    id: number
    country: 'FI'
    sunrise: number
    sunset: number
  }
  timezone: number
  id: number
  cod: number
  name: string
}

export type LocationGenerics = MakeGenerics<{
  LoaderData: {
    user: User
    me: {
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
  { path: '/', element: <Home /> },
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
          return {}
        },
      },
      {
        path: ':city',
        element: <Weather />,
        loader: async ({ params: { city } }) =>
          // or await queryClient.prefetchQuery('weather', fetchWeather)
          // prefetch is good because it is skipped in their is valid cache
          queryClient.fetchQuery('weather', () => fetchWeather(city)).then(() => ({})),
      },
    ],
  },
  {
    path: '/protected',
    element: <Auth />,
    children: [
      {
        path: '/',
        element: <Authenticated />,
      },
    ],
  },
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
      return { me: await fetchMe() }
    },
  },
]

const location = new ReactLocation<LocationGenerics>()
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60,
      cacheTime: 1000 * 60 * 60,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router location={location} routes={routes}>
          <header>
            <Menu />
          </header>
          <Outlet />
          <ReactQueryDevtools initialIsOpen={false} />
          <ReactLocationDevtools position="bottom-right" />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  )
}

function About() {
  const {
    data: { me },
  } = useMatch() as any
  return (
    <main>
      <h1>About</h1>
      <p>{me?.name}</p>
      <img src={me.avatar_url as string} />
    </main>
  )
}

function Weather() {
  const { params } = useMatch()
  const { status, data } = useWeather(params.city)
  return (
    <main key={status}>
      <h1>Weather</h1>
      <CityWeather data={data} />
    </main>
  )
}

function Home() {
  return (
    <main>
      <h1>Home</h1>
      <h3>Do we need Redux?</h3>
      <blockquote>
        For a vast majority of applications, the truly globally accessible client state that is left
        over after migrating all of your async code to React Query is usually very tiny.
      </blockquote>
      <h3>What common problems are we solving?</h3>
      <ul>
        <li>Prop drilling</li>
        <li>Waterfall loading</li>
        <li>Rerenders</li>
        <li>UI synchronization</li>
        <li>Stale state</li>
        <li>First paint</li>
        <li>Complexity</li>
      </ul>
      <ReduxVsQueryTable />
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

function Menu() {
  return (
    <nav>
      <ul>
        {[
          ['.', 'Home'],
          ['weather', 'Weather'],
          ['protected', 'Protected'],
          ['form', 'Form'],
          ['about', 'About'],
        ].map(([to, label]) => {
          return (
            <li key={to}>
              <Link
                to={to}
                getActiveProps={() => ({
                  style: {
                    borderBottom: '1px solid var(--links)',
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

function useWeather(city: string) {
  return useQuery<WeatherData, any>('weather', () => fetchWeather(city), { refetchInterval: 5000 })
}

async function fetchMe() {
  return await axios.get(`https://api.github.com/users/rikuvan`).then((r) => r.data)
}

async function fetchWeather(city?: string, country = 'finland') {
  return await delayFn(() =>
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city ?? 'tampere'},${country}&APPID=${
          import.meta.env.VITE_OPEN_WEATHER_API_KEY
        }`
      )
      .then((r) => r.data)
  )
}

export default App
