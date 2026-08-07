import { configureStore } from "@reduxjs/toolkit"
import uiReducer, { addDialog } from "../../shared/uiSlice.js"
import { authApi } from "../../features/users/services/authApi.js"
import authReducer from "../../features/users/authSlice.js"


// configure and export redux store for use in application
export const store = configureStore({
    reducer: {
        ui: uiReducer,
        [ authApi.reducerPath ]: authApi.reducer,
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
        .concat( authApi.middleware )
})