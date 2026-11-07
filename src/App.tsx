import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Scene } from './scene/Scene'
import { Controls } from './ui/Controls'
import { Info } from './ui/Info'
import { Timeline } from './ui/Timeline'
import { useApp } from './state/store'

class SceneBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null }
  static getDerivedStateFromError(error: Error) {
    return { error }
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack)
  }
  render() {
    if (this.state.error) return <div role="alert" className="alert">The 3D scene failed to load: {this.state.error.message}</div>
    return this.props.children
  }
}

export function App() {
  const title = useApp((s) => s.setup.title)
  return (
    <div className="app">
      <header>
        <h1>WRO 2027 Future Engineers · Smart Warehouse</h1>
        <span className="sub">{title}</span>
      </header>
      <Controls />
      <main>
        <SceneBoundary>
          <Scene />
        </SceneBoundary>
        <Timeline />
      </main>
      <Info />
    </div>
  )
}
