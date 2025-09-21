import { RootState } from "@/app/store/store"

export const tokenSelector = (state:RootState): string | null => state.auth.token;