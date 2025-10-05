"use client";

import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { AttendanceStudents } from "@/app/features/userManagement/userTypes";

interface AttendanceRowProps {
  student: AttendanceStudents;
  onToggle: (id: string, isPresent: boolean) => void;
}

const AttendanceRow: React.FC<AttendanceRowProps> = ({ student, onToggle }) => {
  return (
    <TableRow>
      <TableCell className="text-center">
        <Checkbox
          checked={student.attendance?.status == "Present" ? true: false}
          onCheckedChange={(checked) => onToggle(student.id, Boolean(checked))}
        />
      </TableCell>
      <TableCell>{student.id}</TableCell>
      <TableCell>{`${student.first_name} ${student.last_name}`}</TableCell>
    </TableRow>
  );
};

export default AttendanceRow;
