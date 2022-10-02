import { configureStore } from '@reduxjs/toolkit'
import employee from './EmployeeSlice'
import photos from './PhotoSlice'

export const store = configureStore({
    reducer: {
        employee,
        photos
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            thunk: true
        })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch