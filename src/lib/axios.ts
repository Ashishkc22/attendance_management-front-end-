import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

type UrlMapper = {
  auth: string | undefined;
  user_management: string | undefined;
};

const urlMapper: UrlMapper = {
  auth: process.env.NEXT_PUBLIC_API_BASE_URL,
  user_management: process.env.NEXT_PUBLIC_USER_MANAGEMENT_API_BASE_URL,
};

function getToken(): string | undefined {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken") ?? undefined;
  }
  return undefined;
}

function getAxiosBase({ url }: { url: keyof UrlMapper }): AxiosInstance {
  const apiUrl = urlMapper[url];
  if (!apiUrl) {
    console.error("API base URL is not defined in the environment variables.");
    throw new Error("apiUrl not found");
  }
  const axiosInstance =  axios.create({
    baseURL: apiUrl,
    headers: {
      "Content-Type": "application/json",
    },
  });
  axiosInstance.interceptors.request.use(requestInterceptor,(err)=>Promise.reject(err));
  return axiosInstance
}

function requestInterceptor(config: InternalAxiosRequestConfig) {
  const authToken = getToken();
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
}

export default getAxiosBase;
