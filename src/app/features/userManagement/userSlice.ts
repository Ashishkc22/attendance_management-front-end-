// redux/user/userSlice.ts

import { createSlice } from "@reduxjs/toolkit";
import { inviteUser, fetchClasses,fetchDepartments,fetchUsers,userDetails, fetchStudents } from "./userThunk";
import { InviteUserState, ClassState,DepartmentsState,UsersState,userDetailsType, Student } from "./userTypes";

interface StudentsState {
  data: Student[];
  loading: boolean;
  error: string | null;
}

interface UserState {
  inviteUser: InviteUserState;
  class: ClassState;
  department: DepartmentsState;
  users: UsersState;
  userDetails: userDetailsType;
  students: StudentsState;
}

const initialState: UserState = {
  inviteUser: { loading: false, error: null, successMessage: null },
  class: {
    loading: false,
    error: null,
    data: [],
  },
  department: {
    data: [],
    loading: false,
    error: ""
  },
  users: {
    data: [],
    loading: false,
    error: ""
  },
  userDetails: {
    data: {
      id: "",
      email: "",
      first_name: "",
      middle_name: "",
      last_name: "",
      role: "",
      shift: "",
      status: "",
      isActive: false,
      createdAt: "",
      updatedAt: "",
      departmentId: null,
      classId: null,
      userId: ""
    },
    loading: false,
    error: ""
  },
  students: {
    data: [],
    loading: false,
    error: null
  }
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserMessages(state) {
      state.inviteUser.error = null;
      state.inviteUser.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(inviteUser.pending, (state) => {
        state.inviteUser.loading = true;
        state.inviteUser.error = null;
        state.inviteUser.successMessage = null;
      })
      .addCase(inviteUser.fulfilled, (state, action) => {
        state.inviteUser.loading = false;
        state.inviteUser.successMessage =
          action.payload.message || "User invited successfully";
      })
      .addCase(inviteUser.rejected, (state, action) => {
        state.inviteUser.loading = false;
        state.inviteUser.error =
          action.payload?.error ?? "Failed to invite user";
      })
      .addCase(fetchClasses.pending, (state) => {
        state.class.loading = true;
        state.class.error = null;
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.class.loading = false;
        state.class.data = action.payload; // payload is ClassItem[]
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.class.loading = false;
        state.class.error = "Failed to fetch classes";
      })
      .addCase(fetchDepartments.pending, (state) => {
        state.department.loading = true;
        state.department.error = null;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.department.loading = false;
        state.department.data = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.department.loading = false;
        state.department.error = action.payload as string;
      })
      .addCase(fetchUsers.pending, (state) => {
        state.users.loading = true;
        state.users.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users.loading = false;
        state.users.data = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.users.loading = false;
        state.users.error = action.payload as string;
      })
      .addCase(userDetails.pending, (state) => {
        state.userDetails.loading = true;
        state.userDetails.error = null;
      })
      .addCase(userDetails.fulfilled, (state, action) => {
        state.userDetails.loading = false;
        state.userDetails.data = action.payload;
      })
      .addCase(userDetails.rejected, (state, action) => {
        state.userDetails.loading = false;
        state.userDetails.error = action.payload as string;
      })
      // --- Students Thunk ---
      .addCase(fetchStudents.pending, (state) => {
        state.students.loading = true;
        state.students.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.students.loading = false;
        state.students.data = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.students.loading = false;
        state.students.error = action.payload?.error || "Failed to fetch students";
      })
      // --- Add Student Thunk ---
      .addCase(require('./userThunk').addStudent.pending, (state) => {
       
      })
      .addCase(require('./userThunk').addStudent.fulfilled, (state, action) => {
       
      })
      .addCase(require('./userThunk').addStudent.rejected, (state, action) => {
       
      });

  },
});

export const { clearUserMessages } = userSlice.actions;
export default userSlice.reducer;
