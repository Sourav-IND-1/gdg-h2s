import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
          <div className="max-w-lg w-full bg-slate-900 border border-red-900 rounded-2xl p-6 text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-red-400 mb-2">Application Error</h1>
            <p className="text-slate-400 text-sm mb-4">Something went wrong while loading the app.</p>
            <pre className="bg-slate-800 rounded-xl p-4 text-xs text-red-300 text-left overflow-auto whitespace-pre-wrap break-words">
              {this.state.error?.message}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-500 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
