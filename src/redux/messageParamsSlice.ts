// update redux store
import { createSlice } from "@reduxjs/toolkit";
import { messageParamsSliceType } from "../types"

const initialState = {
    template: `##PersonalisedIntro##

Customise this text in settings!`,

    personalisationType: "Experience focus",
    linkedInProfile: {
        userName: "",
        userDescription: "",
        aboutDescripton: "",
        experience: [],
        activity: [],
      }


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