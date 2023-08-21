// update redux store
import { createSlice } from "@reduxjs/toolkit";
import { loggedInSliceType } from "../types"

const initialState = {loggedIn: false} as loggedInSliceType

export const loggedInSlice = createSlice({

    name: "params",
    initialState: {
       value: initialState,
    },

    reducers: {
        changeLoggedIn: (state, action) => {
            //can write non immutable logic in createSlice, exception to rule
            console.log("change loggedIn", action.payload)
            state.value =  action.payload
        },
    }
})

export const { changeLoggedIn} = loggedInSlice.actions

export const loggedInSliceReducer = loggedInSlice.reducer