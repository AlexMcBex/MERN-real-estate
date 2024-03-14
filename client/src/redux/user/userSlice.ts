import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    error: null,
    loading: false
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state)=>{
            state.loading = true
        },
        signInSuccess: (state: { currentUser: any; loading: boolean; error: null; }, action: { payload: any; }) =>{
            state.currentUser = action.payload,
            state.loading = false,
            state.error = null
        },
        signInFailure: (state, action) =>{
            state.error = action.payload,
            state.loading = false
        },
        updateUserStart:(state)=>{
            state.loading = true
        },
        updateUserSuccess: (state, action)=>{
            state.loading = false
            state.currentUser = action.payload
            state.error = null
        },
        updateUserError: (state, action)=>{
            state.loading = false
            state.error = action.payload
        },
    },
})

export const {signInStart, signInSuccess, signInFailure, updateUserError, updateUserStart, updateUserSuccess} = userSlice.actions

export default userSlice.reducer