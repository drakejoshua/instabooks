import React from 'react'
import { logger } from '../infra/logging/logger';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError( error ) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // log error using the app's dedicated logger
        logger.error("ErrorBoundary caught an error", error, { errorInfo });
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            const Component = this.props.fallback

            return <Component 
                error={this.state.error} 
                reset={() => this.setState({ hasError: false, error: null })}
            />
        }
        
        return this.props.children
    }
}

export default ErrorBoundary;