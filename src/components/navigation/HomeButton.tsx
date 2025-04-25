import Link from "next/link";

interface HomeButtonProps {
  className?: string;
}

const HomeButton = ({ className = "" }: HomeButtonProps) => {
  return (
    <Link href="/" className={`empty-bg-btn ${className}`}>
      Home
    </Link>
  );
};

export default HomeButton;
