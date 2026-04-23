import { Component, type ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { failed: boolean }

export class SceneErrorBoundary extends Component<Props, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  render() {
    if (this.state.failed) {
      // Canvas no disponible — fondo sólido, contenido HTML intacto
      return <div className="fixed inset-0 z-0" style={{ background: '#05070B' }} aria-hidden="true" />
    }
    return this.props.children
  }
}
