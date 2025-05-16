import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import axios from 'axios'

// Configure axios to use relative URLs with the backend
axios.defaults.baseURL = import.meta.env.PROD 
  ? '/api' 
  : 'http://localhost:8000/api';

// Configure axios to include credentials
axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
