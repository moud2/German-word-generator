"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [message, setMessage] = useState("Verifying...");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setSuccess(false);
        setMessage("⚠️ Invalid verification link.");
        return;
      }

      try {
        const res = await fetch("/api/verify-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const result = await res.json();

        if (res.ok) {
          setSuccess(true);
          setMessage("✅ Email confirmed successfully! You can now log in.");
        } else {
          setSuccess(false);
          setMessage(result.error || "Verification failed.");
        }
      } catch (err) {
        console.error(err);
        setSuccess(false);
        setMessage("Something went wrong. Please try again.");
      }
    };

    verify();
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 px-4">
      <div className="bg-white p-6 rounded shadow text-center max-w-md w-full">
        <h1 className={`text-xl font-bold ${success ? "text-green-700" : "text-red-600"}`}>
          {message}
        </h1>
        {success && (
          <a
            href="/login"
            className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Go to Login
          </a>
        )}
      </div>
    </div>
  );
}
