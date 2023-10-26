// update redux store
import { createSlice } from "@reduxjs/toolkit";
import { LinkedInProfileType } from "../types"

const initialState = {
        userName: "",
        userDescription: "",
        aboutDescripton: "",
        experience: [],
        posts: [],
  } as LinkedInProfileType

export const linkedInProfileSlice = createSlice({

    name: "params",
    initialState: {
       value: initialState,
    },

    reducers: {
        changeLinkedInProfile: (state, action) => {
            //can write non immutable logic in createSlice, exception to rule
            console.log("change LinkedIn Profile", action.payload)
            state.value =  action.payload
        },
    }
})

export const { changeLinkedInProfile } = linkedInProfileSlice.actions

export const linkedInProfileSliceReducer = linkedInProfileSlice.reducer