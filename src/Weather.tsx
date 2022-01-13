import * as React from 'react'

import { CityWeather } from './components/CityWeather'
import { Loading } from './components/Loading'
import axios from 'axios'
import { delayFn } from './utils'
import { useMatch } from 'react-location'
import { useQuery } from 'react-query'

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

export function Weather() {
  const { params } = useMatch()
  const { status, data, isLoading } = useWeather(params.city)
  return (
    <main key={status}>
      <h1>Weather</h1>
      {isLoading ? <Loading /> : <CityWeather data={data} />}
    </main>
  )
}

function useWeather(city: string) {
  return useQuery<WeatherData, any>('weather', () => fetchWeather(city), {
    refetchInterval: 5000,
    staleTime: 5000,
    cacheTime: 0,
  })
}

export async function fetchWeather(city?: string, country = 'finland') {
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
