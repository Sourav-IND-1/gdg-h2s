import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import GuestSOSPage from './pages/GuestSOSPage'
import StaffDashboardPage from './pages/StaffDashboardPage'
import NavHeader from './components/NavHeader'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-950">
        <NavHeader />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<GuestSOSPage />} />
            <Route path="/staff" element={<StaffDashboardPage />} />
          </Routes>
        </main>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid #334155',
            borderRadius: '12px',
            fontFamily: 'Inter, sans-serif',
          },
          success: {
            iconTheme: { primary: '#16a34a', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#dc2626', secondary: '#fff' },
          },
        }}
      />
    </BrowserRouter>
  )
}
