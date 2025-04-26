"use client";

import LogouButton from "@/components/profile/LogouButton";
import HomeButton from "@/components/navigation/HomeButton";
import { useUser } from "@/lib/hooks";
import { formatDate, formatPossessive } from "@/app/lib/utils";

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

  const { firstName, lastName, email, createdAt } = user.user || {};

  return (
    <div className="p-4 md:p-8">
      <div className="mb-4">
        <h1 className="page-title capitalize">
          {formatPossessive(firstName!)} Profile
        </h1>
        <HomeButton className="-ml-1.5" />
      </div>
      <div className="w-fit mb-4 space-y-1">
        <div className="flex items-center gap-x-1 flex-wrap">
          <p>First Name:</p>
          <p className="text-white/60">{firstName || "Not provided"}</p>
        </div>
        <div className="flex items-center gap-x-1 flex-wrap">
          <p>Last Name:</p>
          <p className="text-white/60">{lastName || "Not provided"}</p>
        </div>
        <div className="flex items-center gap-x-1 flex-wrap">
          <p>Email:</p>
          <p className="text-white/60">{email || "Not provided"}</p>
        </div>
        <div className="flex items-center gap-x-1 flex-wrap">
          <p>Date created:</p>
          <p className="text-white/60">
            {createdAt ? formatDate(createdAt.toLocaleString()) : "Unknown"}
          </p>
        </div>
      </div>
      <LogouButton />
    </div>
  );
}
