import './index.css'

import App from './App'
import React from 'react'
import ReactDOM from 'react-dom'
import { worker } from '@/mocks/browser'

async function prepareServiceWorker() {
  if (import.meta.env.DEV) {
    // ...this is should usually not need to be loaded manually?
    await import('../public/mockServiceWorker.js?worker')

    worker.start()
  }
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)

async function run() {
  // await prepareServiceWorker()

  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  )
}

run()
