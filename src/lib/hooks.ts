import { useState, useEffect } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import type { RootState, AppDispatch, AppStore } from "./store";
import { toggleCartTabStatus } from "./features/cart/cartSlice";
import { NextAuthData, Product, UserData } from "./definitions";
import { signOut, useSession } from "next-auth/react";
import { transformNextAuthToUserData } from "@/app/lib/utils";

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
  // NextAuth's useSession for Google authentication
  const { data: nextAuthSession, status: nextAuthStatus } = useSession();

  // Custom fetch for traditional authentication
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Skip the API call if NextAuth already has a session
    if (nextAuthStatus === "authenticated" && nextAuthSession) {
      // Transform NextAuth data to our UserData format
      const nextAuthTransformedData = transformNextAuthToUserData(
        nextAuthSession as NextAuthData
      );

      // If transformation failed (missing critical data)
      if (!nextAuthTransformedData) {
        console.error("Authenticated session missing critical user data");
        signOut({
          callbackUrl:
            "/login?error=incomplete_profile&message=Your session data was incomplete. Please sign in again.",
        });
        return;
      }

      // Use the transformed data
      setUserData(nextAuthTransformedData);
      setLoading(false);
      return;
    }

    // Only fetch from API if NextAuth doesn't have a session
    if (nextAuthStatus !== "loading") {
      const fetchUser = async () => {
        try {
          const response = await fetch("/api/user");
          if (!response.ok) throw new Error("Failed to fetch user data");
          const data = await response.json();
          setUserData(data);
        } catch (err) {
          console.error("Error fetching user:", err);
          setError(
            err instanceof Error
              ? err.message
              : "An error occurred while fetching user data"
          );
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    }
  }, [nextAuthStatus, nextAuthSession]);

  return {
    user: userData,
    loading: nextAuthStatus === "loading" || loading,
    error,
  };
}
