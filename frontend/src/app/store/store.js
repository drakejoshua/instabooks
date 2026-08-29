import { configureStore } from "@reduxjs/toolkit"
import uiReducer, { addDialog } from "../../shared/uiSlice.js"
import authReducer from "../../features/users/authSlice.js"
import { AuthListenerMiddleware } from "../../features/users/AuthListener.js"
import { adminApi } from "../../features/admin/services/adminApi.js"
import { baseApi } from "../services/baseApi.js"


// configure and export redux store for use in application
export const store = configureStore({
    reducer: {
        // ui slice to manage dialog and toast state across the application
        ui: uiReducer,
        // api slices for managing API state and caching
        [ baseApi.reducerPath ]: baseApi.reducer,
        [ adminApi.reducerPath ]: adminApi.reducer,
        // auth slice to manage user authentication state
        auth: authReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredPaths: ["ui.dialogs"],    // ignore non-serializable values in ui.dialogs state
                ignoredActions: [
                    addDialog.type,   // ignore non-serializable values in addDialog action payload
                ],
            },
        })
        // prepend AuthListenerMiddleware to handle authentication state changes
        .prepend( AuthListenerMiddleware.middleware )
        .concat( baseApi.middleware )
        .concat( adminApi.middleware )
})