"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { AppDispatch } from "@/app/store/store"; // update path if needed
import { getClassAndStudentCount } from "@/app/features/userManagement/userThunk"; // adjust path
import { selectClassListWithStudentCount } from "@/app/features/userManagement/userSelectors"; // adjust path
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";


const ClassesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const classState = useSelector(selectClassListWithStudentCount) || {
    data: [],
    loading: false,
    error: null
  };
  const { data: classList, loading, error } = classState;

  useEffect(() => {
    dispatch(getClassAndStudentCount());
  }, [dispatch]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Classes</h1>

      {loading && (
        <div className="flex justify-center items-center py-10">
          <Loader2Icon className="animate-spin h-6 w-6 text-muted-foreground" />
        </div>
      )}

      {error && (
        <p className="text-red-500 text-center py-4">
          Failed to load class data.
        </p>
      )}

      {!loading && classList?.length === 0 && (
        <p className="text-center text-muted-foreground">No classes found.</p>
      )}

      {!loading && classList?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {classList.map((cls) => (
            <Card key={cls.id}>
              <CardHeader>
                <CardTitle>{cls.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <p className="text-muted-foreground">
                  Students: {cls.studentCount}
                </p>
                <Button asChild>
                  <Link href={`/attendance?classId=${cls.id}`}>
                    View Attendance
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClassesPage;
