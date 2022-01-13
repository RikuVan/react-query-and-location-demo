import './city-weather.css'

import React from 'react'
import { WeatherData } from '../Weather'

export function CityWeather(props: { data?: WeatherData }) {
  const { data } = props
  if (!data) return null
  const iconurl =
    'http://openweathermap.org/img/wn/' +
    `${data.cod != 404 ? data.weather[0].icon : null}` +
    '.png'
  return (
    <div className="displayweather">
      {data.cod != 404 ? (
        <React.Fragment>
          <div className="maincard">
            <span className="cardtitle">
              {data.name} , {data.sys.country}. Weather
            </span>
            <span className="cardsubtitle">As of {new Date().toLocaleTimeString()}</span>

            <h1>
              {' '}
              {Math.floor(data.main.temp - 273.15)}
              <sup>o</sup>
            </h1>
            <h3 className="weather-main">{data.weather[0].main}</h3>
            <img className="weather-icon" src={iconurl} alt="" srcSet="" />
            <span className="weather-description"> {data.weather[0].description}</span>
          </div>
          <div className="weatherdetails">
            <div className="section1">
              <table>
                <tbody>
                  <tr>
                    <td>
                      <h4>High/Low</h4>
                    </td>
                    <td>
                      <p>
                        {Math.floor(data.main.temp_max - 273.15)}/
                        {Math.floor(data.main.temp_min - 273.15)}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h4>Humidity</h4>
                    </td>
                    <td>
                      <p>{data.main.humidity} %</p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h4>Pressure</h4>
                    </td>
                    <td>
                      <p>{data.main.pressure} hPa</p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h4>Visibility</h4>
                    </td>
                    <td>
                      <p>{data.visibility / 1000} Km</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="section2">
              <table>
                <tbody>
                  <tr>
                    <td>
                      <h4>Wind</h4>
                    </td>
                    <td>
                      <p>{Math.floor((data.wind.speed * 18) / 5)} km/hr</p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h4>Wind Direction</h4>
                    </td>
                    <td>
                      <p>
                        {data.wind.deg}
                        <sup>o</sup> deg
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h4>Sunrise</h4>
                    </td>
                    <td>
                      <p>{new Date(data.sys.sunrise * 1000).toLocaleTimeString()}</p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h4>Sunset</h4>
                    </td>
                    <td>
                      <p>{new Date(data.sys.sunset * 1000).toLocaleTimeString()}</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </React.Fragment>
      ) : (
        <div className="maincard">
          <h2>No Data Available</h2>
        </div>
      )}
    </div>
  )
}
