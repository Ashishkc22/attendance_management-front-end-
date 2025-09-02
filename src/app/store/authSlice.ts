import { createSlice,PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    token: string | null;
}

const initialState = {
    token : null,
}

const authSlice = createSlice({
    name: "authSlice",
    initialState,
    reducers: {
        setToken: (state: AuthState, action: PayloadAction<string>)=>{
            state.token = action.payload;
        },
    }
})
export const {setToken} = authSlice.actions;
export default authSlice.reducer;