// update redux store
import { createSlice } from "@reduxjs/toolkit";
import { loadingSliceType } from "../types"

const initialState = {loading: true} as loadingSliceType

export const loadingSlice = createSlice({

    name: "params",
    initialState: {
       value: initialState,
    },

    reducers: {
        changeLoading: (state, action) => {
            //can write non immutable logic in createSlice, exception to rule
            console.log("change loading", action.payload)
            state.value =  action.payload
        },
    }
})

export const { changeLoading} = loadingSlice.actions

export const loadingSliceReducer = loadingSlice.reducer