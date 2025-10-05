"user client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/app/store/store";
import {
  fetchClasses,
  addClass,
} from "@/app/features/userManagement/userThunk";
import { classDateSelector } from "@/app/features/userManagement/userSelectors";

interface ClassItem {
  id: string;
  name: string;
}

interface DepartmentClassesProps {
  departmentId: string;
}

const DepartmentClasses: React.FC<DepartmentClassesProps> = ({
  departmentId,
}) => {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [adding, setAdding] = useState(false);
  const classesState = useSelector(classDateSelector);
  const dispatch = useDispatch<AppDispatch>();

  const fetchClass = async () => {
    setLoading(true);
    try {
      dispatch(fetchClasses({ departmentId }));
    } catch (err) {
      console.error("Failed to fetch classes", err);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  const addClassHandler = async () => {
    const trimmed = newClassName.trim();
    if (!trimmed) {
      alert("Class name cannot be empty");
      return;
    }
    try {
      setAdding(true);
      const r = await dispatch(addClass({ name: trimmed,departmentId }));
      if(addClass.rejected.match(r)){
        throw new Error("failed in create department")
      }
      fetchClass();
      setNewClassName("");
    } catch (err) {
      console.error("Failed to add class", err);
      alert("Failed to add class. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  useEffect(() => {
    fetchClass();
  }, [departmentId]);

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Enter new class"
          value={newClassName}
          onChange={(e) => setNewClassName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addClassHandler();
            }
          }}
          disabled={adding}
        />
        <Button onClick={addClassHandler} disabled={adding}>
          {adding ? "Adding..." : "Add Class"}
        </Button>
      </div>

      {classesState?.loading ? (
        <p className="text-muted-foreground">Loading classes...</p>
      ) : (
        <ul className="pl-4 list-disc space-y-1">
          {classesState?.data && classesState?.data?.length > 0 ? (
            classesState?.data?.map((cls) => <li key={cls.id}>{cls.name}</li>)
          ) : (
            <li className="text-muted-foreground">No classes found.</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default DepartmentClasses;
