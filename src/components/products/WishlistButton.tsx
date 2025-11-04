"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@/store/wishlist";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface WishlistButtonProps {
  productId: string;
  size?: number;
  className?: string;
}

export default function WishlistButton({
  productId,
  size = 20,
  className = "",
}: WishlistButtonProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { addItem, removeItem, isInWishlist } = useWishlistStore();
  const [loading, setLoading] = useState(false);

  const inWishlist = isInWishlist(productId);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Если пользователь не авторизован
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    setLoading(true);

    try {
      if (inWishlist) {
        // Удалить из избранного
        const response = await fetch(
          `/api/user/wishlist?product_id=${productId}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          removeItem(productId);
        }
      } else {
        // Добавить в избранное
        const response = await fetch("/api/user/wishlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ product_id: productId }),
        });

        if (response.ok) {
          addItem(productId);
        }
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`p-2 rounded-lg transition-all group  ${
        inWishlist
          ? "bg-accent/10 hover:bg-accent/20"
          : "bg-light hover:bg-lighter"
      } ${className}`}
      title={inWishlist ? "Удалить из избранного" : "Добавить в избранное"}
    >
      <Heart
        size={size}
        className={`transition-all ${
          inWishlist
            ? "fill-accent text-accent"
            : "text-secondary group-hover:text-accent"
        } ${loading ? "opacity-50" : ""}`}
      />
    </button>
  );
}
