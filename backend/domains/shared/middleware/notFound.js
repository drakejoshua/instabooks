import { reportRouteNotFoundError } from '../utils/errors.js';

// notFound() - This function is a middleware that handles 
// requests to routes that do not exist in the application.
// It reports a route not found error to the next middleware, 
// which is typically the error handler.
export default function notFound( req, res, next ) {
    reportRouteNotFoundError( next );
}