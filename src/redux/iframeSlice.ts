// update redux store
import { createSlice } from "@reduxjs/toolkit";
import { iframeSliceType } from "../types"

const initialState = {
      width: "300px",
      height: "225px",
  } as iframeSliceType

export const iframeSlice = createSlice({

    name: "params",
    initialState: {
       value: initialState,
    },

    reducers: {
        changeIframe: (state, action) => {
            //can write non immutable logic in createSlice, exception to rule
            console.log("change message", action.payload)
            state.value =  action.payload
        },
    }
})

export const { changeIframe} = iframeSlice.actions

export const iframeSliceReducer = iframeSlice.reducer