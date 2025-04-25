import { useState, useEffect } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import type { RootState, AppDispatch, AppStore } from "./store";
import { toggleCartTabStatus } from "./features/cart/cartSlice";
import { Product, UserData } from "./definitions";

// Use throughout the app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();

export const useCartTab = () => {
  const dispatch = useAppDispatch();

  const handleCartTabStatus = () => {
    dispatch(toggleCartTabStatus());
  };

  return { handleCartTabStatus };
};

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(
          // If err is an instance of Error, use its message, otherwise use a generic error message
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
};

export function useUser() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user");
        const data = await response.json();
        setUserData(data);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred when fetching user data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user: userData, loading, error };
}
