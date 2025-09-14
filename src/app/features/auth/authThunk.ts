import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginCredentials } from "./authTypes";
import { AxiosResponse } from "axios";
import axios from "@/lib/axios";

interface loginResponse {
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export const loginUser = createAsyncThunk<
  loginResponse,
  loginCredentials,
  { rejectValue: string }
>("auth/loginUser", async (credentials, thunkAPI) => {
  try {
    const response = await axios.post("api/v1/login", credentials);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return thunkAPI.rejectWithValue(error.message || "Login failed"); // ✅ Safe
    }
    return thunkAPI.rejectWithValue("Login failed"); // ✅ Safe
  }
});

export const getAccesstoken = createAsyncThunk<
  loginResponse,
  void,
  { rejectValue: string }
>("auth/getAccessToken", async (_, thunkAPI) => {
  try {
    const response = await axios.get("api/v1/refresh-access-token", {
      withCredentials: true, // 👈 important!
    });
    console.log("refresh Token", response);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return thunkAPI.rejectWithValue(
        error.message || "Failed to get accessToken."
      );
    }
    return thunkAPI.rejectWithValue("Failed to get accessToken.");
  }
});
