"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    router.push("/login");
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-600">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen ">
      <div className="bg-white/80 backdrop-blur-md rounded-lg shadow-lg p-6 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome, <span className="text-blue-600">{session.user.username}</span>
        </h1>
        <p className="mt-4 text-gray-600">
          You are successfully logged in. Explore your personalized dashboard.
        </p>
        <button
          onClick={() => router.push("/")}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}
