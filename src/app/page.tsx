"use client";

import { useAppSelector } from "@/lib/hooks";

import {
  selectCartTabStatus,
  selectOrderStatus,
} from "@/lib/features/cart/cartSlice";
import HomeHeader from "@/components/layout/HomeHeader";
import ProductList from "@/components/products/ProductList";
import Cart from "@/components/cart/Cart";
import ConfirmOrder from "@/components/cart/ConfirmOrder";

export default function Home() {
  const cartTabStatus = useAppSelector(selectCartTabStatus);
  const orderStatus = useAppSelector(selectOrderStatus);

  return (
    <>
      <div
        className={`transition-all duration-500 ${
          cartTabStatus
            ? "-translate-x-64 blur-xs pointer-events-none"
            : "blur-none"
        } ${orderStatus ? "blur-xs" : "blur-none"}`}
      >
        <HomeHeader />
        <hr className="text-white/20 mb-8" />
        <ProductList />
      </div>
      <ConfirmOrder />
      <Cart />
    </>
  );
}
