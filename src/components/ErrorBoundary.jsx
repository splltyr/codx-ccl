import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[CODX Error Boundary caught]:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleResetStorage = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0a0414] text-white flex items-center justify-center p-6 font-['Outfit',sans-serif]">
          <div className="max-w-md w-full p-8 rounded-3xl bg-[#0e071c] border border-purple-500/30 shadow-[0_0_50px_rgba(109,40,217,0.3)] text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-purple-950/60 border border-purple-500/40 flex items-center justify-center text-[#FFD700]">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h1 className="text-xl font-['Space_Grotesk'] font-bold text-white mb-2">
              Application Encountered an Error
            </h1>

            <p className="text-xs text-[#A1A1AA] mb-6 leading-relaxed">
              CODX detected an unexpected runtime issue. You can reload the page or reset the local demo cache.
            </p>

            {this.state.error && (
              <div className="p-3 mb-6 rounded-xl bg-black/60 border border-white/10 text-left font-mono text-[11px] text-purple-300 overflow-x-auto max-h-32">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col gap-2.5">
              <button
                onClick={this.handleReload}
                className="w-full py-3 rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
              >
                <RefreshCw className="w-4 h-4 text-[#FFD700]" />
                <span>Reload Application</span>
              </button>

              <button
                onClick={this.handleResetStorage}
                className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white font-mono text-xs transition-all active:scale-95"
              >
                Reset Local Cache & Reload
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
