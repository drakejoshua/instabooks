export const ERROR_CODES = {
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
    DB_OPERATION_ERROR: "DB_OPERATION_ERROR",
    ROUTE_NOT_FOUND: 'ROUTE_NOT_FOUND',
    INVALID_AUTH_ID: 'INVALID_AUTH_ID',
    USER_NOT_FOUND: 'USER_NOT_FOUND',
    INVALID_AUTHORIZATION_TOKEN: "INVALID_AUTHORIZATION_TOKEN",
    INVALID_FILE_TYPE: "INVALID_FILE_TYPE",
    INVALID_USER_NAME: "INVALID_USER_NAME",
    INVALID_OPERATION: "INVALID_OPERATION",
    INVALID_BOOK_ID: "INVALID_BOOK_ID",
    INVALID_ORDER_QUANTITY: "INVALID_ORDER_QUANTITY",
    INVALID_ADDRESS: "INVALID_ADDRESS"
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


export const fileFilterError = new Error("Invalid File Type encountered during upload.")
fileFilterError.status = 400
fileFilterError.code = ERROR_CODES.INVALID_FILE_TYPE

export function reportFileFilterError( next ) {
    next( fileFilterError )
}


export const InvalidFileTypeError = new Error("Invalid File Type or size encountered during upload.")
InvalidFileTypeError.status = 400
InvalidFileTypeError.code = ERROR_CODES.INVALID_FILE_TYPE

export function reportInvalidFileTypeError( next ) {
    next( InvalidFileTypeError )
}


export const InvalidUsernameError = new Error("Invalid user name encoutered. Name must be at least 3 characters long.")
InvalidUsernameError.status = 400
InvalidUsernameError.code = ERROR_CODES.INVALID_USER_NAME

export function reportInvalidUsernameError( next ) {
    next( InvalidFileTypeError )
}


export const InvalidOperationError = new Error("Invalid operation encountered. Please check and try again.")
InvalidOperationError.status = 400
InvalidOperationError.code = ERROR_CODES.INVALID_OPERATION

export function reportInvalidOperationError( next ) {
    next( InvalidOperationError )
}


export const InvalidBookIdError = new Error("The book id provided is invalid, Please check book id and try again")
InvalidBookIdError.status = 400
InvalidBookIdError.code = ERROR_CODES.INVALID_BOOK_ID

export function reportInvalidBookIdError( next ) {
    next( InvalidBookIdError )
}


export const InvalidOrderQuantityError = new Error("The order quantity is invalid, Please check and try again")
InvalidOrderQuantityError.status = 400
InvalidOrderQuantityError.code = ERROR_CODES.INVALID_ORDER_QUANTITY

export function reportInvalidOrderQuantityError( next ) {
    next( InvalidOrderQuantityError )
}


export const InvalidAddressError = new Error("The provided address is invalid, Please check and try again")
InvalidAddressError.status = 400
InvalidAddressError.code = ERROR_CODES.INVALID_ADDRESS

export function reportInvalidAddressError( next ) {
    next( InvalidAddressError )
}