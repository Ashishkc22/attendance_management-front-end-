"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {userDetails} from "@/app/features/userManagement/userThunk"
import { AppDispatch } from "../store/store";

export default function RouteProtector({
  children,
}: {
  children: React.ReactNode;
}) {
  const [token, setToken] = useState<string | undefined>("");
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  useEffect(() => {
    const _token = localStorage.getItem("accessToken") as string | undefined;
    if (!_token) {
      router.push("/login");
    }else{
      dispatch(userDetails());
    }
    setToken(_token);
  }, [router]);
  if (!token) {
    return null;
  } else {
    return <>{children}</>;
  }
}
