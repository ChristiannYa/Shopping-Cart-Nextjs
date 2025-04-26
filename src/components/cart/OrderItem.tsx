"use client";

import { CartItem } from "@/lib/definitions";
import { useAppSelector } from "@/lib/hooks";
import { selectItemTotal } from "@/lib/features/cart/cartSlice";

interface OrderItemProps {
  item: CartItem;
}

export default function OrderItem({ item }: OrderItemProps) {
  const itemTotal = useAppSelector((state) =>
    selectItemTotal(state, item.product_id)
  );

  return (
    <div className="p-1 text-sm">
      <h3>{item.name}</h3>
      <div className="flex gap-x-1 items-center">
        <p className="text-white/90">${item.price}</p>
        <p className="text-white/60 text-sm">x{item.quantity}</p>
        <p className="ml-auto">${itemTotal.toFixed(2)}</p>
      </div>
    </div>
  );
}
