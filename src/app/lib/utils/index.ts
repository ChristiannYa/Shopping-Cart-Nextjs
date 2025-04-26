import { NextAuthData, UserData } from "@/lib/definitions";
import crypto from "crypto";

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "N/A";

  const isoDateString = dateString.replace(" ", "T");

  try {
    return new Date(isoDateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
}

export function formatPossessive(name: string) {
  if (!name) return "";
  return name.endsWith("s") ? `${name}'` : `${name}'s`;
}

export function generateRandomHash() {
  return `oauth_${crypto.randomBytes(32).toString("hex")}`;
}

export function transformNextAuthToUserData(
  nextAuthData: NextAuthData
): UserData | null {
  // If no user or missing critical data, return null
  if (!nextAuthData?.user?.id || !nextAuthData.user.email) {
    return null;
  }

  // Split name into first and last name
  const nameParts = (nextAuthData.user.name || "").split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  return {
    isLoggedIn: true,
    user: {
      id: Number(nextAuthData.user.id),
      firstName,
      lastName,
      email: nextAuthData.user.email || "",
      createdAt: new Date().toISOString(),
    },
  };
}
