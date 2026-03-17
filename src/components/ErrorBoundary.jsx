
import React from 'react';
import { RefreshCw, WifiOff } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("CRITICAL PORTAL ERROR:", error, errorInfo);
        // We could log to an analytics service here
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[9999] text-white p-6">
                    <div className="w-16 h-16 mb-6 rounded-full bg-red-500/10 flex items-center justify-center animate-pulse">
                        <WifiOff className="w-8 h-8 text-red-500" />
                    </div>

                    <h1 className="font-[Orbitron] text-2xl tracking-[0.2em] mb-2 text-red-500">
                        PORTAL SYNC FAILURE
                    </h1>

                    <p className="font-mono text-sm text-white/50 mb-8 text-center max-w-md">
                        The neural link was disrupted. This may be due to a resonance conflict (resize error) or signal loss.
                    </p>

                    <div className="p-4 bg-white/5 rounded-lg mb-8 max-w-lg w-full overflow-hidden">
                        <p className="font-mono text-xs text-red-400 break-all">
                            {this.state.error && this.state.error.toString()}
                        </p>
                    </div>

                    <button
                        onClick={this.handleRetry}
                        className="group flex items-center gap-3 px-8 py-3 bg-white/10 hover:bg-white/20 rounded-full transition-all border border-white/10 hover:border-white/40"
                    >
                        <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" />
                        <span className="font-[Orbitron] text-xs tracking-widest">REINITIALIZE LINK</span>
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
