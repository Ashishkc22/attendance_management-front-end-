"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation"; // Import useRouter from next/router
import { Input } from "@/components/ui/input"; // Import Input and Button from ShadCN
import { Button } from "@/components/ui/button"; // Import Input and Button from ShadCN
import { useDispatch } from "react-redux";
import { resetPassword } from "@/app/features/auth/authThunk";
import { AppDispatch } from "@/app/store/store";

export default function ResetPasswordPage() {
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter(); // Initialize useRouter hook
  const searchParams = useParams();

  // Optional: If you need to validate the token or make an API call
  useEffect(() => {
    const tokenParam = searchParams.token;
    if (tokenParam) {
      setToken(tokenParam as string);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset any previous error/success messages
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validate passwords
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }
    if (token === null) {
      setErrorMessage("Missing token");
      return;
    }
    setIsLoading(true);
    // Simulate API call to reset password using the token
    await dispatch(
      resetPassword({
        token,
        newPassword:password,
      })
    );
    router.push("/login")
    setSuccessMessage("Password reset successfully!");
    setIsLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Reset Your Password
        </h2>

        {/* Display token if available */}
        {/* {token && (
          <p className="text-center text-sm text-gray-500">
            Auth Token: {token}
          </p>
        )} */}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full"
              placeholder="Enter your new password"
              required
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <Input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-2 w-full"
              placeholder="Confirm your password"
              required
            />
          </div>

          {/* Display error message if passwords don't match */}
          {errorMessage && (
            <div className="mt-2 text-red-500 text-sm">{errorMessage}</div>
          )}

          {/* Display success message */}
          {successMessage && (
            <div className="mt-2 text-green-500 text-sm">{successMessage}</div>
          )}

          <div className="mt-4">
            <Button
              type="submit"
              className={`w-full p-3 rounded-lg transition-all duration-300 ${
                isLoading || password !== confirmPassword
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-gray-800"
              }`}
              disabled={isLoading || password !== confirmPassword}
            >
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 1116 0A8 8 0 014 12z"
                    ></path>
                  </svg>
                  Resetting...
                </div>
              ) : (
                "Reset Password"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
