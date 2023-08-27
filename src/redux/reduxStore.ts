import { configureStore } from '@reduxjs/toolkit'
import { loadingSliceReducer } from './loadingSlice'
import { loggedInSliceReducer } from './loggedInSlice'
import { messageSliceReducer } from './messageSlice'
import { iframeSliceReducer } from './iframeSlice'
import { pagesSliceReducer } from './pagesSlice'

export const store = configureStore({
  reducer: {
    loading: loadingSliceReducer,
    loggedIn: loggedInSliceReducer,
    message: messageSliceReducer,
    iframe: iframeSliceReducer,
    pages: pagesSliceReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>