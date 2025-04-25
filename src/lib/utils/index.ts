export const formatDate = (dateString: string | null | undefined): string => {
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
};

export const formatPossessive = (name: string) => {
  if (!name) return "";
  return name.endsWith("s") ? `${name}'` : `${name}'s`;
};
