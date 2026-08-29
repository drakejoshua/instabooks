import { AsyncLocalStorage } from "node:async_hooks"

// requestContext.js - This file contains the implementation of a request 
// context using AsyncLocalStorage.
// The request context is used to store and retrieve data that is 
// specific to a particular request, such as a unique request ID. 
// This allows for better tracking and logging of requests 
// throughout the application.

// requestContext - This is an instance of AsyncLocalStorage that is used to create
// a request context for each incoming request. It allows for storing and 
// retrieving data that is specific to a particular request, such as a unique 
// request ID, which can be used for logging and tracking purposes.
export const requestContext = new AsyncLocalStorage()

// getRequestContext() - This function retrieves the current request context
// from the AsyncLocalStorage instance. It returns the store associated with 
// the current request, which can contain data such as a unique request ID.
export function getRequestContext() {
    return requestContext.getStore()
}

// getRequestId() - This function retrieves the unique request ID from the current
// request context. It returns the request ID if it exists, or undefined if there 
// is no current request context or if the request ID is not set.
export function getRequestId() {
    return requestContext.getStore()?.requestId
}