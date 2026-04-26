import { Link, useLocation } from 'react-router-dom'

export default function NavHeader() {
  const { pathname } = useLocation()

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
            <span className="text-white font-black text-xs tracking-wider">SOS</span>
          </div>
          <span className="font-bold text-white text-base tracking-tight">
            Rapid<span className="text-red-500">Crisis</span>
          </span>
          <span className="hidden sm:inline text-slate-500 text-xs font-medium ml-1">
            Emergency Response Platform
          </span>
        </div>

        {/* Nav Links */}
        <nav className="flex items-center gap-1">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              pathname === '/'
                ? 'bg-red-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            SOS
          </Link>
          <Link
            to="/staff"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              pathname === '/staff'
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Staff Dashboard
          </Link>
        </nav>
      </div>
    </header>
  )
}
