
"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { fetchDepartments, addStudent } from "@/app/features/userManagement/userThunk";
import { AppDispatch } from "@/app/store/store";

export default function AddStudentForm({ onSuccess }: { onSuccess?: () => void }) {
	const dispatch = useDispatch<AppDispatch>();
	const { data: departments, loading: deptLoading } = useSelector((state: any) => state.user.department);

	const [form, setForm] = React.useState({
		first_name: "",
		middle_name: "",
		last_name: "",
		email: "",
		departmentId: "",
		shift: "",
		classId: "",
	});

	useEffect(() => {
		dispatch(fetchDepartments());
	}, [dispatch]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSelectChange = (name: string, value: string) => {
		setForm({ ...form, [name]: value });
	};

		const handleSubmit = async (e: React.FormEvent) => {
			e.preventDefault();
			const resultAction = await dispatch(addStudent(form));
			if (addStudent.fulfilled.match(resultAction)) {
				if (onSuccess) onSuccess();
			}
		};

	return (
		<Card className="p-6">
			<form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
				<div>
					<Label htmlFor="first_name">First Name</Label>
					<Input id="first_name" name="first_name" value={form.first_name} onChange={handleChange} required />
				</div>
				<div>
					<Label htmlFor="middle_name">Middle Name</Label>
					<Input id="middle_name" name="middle_name" value={form.middle_name} onChange={handleChange} />
				</div>
				<div>
					<Label htmlFor="last_name">Last Name</Label>
					<Input id="last_name" name="last_name" value={form.last_name} onChange={handleChange} required />
				</div>
				<div>
					<Label htmlFor="email">Email</Label>
					<Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
				</div>
				<div>
					<Label htmlFor="departmentId">Department</Label>
					<Select value={form.departmentId} onValueChange={val => handleSelectChange("departmentId", val)}>
						<SelectTrigger id="departmentId" name="departmentId">
							<SelectValue placeholder={deptLoading ? "Loading..." : "Select department"} />
						</SelectTrigger>
						<SelectContent>
							{departments && departments.length > 0 ? (
								departments.map((dept: any) => (
									<SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
								))
											) : (
												<SelectItem value="none" disabled>No departments found</SelectItem>
							)}
						</SelectContent>
					</Select>
				</div>
				<div>
					<Label htmlFor="shift">Shift</Label>
					<Input id="shift" name="shift" value={form.shift} onChange={handleChange} />
				</div>
				<div>
					<Label htmlFor="classId">Class</Label>
					<Input id="classId" name="classId" value={form.classId} onChange={handleChange} />
				</div>
				<div className="md:col-span-2 flex justify-end">
					<Button type="submit" variant="default">Add Student</Button>
				</div>
			</form>
		</Card>
	);
}
