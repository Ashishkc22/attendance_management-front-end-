// src/types/Student.ts
export interface Student {
  id: number;
  first_name: string;
  last_name: string;
  attendance?: {
    id: string;
    status: string
  } | null;
}

