"use client";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import {
  selectCartItems,
  selectOrderStatus,
  toggleOrderStatus,
} from "@/lib/features/cart/cartSlice";
import CartTotal from "./CartTotal";
import OrderItem from "./OrderItem";

export default function ConfirmOrder() {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const isOrderVisible = useAppSelector(selectOrderStatus);

  if (!isOrderVisible) {
    return null;
  }

  return (
    <aside className="bg-gray-800 rounded-lg w-[96%] sm:w-[400px] h-auto mx-auto p-4 z-10 fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <button
        onClick={() => dispatch(toggleOrderStatus())}
        className="rounded-full hover:cursor-pointer w-[18px] h-[18px] flex flex-col justify-center items-center absolute top-4 right-4"
      >
        ❌
      </button>
      <h2 className="font-semibold text-xl mb-2 sm:mb-4">Order Review</h2>
      <div>
        {cartItems.map((item, index) => (
          <div key={item.product_id}>
            <OrderItem item={item} />
            {/* Render hr if this is not the last item */}
            {index < cartItems.length - 1 && (
              <hr className="w-[96%] my-1 mx-auto border-white/20" />
            )}
          </div>
        ))}
      </div>
      <div className="text-sm flex flex-col items-end space-y-3 mt-3 mr-1">
        <div>
          <CartTotal />
        </div>
        <button className="submit-btn">Confirm</button>
      </div>
    </aside>
  );
}
