// update redux store
import { createSlice } from "@reduxjs/toolkit";
import { pagesSliceType } from "../types"

const initialState = {showTag: true, showSettings: false} as pagesSliceType

export const pagesSlice = createSlice({

    name: "params",
    initialState: {
       value: initialState,
    },

    reducers: {
        changeTag: (state, action) => {
            //can write non immutable logic in createSlice, exception to rule
            console.log("change tag", action.payload)
            state.value.showTag =  action.payload
        },
        changeSettings: (state, action) => {
            //can write non immutable logic in createSlice, exception to rule
            console.log("change settings", action.payload)
            state.value.showSettings =  action.payload
        }
    }
})

export const {changeTag} =  pagesSlice.actions

export const {changeSettings} =  pagesSlice.actions

export const  pagesSliceReducer =  pagesSlice.reducer