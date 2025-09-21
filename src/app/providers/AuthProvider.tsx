"use client";

import { useDispatch, useSelector } from "react-redux";
import { tokenSelector } from "../features/auth/authSelectors";
import { getAccesstoken } from "../features/auth/authThunk";
import { AppDispatch } from "../store/store";
import { useEffect } from "react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
  const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      dispatch(getAccesstoken())
        .then((res) => {
          console.log("Refresh res: ", res);
        })
        .catch((err) => {
          console.log("Refresh error: ", err);
        });
    }
  }, [dispatch]);

  return <>{children}</>;
}
