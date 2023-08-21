// update redux store
import { createSlice } from "@reduxjs/toolkit";
import { messageSliceType } from "../types"

const initialState = {message: "true"} as messageSliceType

export const messageSlice = createSlice({

    name: "params",
    initialState: {
       value: initialState,
    },

    reducers: {
        changeMessage: (state, action) => {
            //can write non immutable logic in createSlice, exception to rule
            console.log("change message", action.payload)
            state.value =  action.payload
        },
    }
})

export const { changeMessage} = messageSlice.actions

export const messageSliceReducer = messageSlice.reducer