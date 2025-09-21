"use client";

import { useState, useEffect } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerClose,
  DrawerTrigger,
  DrawerTitle,
} from "@/components/ui/drawer";
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
  classDateSelector,
  department,
  usersSelector
} from "@/app/features/userManagement/userSelectors";
import {
  inviteUser,
  fetchClasses,
  fetchDepartments,
} from "@/app/features/userManagement/userThunk";
import { InviteUserPayload } from "@/app/features/userManagement/userTypes";

interface NewUserDrawerProps {
  children: React.ReactNode; // For trigger (like a button)
}

export function NewUserDrawer({ children }: NewUserDrawerProps) {
  const inviteUserState = useSelector(inviteUserSelector);
  const departmentState = useSelector(department);
  
  const [hasMounted, setHasMounted] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState<InviteUserPayload>({
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    shift: "",
    departmentId: "",
    role: "TEACHER",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    dispatch(inviteUser(formData)); // Uncomment and use your real Redux action
  };

  useEffect(() => {
    setHasMounted(true);
    dispatch(fetchDepartments());
  }, []);

  if (!hasMounted) return null;

  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="p-6 max-w-md ml-auto mr-0 w-full h-fit">
        <VisuallyHidden>
          <DrawerTitle>Hidden Title</DrawerTitle>
        </VisuallyHidden>
        {/* Left side - title & subtitle */}
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
          {departmentState?.data && (
            <Select
              value={formData.departmentId}
              onValueChange={(value) => handleChange("departmentId", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                {departmentState?.data?.map((d) => (
                  <SelectItem value={d.id} key={d.name}>{d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Input
            placeholder="Shift"
            value={formData.shift}
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
              <SelectItem value="STUDENT">Student</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DrawerFooter className="pt-6 flex gap-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
          <Button onClick={handleSave} disabled={inviteUserState?.loading}>
            {inviteUserState?.loading ? (
              <>
                <Loader2Icon className="animate-spin" /> Loading
              </>
            ) : (
              <>Save</>
            )}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
