
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './redux/store.js'
import AuthInitializer from './components/AuthInitializer.jsx'

createRoot(document.getElementById('root')).render(
   <Provider store={store}>
     <AuthInitializer>
      <App />
     </AuthInitializer>
   </Provider>
)
