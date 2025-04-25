"use client";

import LogouButton from "@/components/profile/LogouButton";
import HomeButton from "@/components/navigation/HomeButton";
import { useUser } from "@/lib/hooks";
import { formatDate, formatPossessive } from "@/lib/utils";

export default function Profile() {
  const { user, loading, error } = useUser();

  if (loading) {
    return (
      <div className="p-4 md:p-8">
        <div className="flex items-center gap-x-2 page-title">
          <p>Loading Profile Data</p>
          <span className="inline-block w-4 h-4 border-2 border-blue-500 border-t-blue-200 rounded-full animate-spin"></span>
        </div>
        <HomeButton className="-ml-1.5" />
      </div>
    );
  }

  if (error || !user?.isLoggedIn) {
    return (
      <div className="p-4 md:p-8">
        <div className="page-title text-red-500">Error loading profile</div>
        <p className="mb-4">Unable to load your profile information.</p>
        <HomeButton className="-ml-1.5" />
      </div>
    );
  }

  const { name, email, createdAt } = user.user || {};

  return (
    <div className="p-4 md:p-8">
      <div className="mb-4">
        <h1 className="page-title capitalize">
          {formatPossessive(name || "User")} Profile
        </h1>
        <HomeButton className="-ml-1.5" />
      </div>

      <div className="w-fit mb-4 space-y-2">
        <div className="flex items-center gap-x-1 flex-wrap">
          <p className="text-blue-400">Name:</p>
          <p>{name || "Not provided"}</p>
        </div>
        <div className="flex items-center gap-x-1 flex-wrap">
          <p className="text-blue-400">Email:</p>
          <p>{email || "Not provided"}</p>
        </div>
        <div className="flex items-center gap-x-1 flex-wrap">
          <p className="text-blue-400">Date created:</p>
          <p>
            {createdAt ? formatDate(createdAt.toLocaleString()) : "Unknown"}
          </p>
        </div>
      </div>

      <LogouButton />
    </div>
  );
}
