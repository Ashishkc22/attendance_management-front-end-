"use client";
import { useState } from "react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppDispatch } from "@/app/store/store";
import { loginUser } from "@/app/features/auth/authThunk";
import { tokenSelector } from "@/app/features/auth/authSelectors";

interface form {
  email: string | null;
  password: string | null;
}

export default function LoginPage() {
  const [formData, setFormData] = useState<form>({
    email: null,
    password: null,
  });
  const token = useSelector(tokenSelector);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleSubmit = async (e: React.ChangeEvent) => {
    e.preventDefault();
    if (formData.email && formData.password) {
      const result = await dispatch(
        loginUser({ email: formData.email, password: formData.password })
      );
      if (loginUser.fulfilled.match(result)) {
        localStorage.setItem("refreshToken", result.payload.data.refreshToken);
        localStorage.setItem("accessToken", result.payload.data.accessToken);
        router.push("/");
      }
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className=" w-92 rounded-2xl bg-white p-2">
        {/* logo and heading */}
        <div className="text-center">
          <div className="flex justify-center mt-5">
            <div className="bg-gray-200 rounded-full p-2">
              <Image src="/books.png" alt="hey" width={40} height={40} />
            </div>
          </div>
          <div className="text-sm my-2 font-semibold">Welcome Back</div>
          <div className="text-xs opacity-50 my-1">
            Sign in to your attendance management account
          </div>
        </div>

        {/* input fields and buttons */}
        <div className="my-4 mx-4">
          <div>
            <Label htmlFor="email" className="text-xs">
              Email
            </Label>
            <input
              type="email"
              name="email"
              onChange={(e) => handleFormChange(e)}
              placeholder="Enter your email."
              className="w-74 my-2 text-xs bg-gray-100 outline-4 border-1 border-white outline-white focus:outline-gray-300 rounded-md focus:border-1 px-2 py-1 focus:outline-4  transition-all duration-100"
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-xs">
              Password
            </Label>
            <input
              type="password"
              placeholder="Enter your password."
              name="password"
              onChange={handleFormChange}
              className="w-74 my-2 text-xs bg-gray-100 outline-4 border-1 border-white outline-white focus:outline-gray-300 focus:border-gray-500 rounded-md focus:border-1 px-2 py-1 focus:outline-4  transition-all duration-100"
            />
          </div>
          <div className="my-2">
            <button
              className="bg-black text-white w-74 rounded-md py-1 text-xs hover:cursor-pointer"
              onClick={handleSubmit}
            >
              Login
            </button>
          </div>
        </div>

        <div className="flex justify-center my-7">
          <Link
            href="/forgot-password"
            className="text-xs font-semibold opacity-60"
          >
            Forgot Password?
          </Link>
        </div>

        {/* demo credentials */}
        <div></div>
      </div>
    </div>
  );
}
