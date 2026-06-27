import { reportRouteNotFoundError } from '../utils/errors.js';

export default function notFound( req, res, next ) {
    reportRouteNotFoundError( next );
}