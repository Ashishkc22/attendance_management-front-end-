"use client";
import { Card } from "@/components/ui/card";
import { Table } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudents, deleteStudent } from "@/app/features/userManagement/userThunk";
import { Student } from "@/app/features/userManagement/userTypes";
import { AppDispatch } from "@/app/store/store";
import AddStudentForm from "./addStudent"

// ...existing code...
export default function StudentListPage() {

  const dispatch = useDispatch<AppDispatch>();
  const {
    data: students,
    loading,
    error,
  } = useSelector((state: any) => state.user.students);
  const [showForm, setShowForm] = React.useState(false);
  const [deleteDialog, setDeleteDialog] = React.useState<{ open: boolean; studentId: string | null }>({ open: false, studentId: null });

  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">Student List</h1>
        <button
          className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-medium shadow hover:bg-primary/90"
          onClick={() => setShowForm(true)}
        >
          + Invite Student
        </button>
      </div>
      {/* Modal for Add Student Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end justify-end">
          <div className="flex-1 backdrop-blur-md bg-white/20 pointer-events-none select-none" />
          <div
            className="w-full max-w-md bg-white shadow-xl p-0 relative rounded-t-xl transition-transform duration-300 ease-in-out"
            style={{
              marginBottom: 0,
              transform: showForm ? "translateY(0)" : "translateY(100%)",
            }}
          >
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
              onClick={() => setShowForm(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <AddStudentForm onSuccess={() => {
              setShowForm(false);
              dispatch(fetchStudents());
            }} />
          </div>
        </div>
      )}
      <Card className="p-4 bg-white shadow-lg rounded-lg">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : students.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a7.5 7.5 0 0115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.75z" />
            </svg>
            <div className="text-lg font-medium text-gray-500 mb-2">No students found</div>
            <div className="text-sm text-gray-400">Try inviting new students or check back later.</div>
          </div>
        ) : (
          <Table>
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Name</th>
                <th className="px-4 py-2 text-left font-semibold">Email</th>
                <th className="px-4 py-2 text-left font-semibold">Department</th>
                <th className="px-4 py-2 text-left font-semibold">Status</th>
                <th className="px-4 py-2 text-left font-semibold">Created Date</th>
                <th className="px-4 py-2 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student: Student, idx: number) => (
                <tr
                  key={student.id}
                  className={
                    idx % 2 === 0
                      ? "bg-white hover:bg-gray-50 transition"
                      : "bg-gray-50 hover:bg-gray-100 transition"
                  }
                >
                  <td className="px-4 py-2">{`${student.first_name} ${student.middle_name ? student.middle_name + ' ' : ''}${student.last_name}`}</td>
                  <td className="px-4 py-2">{student.email}</td>
                  <td className="px-4 py-2">{student.department?.name || '-'}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${student.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>{student.status}</span>
                  </td>
                  <td className="px-4 py-2">{new Date(student.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-2 text-right">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeleteDialog({ open: true, studentId: student.id })}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
      {/* Confirm Delete Dialog */}
      {deleteDialog.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-6">Are you sure you want to delete this student?</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteDialog({ open: false, studentId: null })}>Cancel</Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  if (deleteDialog.studentId) {
                    await dispatch(deleteStudent(deleteDialog.studentId));
                    dispatch(fetchStudents());
                  }
                  setDeleteDialog({ open: false, studentId: null });
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
