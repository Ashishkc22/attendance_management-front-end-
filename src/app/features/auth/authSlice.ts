import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loginUser,getAccesstoken,resetPassword } from "./authThunk";

interface AuthState {
  token: string | null;
  userRole: string | null;
}

const initialState: AuthState = {
  token: null,
  userRole: null
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    setToken: (state: AuthState, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.rejected, () => {
        console.log("Login failed");
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log("action", action);
        state.token = action.payload.data.accessToken;
        state.userRole= action.payload.data.role;
       
      }).addCase(getAccesstoken.rejected,()=>{
        console.log("Login failed");
      }).addCase(getAccesstoken.fulfilled,(state, action)=>{
        state.token = action.payload.data.accessToken;
      }).addCase(resetPassword.rejected,()=>{
        console.log("password reset failed failed.");
      }).addCase(resetPassword.fulfilled,(state, action)=>{
        console.log("password reset successful.");
      });
  },
});
export const { setToken } = authSlice.actions;
export default authSlice.reducer;
