// redux/user/userSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  inviteUser,
  fetchClasses,
  fetchDepartments,
  fetchUsers,
  userDetails,
  fetchStudents,
  addDepartment,
  addClass,
  getClassAndStudentCount,
  getStudentsAttendance,
  markStudentAttendance,
} from "./userThunk";
import {
  InviteUserState,
  ClassState,
  DepartmentsState,
  UsersState,
  userDetailsType,
  Student,
  ClassAndStudentCountState,
  AttendanceState,
  AttendancePayload,
} from "./userTypes";

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
  classAndStudentCount: ClassAndStudentCountState;
  attendance: AttendanceState;
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
    error: "",
  },
  users: {
    data: [],
    loading: false,
    error: "",
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
      userId: "",
    },
    loading: false,
    error: "",
  },
  students: {
    data: [],
    loading: false,
    error: null,
  },
  classAndStudentCount: {
    loading: false,
    error: null,
    data: [],
  },
  attendance: {
    loading: false,
    error: null,
    data: [],
  },
};

interface UserManagementState {
  classList: {
    data: Array<{ id: string; name: string; studentCount: number }>;
    loading: boolean;
    error: string | null;
  };
  students: Student[];
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserMessages(state) {
      state.inviteUser.error = null;
      state.inviteUser.successMessage = null;
    },
    toggleStudentAttendance: (
      state,
      action: PayloadAction<{ studentId: string; isPresent: boolean }>
    ) => {
      const { studentId, isPresent } = action.payload;
      state.attendance.data = state.attendance.data.map((student) => {
        if (student.id === studentId) {
          if (!student.attendance) student.attendance = { status: "" };
          student.attendance.status = isPresent ? "Present" : "Absent";
        }
        return student;
      });
    },
    markAllStudents: (state, action: PayloadAction<{ isPresent: boolean }>) => {
      const { isPresent } = action.payload;
      state.attendance.data = state.attendance.data.map((student) => {
        if (!student.attendance) {
          student.attendance = {
            status: isPresent ? "Present" : "Absent",
          };
        } else {
          student.attendance.status = isPresent ? "Present" : "Absent";
        }
        return student;
      });
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
      .addCase(fetchStudents.pending, (state) => {
        state.students.loading = true;
        state.students.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.students.loading = false;
        state.students.data = action.payload;
      })
      .addCase(addDepartment.pending, (state) => {})
      .addCase(addDepartment.fulfilled, (state, action) => {})
      .addCase(addDepartment.rejected, (state, action) => {})
      .addCase(addClass.rejected, (state, action) => {})
      .addCase(addClass.fulfilled, (state, action) => {})
      .addCase(getClassAndStudentCount.pending, (state) => {
        state.classAndStudentCount.loading = true;
      })
      .addCase(getClassAndStudentCount.fulfilled, (state, action) => {
        state.classAndStudentCount.loading = false;
        state.classAndStudentCount.data = action.payload;
      })
      .addCase(getClassAndStudentCount.rejected, (state, action) => {
        state.classAndStudentCount.loading = false;
        state.classAndStudentCount.error = action.error as string;
      })
      .addCase(getStudentsAttendance.pending, (state, action) => {
        state.attendance.loading = true;
          state.classAndStudentCount.error = null;
      })
      .addCase(getStudentsAttendance.fulfilled, (state, action) => {
        state.attendance.loading = false;
        state.attendance.error = null;
        state.attendance.data = action.payload;
      })
      .addCase(getStudentsAttendance.rejected, (state, action) => {
        state.attendance.loading = false;
        state.attendance.error = action.payload?.error as string;
        state.attendance.data = [];
      })
      .addCase(markStudentAttendance.pending, (state) => {})
      .addCase(markStudentAttendance.fulfilled, (state) => {})
      .addCase(markStudentAttendance.rejected, (state, action) => {});
  },
});

export const { clearUserMessages, toggleStudentAttendance, markAllStudents } =
  userSlice.actions;
export default userSlice.reducer;
