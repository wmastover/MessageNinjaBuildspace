import { configureStore } from '@reduxjs/toolkit'
import { loadingSliceReducer } from './loadingSlice'
import { loggedInSliceReducer } from './loggedInSlice'
import { messageSliceReducer } from './messageSlice'

export const store = configureStore({
  reducer: {
    loading: loadingSliceReducer,
    loggedIn: loggedInSliceReducer,
    message: messageSliceReducer
  }
})

export type RootState = ReturnType<typeof store.getState>