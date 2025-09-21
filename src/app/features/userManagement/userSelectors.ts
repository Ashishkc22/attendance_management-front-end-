import { RootState } from "@/app/store/store";
import { InviteUserState,ClassState,DepartmentsState,UsersState,userDetailsType } from "./userTypes";

export const inviteUser = (state: RootState): InviteUserState | null =>
  state.user.inviteUser;

export const classDateSelector = (state: RootState): ClassState | null =>
  state.user.class;

export const department = (state: RootState): DepartmentsState | null =>
  state.user.department;

export const usersSelector = (state: RootState): UsersState | null =>
  state.user.users;

export const userDetailsSelector = (state: RootState): userDetailsType | null =>
  state.user.userDetails;