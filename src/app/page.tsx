"use client";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const userDetails = useSelector((state: any) => state.user.userDetails);

  useEffect(() => {
    if (userDetails?.data?.role === "ADMIN") {
      router.replace("/user-management");
    } else if (userDetails?.data?.role === "TEACHER") {
      router.replace("/students");
    } else{
      router.replace("/login");
    }
  }, [userDetails, router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-lg text-gray-600 gap-4">
      <svg className="w-10 h-10 text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
      <span className="font-medium">Redirecting you to your page</span>
      <span className="text-sm text-gray-400">Please wait while we check your role and route you to the right page.</span>
    </div>
  );
}
