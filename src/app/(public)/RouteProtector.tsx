"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function RouteProtector({
  children,
}: {
  children: React.ReactNode;
}) {
  const [token, setToken] = useState<string | undefined>(" ");
  const router = useRouter();
  useEffect(() => {
    const _token = localStorage.getItem("accessToken") as string | undefined;
    if (_token) {
      router.push("/dashboard");
    }
    setToken(_token);
  }, [router]);
  
  if (token) {
    return null;
  } else {
    return <div className="bg-blue-50">{children}</div>;
  }
}
