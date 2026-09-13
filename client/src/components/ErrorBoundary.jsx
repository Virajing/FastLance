import { Component } from 'react';
export default class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return <main className="min-h-screen grid place-items-center p-6">
      <div role="alert" className="neu-flat rounded-3xl p-10 text-center space-y-4">
        <h1 className="text-2xl font-bold">This page could not be displayed</h1>
        <p>Please reload the application. Your saved work remains on the server.</p>
        <button className="neu-btn-primary rounded-xl px-5 py-3" onClick={() => window.location.reload()}>Reload application</button>
      </div>
    </main>;
    return this.props.children;
  }
}
