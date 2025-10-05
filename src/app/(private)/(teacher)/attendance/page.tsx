"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/app/store/store";
import {
  getClassAndStudentCount,
  getStudentsAttendance,
  markStudentAttendance
} from "@/app/features/userManagement/userThunk";
import {
  selectClassListWithStudentCount,
  selectStudentAttendance,
} from "@/app/features/userManagement/userSelectors";
import AttendanceTable from "./table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { CalendarIcon, Search } from "lucide-react";
import {
  toggleStudentAttendance,
  markAllStudents,
} from "@/app/features/userManagement/userSlice";

const AttendancePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlClassId = searchParams.get("classId");
  const {
    data: classList = [],
    loading: classesLoading,
    error: classesError,
  } = useSelector(selectClassListWithStudentCount);
  const students = useSelector(selectStudentAttendance);

  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState<string>("");

  const formattedDate = format(selectedDate, "yyyy-MM-dd");

  const fetchStudents = (
    departmentId: string,
    date = formattedDate,
    search = ""
  ) => {
    dispatch(getStudentsAttendance({ departmentId, date, search }));
  };

  // Initial fetch of class list
  useEffect(() => {
    dispatch(getClassAndStudentCount());
  }, [dispatch]);

  // Handle URL param preselection
  useEffect(() => {
    if (urlClassId) {
      setSelectedClass(urlClassId);
      fetchStudents(urlClassId);
    }
  }, [urlClassId]);

  // Debounced fetch on searchTerm change
  useEffect(() => {
    const handler = setTimeout(() => {
      if (selectedClass) {
        fetchStudents(selectedClass, formattedDate, searchTerm);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleToggleAttendance = (id: string, isPresent: boolean) => {
    // Optional: dispatch update attendance action here
    dispatch(toggleStudentAttendance({ studentId: id, isPresent }));
  };

  const handleSubmit = () => {
    if (!selectedClass) return;

    const payload = {
      date: formattedDate,
      students: students.data.map((d) => ({
        userId: d.id,
        status: d.attendance?.status || "Absent",
      })),
    }

    console.log("Submitted Attendance:", payload);

    dispatch(markStudentAttendance(payload))

    alert("Attendance submitted!");
  };

  const handleMarkAll = (isPresent: boolean) => {
    // Optional: dispatch bulk update attendance action
    dispatch(markAllStudents({ isPresent }));
  };

  const handleClassChange = (value: string) => {
    setSelectedClass(value);
    setSearchTerm(""); // Clear previous search
    fetchStudents(value);
    router.push(`?classId=${value}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 max-h-screen overflow-scroll">
      <Card>
        <CardHeader>
          <CardTitle>Attendance Management</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            {/* Class Selector */}
            <div className="w-full md:w-1/3">
              <Select
                value={selectedClass ?? undefined}
                onValueChange={handleClassChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  {classesLoading && (
                    <SelectItem value="loading">Loading...</SelectItem>
                  )}
                  {classesError && (
                    <SelectItem value="error">Error loading classes</SelectItem>
                  )}
                  {classList.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Picker */}
            <div className="w-full md:w-1/3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(selectedDate, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      if (date) {
                        const formatted = format(date, "yyyy-MM-dd");
                        setSelectedDate(date);
                        if (selectedClass) {
                          fetchStudents(selectedClass, formatted, searchTerm);
                        }
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Search Input */}
            <div className="w-full md:w-1/3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search student..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {selectedClass ? (
            <>
              {/* Mark All Buttons */}
              <div className="mb-4 flex gap-2">
                <Button variant="secondary" onClick={() => handleMarkAll(true)}>
                  Mark All Present
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleMarkAll(false)}
                >
                  Mark All Absent
                </Button>
              </div>

              {/* Student Table */}
              {students?.data?.length ? (
                <AttendanceTable
                  students={students.data}
                  onToggleAttendance={handleToggleAttendance}
                />
              ) : (
                <div className="text-center text-gray-500 py-12">
                  No students found
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <Button onClick={handleSubmit}>Submit Attendance</Button>
              </div>
            </>
          ) : (
            <p className="text-muted-foreground">
              Please select a class and date.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendancePage;
