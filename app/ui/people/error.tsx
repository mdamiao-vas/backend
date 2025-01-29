"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-lg w-full space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-gray-900 animate-fade-in-down">
            Oops! Something went wrong
          </h1>
          <p className="text-xl text-gray-500 animate-fade-in-up">
            We are sorry, but we encountered an unexpected error.
          </p>
        </div>
        <div className="bg-white shadow-xl rounded-lg p-8 space-y-4 animate-fade-in">
          <p className="text-gray-700">
            Error: {error.message || "An unexpected error occurred"}
          </p>
          {error.digest && (
            <p className="text-sm text-gray-500">Error ID: {error.digest}</p>
          )}
        </div>
        <div className="space-x-4 animate-fade-in-up">
          <button onClick={reset}>Try again</button>
          <button>
            <Link href="/">Return Home</Link>
          </button>
        </div>
      </div>
    </div>
  );
}
