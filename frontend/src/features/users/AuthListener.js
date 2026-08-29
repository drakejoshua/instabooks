import { createListenerMiddleware } from "@reduxjs/toolkit";
import { clearToken, logOut, setToken } from "./authSlice";
import { authApi } from "./services/authApi";

// AuthListenerMiddleware is a Redux middleware that 
// listens for specific authentication-related actions 
// (logOut, clearToken, setToken) and performs side 
// effects such as updating localStorage and resetting 
// the authApi state. It ensures that the authentication 
// state is properly managed across the application.

// get the localStorage key for storing the authentication token
// from the environment variables. 
const LocalStorageAuthKey = import.meta.env.VITE_LOCALSTORAGE_AUTH_KEY

// create a listener middleware instance for handling 
// authentication-related actions
export const AuthListenerMiddleware = createListenerMiddleware();

// start listening for the logOut action. When this action is dispatched,
// the effect function is executed, which removes the access token 
// from localStorage and resets the authApi state.
AuthListenerMiddleware.startListening({
    actionCreator: logOut,
    effect: function( action, api ) {
        // remove access token from localstorage
        localStorage.removeItem( LocalStorageAuthKey )

        // reset authApi state
        api.dispatch(
            authApi.util.resetApiState()
        )
    }
})

// start listening for the clearToken action. When this action is dispatched,
// the effect function is executed, which removes the access token 
// from localStorage.
AuthListenerMiddleware.startListening({
    actionCreator: clearToken,
    effect: function() {
        // remove access token from localstorage
        localStorage.removeItem( LocalStorageAuthKey )
    }
})

// start listening for the setToken action. When this action is dispatched,
// the effect function is executed, which saves the access token 
// to localStorage.
AuthListenerMiddleware.startListening({
    actionCreator: setToken,
    effect: function( action ) {
        // save access token to localStorage
        localStorage.setItem( LocalStorageAuthKey, action.payload )
    }
})