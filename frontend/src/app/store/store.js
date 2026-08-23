import { configureStore } from "@reduxjs/toolkit"
import uiReducer, { addDialog } from "../../shared/uiSlice.js"
import authReducer from "../../features/users/authSlice.js"
import { AuthListenerMiddleware } from "../../features/users/AuthListener.js"
import { adminApi } from "../../features/admin/services/adminApi.js"
import { baseApi } from "../services/baseApi.js"


// configure and export redux store for use in application
export const store = configureStore({
    reducer: {
        ui: uiReducer,
        [ baseApi.reducerPath ]: baseApi.reducer,
        [ adminApi.reducerPath ]: adminApi.reducer,
        auth: authReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredPaths: ["ui.dialogs"],
                ignoredActions: [
                    addDialog.type,
                ],
            },
        })
        .prepend( AuthListenerMiddleware.middleware )
        .concat( baseApi.middleware )
        .concat( adminApi.middleware )
})