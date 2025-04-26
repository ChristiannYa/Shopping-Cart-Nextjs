"use client";

import { useAppSelector, useCartTab } from "@/lib/hooks";
import { selectCartItemsLength } from "@/lib/features/cart/cartSlice";
import { useUser } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function HomeHeader() {
  const router = useRouter();
  const { user, loading } = useUser();
  const { handleCartTabStatus } = useCartTab();
  const cartItemslength = useAppSelector(selectCartItemsLength);

  const handleUserClick = () => {
    if (user?.isLoggedIn) {
      router.push("/profile");
    } else {
      router.push("/login");
    }
  };

  // Combine first and last name for display
  const fullName = [user?.user?.firstName, user?.user?.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <header
      className="px-4 my-4 mx-auto flex justify-between items-center"
      style={{ width: "min(90%, 1000px)" }}
    >
      <div className="flex flex-col justify-center items-start my-4">
        <h1 className="page-title">Home Page</h1>
        <button
          onClick={handleUserClick}
          className="empty-bg-btn capitalize -ml-1.5"
        >
          {loading ? (
            <span className="block w-5 h-5 border-2 border-gray-500 border-t-white rounded-full animate-spin"></span>
          ) : user?.isLoggedIn ? (
            fullName
          ) : (
            "Guest"
          )}
        </button>
      </div>

      <div className="flex items-center gap-x-2">
        <button
          onClick={handleCartTabStatus}
          className="bg-white/5 hover:bg-white/10 hover:cursor-pointer rounded-full p-3 relative"
        >
          <Image
            aria-hidden
            src="/cart.svg"
            alt="File icon"
            width={19}
            height={19}
          />
          <span className="bg-blue-500 text-xs rounded-full w-[20px] h-[20px] p-2 flex items-center justify-center absolute -top-1.5 -right-1.5">
            {cartItemslength}
          </span>
        </button>
      </div>
    </header>
  );
}
