export const ERROR_CODES = {
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
    ROUTE_NOT_FOUND: 'ROUTE_NOT_FOUND',
    INVALID_AUTH_ID: 'INVALID_AUTH_ID',
    USER_NOT_FOUND: 'USER_NOT_FOUND',
    INVALID_AUTHORIZATION_TOKEN: "INVALID_AUTHORIZATION_TOKEN"
};

export const RouteNotFoundError = new Error("The requested resource was not found.");
RouteNotFoundError.code = ERROR_CODES.ROUTE_NOT_FOUND;
RouteNotFoundError.status = 404;

export function reportRouteNotFoundError( next ) {
    next( RouteNotFoundError );
}


export const InvalidAuthIdError = new Error("Invalid auth id found in request, Please check auth id and try again")
InvalidAuthIdError.code = ERROR_CODES.INVALID_AUTH_ID
InvalidAuthIdError.status = 400

export function reportInvalidAuthIdError( next ) {
    next( InvalidAuthIdError )
}

export const UserNotFoundError = new Error("No user with the specified auth id was found, Please check auth id and try again")
UserNotFoundError.code = ERROR_CODES.USER_NOT_FOUND
UserNotFoundError.status = 404

export function reportUserNotFoundError( next ) {
    next( UserNotFoundError )
}

export const InvalidAuthorizationTokenError = new Error("Invalid authorization token found in request header, Please check and try again")
InvalidAuthorizationTokenError.code = ERROR_CODES.INVALID_AUTHORIZATION_TOKEN
InvalidAuthorizationTokenError.status = 401

export function reportInvalidAuthorizationTokenError( next ) {
    next( InvalidAuthorizationTokenError )
}