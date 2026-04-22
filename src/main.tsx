/**
 * Punto de entrada de React.
 *
 * Monta la aplicación en el div#root del index.html.
 * StrictMode activo en desarrollo para detectar efectos
 * secundarios inesperados (los hooks corren dos veces en dev).
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
