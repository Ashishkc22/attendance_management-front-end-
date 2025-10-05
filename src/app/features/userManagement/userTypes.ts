// types/user.ts

export interface InviteUserState {
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

export interface ClassState {
  loading: boolean;
  error: string | null;
  data: Array<{
    id: string;
    name: string;
    updatedAt: string;
    departmentId: string;
    createdAt: string
  }>;
}


export interface InviteUserPayload {
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  shift?: string;
  departmentId: string;
  role: string;
  classIds?: Array<{
    id: string
  }>
}

export interface InviteUserResponse {
  data?: Object;
  message?: string;
  error?: Object; // adjust to match your backend
}

export interface Department {
  id: string;
  name: string;
}

export interface DepartmentsState {
  data: Department[];
  loading: boolean;
  error: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

export interface UsersState {
  data: User[];
  loading: boolean;
  error: string | null;
}

export interface userDetailsType {
  data: {
    id: string;
    email: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    role: string;
    shift: string;
    status: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    departmentId: string | null;
    classId: string | null;
    userId: string;
  };
  loading: boolean;
  error: string | null;
}

// --- Student Response Types ---
export interface Attendance {
  // Define attendance fields as per your backend
  // Example:
  id: string;
  date: string;
  status: string;
}

export interface Department {
  id: string;
  name: string;
}

export interface classDetails {
  id: string;
  name: string;
}

export type Role = "STUDENT" | "TEACHER";

export interface Student {
  id: string;
  userId: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  shift?: string;
  departmentId?: string;
  department?: Department;
  classId?: string;
  class?: classDetails;
  status: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  attendances: Attendance[];
}

export interface FetchStudentsResponse {
  data: Student[];
  message?: string;
  error?: string;
}

// Thunk to add a new student
export interface AddStudentPayload {
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  departmentId: string;
  shift?: string;
  classIds?: Array<{
    id: string
  }>;
}

export interface ClassAndStudentCountState {
data: Array<Object>;
loading: boolean;
error: string | null;
}

export interface AttendanceStudents {
    attendance: { status: string } | null;
    email: string;
    first_name: string;
    last_name: string;
    id: string;
  }

export interface AttendanceState {
  data: Array<AttendanceStudents>;
  loading: boolean;
  error: string | null;
}

// types.ts (or wherever appropriate)
export interface AttendancePayload {
  date: string; // e.g., '2023-10-04'
  students: {
    userId: string;
    status: string;
  }[];
}
