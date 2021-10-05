import React from 'react'
import ReactDOM from 'react-dom'
import './assets/style/index.css'
import App from './App'

import { Provider } from 'react-redux'
import { store } from './store/store'

import fontAwesomeLib from './font-awesome/index'

fontAwesomeLib.init()

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
