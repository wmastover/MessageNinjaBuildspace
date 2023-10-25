// update redux store
import { createSlice } from "@reduxjs/toolkit";
import { topicType } from "../types"


const initialState: topicType[] = []

export const topicsSlice = createSlice({

    name: "params",
    initialState: {
       value: initialState,
    },

    reducers: {
        changeTopics: (state, action) => {
            //can write non immutable logic in createSlice, exception to rule
            console.log("change message", action.payload)
            state.value =  action.payload
        },
    }
})

export const { changeTopics} = topicsSlice.actions

export const topicsSliceReducer = topicsSlice.reducer