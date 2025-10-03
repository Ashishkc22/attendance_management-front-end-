"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { userDetails } from "@/app/features/userManagement/userThunk";
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
    console.log("_token", _token);
    if (!_token) {
      router.push("/login");
    } else {
      dispatch(userDetails()).then((d) => {
        if (d?.payload?.message == "Invalid or expired token") {
          localStorage.removeItem("accessToken");
          router.push("/login");
        }
      });
    }
    setToken(_token);
  }, [router, dispatch]);
  if (!token) {
    return null;
  } else {
    return <>{children}</>;
  }
}
