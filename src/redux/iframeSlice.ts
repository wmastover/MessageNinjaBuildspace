// update redux store
import { createSlice } from "@reduxjs/toolkit";
import { iframeSliceType } from "../types"

const initialState = {
      width: "80px",
      height: "80px",
  } as iframeSliceType

export const iframeSlice = createSlice({

    name: "params",
    initialState: {
       value: initialState,
    },

    reducers: {
        changeIframe: (state, action) => {
            //can write non immutable logic in createSlice, exception to rule
            console.log("change iframe", action.payload)
            state.value =  action.payload
        },
    }
})

export const { changeIframe} = iframeSlice.actions

export const iframeSliceReducer = iframeSlice.reducer