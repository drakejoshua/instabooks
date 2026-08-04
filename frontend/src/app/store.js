import { configureStore } from "@reduxjs/toolkit"
import uiReducer, { addDialog } from "../shared/uiSlice.js"


// configure and export redux store for use in application
export const store = configureStore({
    reducer: {
        ui: uiReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredPaths: ["ui.dialogs"],
                ignoredActions: [
                    addDialog.type,
                ],
            },
        }),
})