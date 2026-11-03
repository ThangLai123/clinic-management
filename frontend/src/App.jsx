import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import RouteEffects from './components/RouteEffects'

export default function App() {
  return (
    <BrowserRouter>
      <RouteEffects />
      <AppRoutes />
    </BrowserRouter>
  )
}
