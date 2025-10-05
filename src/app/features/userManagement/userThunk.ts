import { FetchStudentsResponse, Student, AddStudentPayload } from "./userTypes";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { InviteUserPayload, InviteUserResponse,AttendancePayload } from "./userTypes";
import axiosLib from "axios";
import getAxiosBase from "@/lib/axios";

const userManagementAxiosInstance = getAxiosBase({ url: "user_management" });

export const inviteUser = createAsyncThunk<
  InviteUserResponse, // return type
  InviteUserPayload, // payload type
  { rejectValue: { error: string } } // error shape
>("user/inviteUser", async (payload, { rejectWithValue }) => {
  try {
    const response = await userManagementAxiosInstance.post<InviteUserResponse>(
      "api/v1/invite",
      payload
    );
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    // Axios error handling
    const message =
      error.response?.data?.message || error.message || "Something went wrong";
    return rejectWithValue({ error: message });
  }
});

export const fetchClasses = createAsyncThunk(
  "class/fetchClasses",
  async ({ departmentId }: { departmentId: string }, { rejectWithValue }) => {
    try {
      const response = await userManagementAxiosInstance.get(
        `/api/v1/class/${departmentId}`
      );

      if (response.data.message === "success") {
        return response.data.data; // return class list
      } else {
        return rejectWithValue(
          response.data.message || "Failed to get classes"
        );
      }
    } catch (error) {
      // 👇 Narrow the unknown type
      if (axiosLib.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || "Axios error");
      }

      return rejectWithValue("An unexpected error occurred");
    }
  }
);

export const fetchDepartments = createAsyncThunk(
  "departments/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userManagementAxiosInstance.get(
        "/api/v1/department"
      );
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchUsers = createAsyncThunk(
  "departments/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userManagementAxiosInstance.get("/api/v1/users");
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const userDetails = createAsyncThunk(
  "departments/userDetails",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userManagementAxiosInstance.get(
        "/api/v1/user-details"
      );
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Thunk to fetch all students
export const fetchStudents = createAsyncThunk<
  Student[], // return type
  void, // payload type
  { rejectValue: { error: string } }
>("students/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response =
      await userManagementAxiosInstance.get<FetchStudentsResponse>(
        "/api/v1/student"
      );
    return response.data.data;
  } catch (err: any) {
    const message =
      err.response?.data?.message || err.message || "Failed to fetch students";
    return rejectWithValue({ error: message });
  }
});

export const addStudent = createAsyncThunk<
  any, // Adjust to your response type
  AddStudentPayload,
  { rejectValue: { error: string } }
>("students/add", async (payload, { rejectWithValue }) => {
  try {
    const response = await userManagementAxiosInstance.post(
      "/api/v1/student",
      payload
    );
    return response.data;
  } catch (err: any) {
    const message =
      err.response?.data?.message || err.message || "Failed to add student";
    return rejectWithValue({ error: message });
  }
});

// Thunk to delete a student by userId
export const deleteStudent = createAsyncThunk<
  any, // Adjust to your response type
  string, // userId
  { rejectValue: { error: string } }
>("students/delete", async (userId, { rejectWithValue }) => {
  try {
    const response = await userManagementAxiosInstance.delete(
      `/api/v1/student/${userId}`
    );
    return response.data;
  } catch (err: any) {
    const message =
      err.response?.data?.message || err.message || "Failed to delete student";
    return rejectWithValue({ error: message });
  }
});

export const addDepartment = createAsyncThunk<
  any, // Adjust to your response type
  { name: string }, // userId
  { rejectValue: { error: string } }
>("students/delete", async (payload, { rejectWithValue }) => {
  try {
    const response = await userManagementAxiosInstance.post(
      `/api/v1/department`,
      payload
    );
    return response.data;
  } catch (err: any) {
    const message =
      err.response?.data?.message || err.message || "Failed to delete student";
    return rejectWithValue({ error: message });
  }
});

export const addClass = createAsyncThunk<
  any, // Adjust to your response type
  { name: string; departmentId: string }, // userId
  { rejectValue: { error: string } }
>("add/class", async (payload, { rejectWithValue }) => {
  try {
    const response = await userManagementAxiosInstance.post(
      `/api/v1/class/`,
      payload
    );
    return response.data;
  } catch (err: any) {
    const message =
      err.response?.data?.message || err.message || "Failed to delete student";
    return rejectWithValue({ error: message });
  }
});

export const getClassAndStudentCount = createAsyncThunk<
  any, // Adjust to your response type
  void,
  { rejectValue: { error: string } }
>("class/studentCount", async (_, { rejectWithValue }) => {
  try {
    const response = await userManagementAxiosInstance.get(
      `/api/v1/class/getClassAndStudentCount`
    );
    return response.data;
  } catch (err: any) {
    const message =
      err.response?.data?.message || err.message || "Failed to delete student";
    return rejectWithValue({ error: message });
  }
});

export const getStudentsAttendance = createAsyncThunk<
  any, // Adjust to your response type
  { departmentId: string; date: string,search:string },
  { rejectValue: { error: string } }
>("class/attendance", async ({ departmentId, date,search }, { rejectWithValue }) => {
  try {
    const response = await userManagementAxiosInstance.get(
      `/api/v1/attendance/${departmentId}`,
      {
        params: {
          date,
          search
        },
      }
    );
    return response.data;
  } catch (err: any) {
    const message =
      err.response?.data?.message || err.message || "Failed to delete student";
    return rejectWithValue({ error: message });
  }
});

export const markStudentAttendance = createAsyncThunk(
  "attendance/mark",
  async (payload: AttendancePayload, { rejectWithValue }) => {
    try {
      const response = await userManagementAxiosInstance.post("/api/v1/attendance/mark", payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

