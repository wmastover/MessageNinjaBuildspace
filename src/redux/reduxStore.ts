import { configureStore } from '@reduxjs/toolkit'
import { loadingSliceReducer } from './loadingSlice'
import { loggedInSliceReducer } from './loggedInSlice'
import { messageSliceReducer } from './messageSlice'
import { iframeSliceReducer } from './iframeSlice'

export const store = configureStore({
  reducer: {
    loading: loadingSliceReducer,
    loggedIn: loggedInSliceReducer,
    message: messageSliceReducer,
    iframe: iframeSliceReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>