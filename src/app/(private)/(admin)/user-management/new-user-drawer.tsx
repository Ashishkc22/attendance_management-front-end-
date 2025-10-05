"use client";

import { useState, useEffect } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogClose,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import { UserPlus, Loader2Icon } from "lucide-react";
import { AppDispatch } from "@/app/store/store";
import {
  inviteUser as inviteUserSelector,
  department,
  classDateSelector,
} from "@/app/features/userManagement/userSelectors";
import {
  inviteUser,
  fetchDepartments,
  fetchClasses,
} from "@/app/features/userManagement/userThunk";
import { ClassState } from "@/app/features/userManagement/userTypes";

interface InviteUserPayload {
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  departmentId: string;
  role: string;
  shift?: string;
  classIds?: Array<{
    id: string;
  }>;
}

interface NewUserDialogProps {
  isOpen: boolean;
  handleDialogClose: () => void;
}

export function NewUserDialog({ isOpen, handleDialogClose }: NewUserDialogProps) {
  const inviteUserState = useSelector(inviteUserSelector);
  const departmentState = useSelector(department);
  const classData = useSelector(classDateSelector);
  const dispatch = useDispatch<AppDispatch>();

  const [hasMounted, setHasMounted] = useState(false);

  const [formData, setFormData] = useState<InviteUserPayload>({
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    departmentId: "",
    role: "TEACHER",
    classIds: [],
  });

  const handleChange = (
    field: string,
    value: string | string[] | object[]
  ) => {
    if (field === "departmentId" && typeof value === "string") {
      dispatch(fetchClasses({ departmentId: value }));
    }
    if (Array.isArray(value)) {
      setFormData((prev) => ({ ...prev, [field]: [...value] }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSave = () => {
    dispatch(inviteUser(formData));
  };

  useEffect(() => {
    setHasMounted(true);
    dispatch(fetchDepartments());
  }, [dispatch]);

  if (!hasMounted) return null;

  return (
    <Dialog open={isOpen} onOpenChange={()=> handleDialogClose()}>
      <DialogContent className="p-6 max-w-md mx-auto w-full">
        <VisuallyHidden>
          <DialogTitle>Invite New User</DialogTitle>
        </VisuallyHidden>

        <div className="mb-5 pr-8 border-r border-gray-200 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-primary mb-2">
            <UserPlus className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Invite New User</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Send an invitation to add a new team member to the system
          </p>
        </div>

        <div className="grid gap-4">
          <Input
            placeholder="First Name"
            value={formData.first_name}
            onChange={(e) => handleChange("first_name", e.target.value)}
          />
          <Input
            placeholder="Middle Name"
            value={formData.middle_name}
            onChange={(e) => handleChange("middle_name", e.target.value)}
          />
          <Input
            placeholder="Last Name"
            value={formData.last_name}
            onChange={(e) => handleChange("last_name", e.target.value)}
          />
          <Input
            placeholder="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />

          {/* Department Select */}
          {departmentState?.data && (
            <Select
              value={formData.departmentId}
              onValueChange={(value) => handleChange("departmentId", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                {departmentState.data.map((d) => (
                  <SelectItem value={d.id} key={d.id}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* ✅ Classes as Labeled Checkboxes */}
          {classData?.data && classData.data.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Assign Classes
              </label>
              <div className="border rounded-md p-3 max-h-48 overflow-auto space-y-2 bg-white shadow-sm">
                {classData.data.map((cls) => {
                  const isChecked = formData.classIds?.some(
                    (c) => c.id === cls.id
                  );

                  return (
                    <label
                      key={cls.id}
                      className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          const selected = formData.classIds || [];
                          if (isChecked) {
                            handleChange(
                              "classIds",
                              selected.filter((c) => c.id !== cls.id)
                            );
                          } else {
                            handleChange("classIds", [
                              ...selected,
                              { id: cls.id },
                            ]);
                          }
                        }}
                        className="form-checkbox h-4 w-4 text-primary border-gray-300"
                      />
                      <span className="text-sm text-gray-800">
                        {cls.name}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          <Input
            placeholder="Shift"
            value={formData.shift || ""}
            onChange={(e) => handleChange("shift", e.target.value)}
          />

          <Select
            value={formData.role}
            onValueChange={(value) => handleChange("role", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TEACHER">Teacher</SelectItem>
              {/* Add more roles as needed */}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter className="pt-6 flex gap-2">
          <DialogClose asChild>
            <Button variant="outline" onClick={() => handleDialogClose()}>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleSave} disabled={inviteUserState?.loading}>
            {inviteUserState?.loading ? (
              <>
                <Loader2Icon className="animate-spin mr-2" /> Loading
              </>
            ) : (
              <>Save</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
