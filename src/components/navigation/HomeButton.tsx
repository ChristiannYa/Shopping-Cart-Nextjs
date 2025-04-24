import Link from "next/link";

const HomeButton = () => {
  return (
    <Link
      href="/"
      className="hover:cursor-pointer hover:text-blue-500 text-white text-sm rounded-xs px-1.5 py-1"
    >
      Home
    </Link>
  );
};

export default HomeButton;
