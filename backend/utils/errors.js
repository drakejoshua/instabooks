const ERROR_CODES = {
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
    ROUTE_NOT_FOUND: 'ROUTE_NOT_FOUND'
};

export const RouteNotFoundError = new Error("The requested resource was not found.");
RouteNotFoundError.code = ERROR_CODES.ROUTE_NOT_FOUND;
RouteNotFoundError.status = 404;

export function reportRouteNotFoundError( next ) {
    next( RouteNotFoundError );
}