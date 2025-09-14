import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loginUser,getAccesstoken } from "./authThunk";

interface AuthState {
  token: string | null;
}

const initialState: AuthState = {
  token: null,
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
        localStorage.setItem("refreshToken",action.payload.data.refreshToken) 
        localStorage.setItem("accessToken",action.payload.data.accessToken) 
      }).addCase(getAccesstoken.rejected,()=>{
        console.log("Login failed");
      }).addCase(getAccesstoken.fulfilled,(state, action)=>{
        state.token = action.payload.data.accessToken;
      });
  },
});
export const { setToken } = authSlice.actions;
export default authSlice.reducer;
