import axios,{ AxiosInstance } from "axios"
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;


// Ensure that apiUrl is not undefined
if (!apiUrl) {
    console.error("API base URL is not defined in the environment variables.");
} 
const apiBase: AxiosInstance = axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': "application/json"
    }
});
export default apiBase;