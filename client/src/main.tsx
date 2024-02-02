import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './globals.css'

import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import AuthCheck from './components/AuthCheck.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <BrowserRouter>
      <AuthCheck>
        <App />
      </AuthCheck>
    </BrowserRouter>
  </Provider>
)
