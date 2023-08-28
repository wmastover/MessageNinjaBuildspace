// update redux store
import { createSlice } from "@reduxjs/toolkit";
import { messageParamsSliceType } from "../types"

const initialState = {
    template: `##PersonalisedIntro##

I just started using Message Ninja, its a real game changer!`,
    personalisationType: "Automatic",

} as messageParamsSliceType

export const messageParamsSlice = createSlice({

    name: "params",
    initialState: {
       value: initialState,
    },

    reducers: {
        changeMessageParams: (state, action) => {
            //can write non immutable logic in createSlice, exception to rule
            console.log("change messageParams", action.payload)
            state.value =  action.payload
        },
    }
})

export const { changeMessageParams} = messageParamsSlice.actions

export const messageParamsSliceReducer = messageParamsSlice.reducer