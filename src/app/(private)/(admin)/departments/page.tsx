"use client";

import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import axios from "axios"; // Your axios instance here
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DepartmentClasses from "./DepartmentClasses"; // Adjust path as needed
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/app/store/store";
import {
  fetchDepartments,
  addDepartment,
} from "@/app/features/userManagement/userThunk";
import { department as departmentSelector } from "@/app/features/userManagement/userSelectors";

// Types
interface Department {
  id: string;
  name: string;
}

interface ClassItem {
  id: string;
  name: string;
}

// Fetch classes for department
const fetchClassesByDepartment = async (
  departmentId: string
): Promise<ClassItem[]> => {
  const res = await axios.get(`/departments/${departmentId}/classes`);
  return res.data;
};

// Delete department API call
const deleteDepartment = async (departmentId: string): Promise<void> => {
  await axios.delete(`/departments/${departmentId}`);
};

const DepartmentsPage: React.FC = () => {
  const departments = useSelector(departmentSelector);

  const [expandedDeptId, setExpandedDeptId] = useState<string | null>(null);
  const [classMap, setClassMap] = useState<Record<string, ClassItem[]>>({});
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [newDepartment, setNewDepartment] = useState("");
  const [adding, setAdding] = useState(false);
  const [removingDeptId, setRemovingDeptId] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const handleToggle = async (departmentId: string) => {
    const isExpanding = expandedDeptId !== departmentId;

    if (isExpanding) {
      setExpandedDeptId(departmentId);

      if (!classMap[departmentId]) {
        setLoadingClasses(true);
        try {
          const classes = await fetchClassesByDepartment(departmentId);
          setClassMap((prev) => ({
            ...prev,
            [departmentId]: classes,
          }));
        } catch (err) {
          console.error("Failed to fetch classes", err);
        } finally {
          setLoadingClasses(false);
        }
      }
    } else {
      setExpandedDeptId(null);
    }
  };

  const handleAddDepartment = async () => {
    const trimmed = newDepartment.trim();
    if (!trimmed) {
      alert("Department name cannot be empty");
      return;
    }

    try {
      setAdding(true);
      console.log("Adding department:", trimmed);

      const created = await dispatch(addDepartment({ name: trimmed }));
      if (addDepartment.rejected.match(created)) {
        throw new Error("failed in create department");
      }
      console.log("Created department response:", created);
      dispatch(fetchDepartments());
      setNewDepartment("");
    } catch (err) {
      console.error("Failed to add department", err);
      alert("Failed to add department. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveDepartment = async (departmentId: string) => {
    if (!confirm("Are you sure you want to remove this department?")) {
      return;
    }

    try {
      setRemovingDeptId(departmentId);
      await deleteDepartment(departmentId);
      if (expandedDeptId === departmentId) {
        setExpandedDeptId(null);
      }

      setClassMap((prev) => {
        const copy = { ...prev };
        delete copy[departmentId];
        return copy;
      });
    } catch (err) {
      console.error("Failed to remove department", err);
      alert("Failed to remove department. Please try again.");
    } finally {
      setRemovingDeptId(null);
    }
  };

  useEffect(() => {
    dispatch(fetchDepartments());
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Department Management</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Add Department Input */}
          <div className="flex gap-2 mb-6">
            <Input
              placeholder="Enter new department"
              value={newDepartment}
              onChange={(e) => setNewDepartment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddDepartment();
                }
              }}
            />
            <Button onClick={handleAddDepartment} disabled={adding}>
              {adding ? "Adding..." : "Add Department"}
            </Button>
          </div>

          {/* Accordion for departments */}
          {departments?.data ? (
            <Accordion
              type="single"
              collapsible
              value={expandedDeptId ?? ""}
              onValueChange={(value) => handleToggle(value || "")}
            >
              {departments?.data?.map((dept) => (
                // Inside your AccordionItem map:
                <AccordionItem key={dept.id} value={dept.id}>
                  <AccordionTrigger>
                    <div className="flex justify-between items-center w-full">
                      <span>{dept.name}</span>
                      {/* <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveDepartment(dept.id);
                        }}
                        disabled={removingDeptId === dept.id}
                      >
                        {removingDeptId === dept.id ? "Removing..." : "Remove"}
                      </Button> */}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {expandedDeptId === dept.id && (
                      <DepartmentClasses departmentId={dept.id} />
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-sm text-gray-500 italic px-2 py-1">
              No departments available.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DepartmentsPage;
