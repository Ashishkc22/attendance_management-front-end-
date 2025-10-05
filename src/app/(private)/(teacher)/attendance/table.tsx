import React from "react";
import { Student } from "./typs";
import AttendanceRow from "./row";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
} from "@/components/ui/table";
import { AttendanceStudents } from "@/app/features/userManagement/userTypes";

interface AttendanceTableProps {
  students: Array<AttendanceStudents>;
  onToggleAttendance: (id: string, isPresent: boolean) => void;
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({
  students,
  onToggleAttendance,
}) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12 text-cente mx-2">Present</TableHead>
            <TableHead >ID</TableHead>
            <TableHead >Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <AttendanceRow
              key={student.id}
              student={student}
              onToggle={onToggleAttendance}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AttendanceTable;
