"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItem as CartItemType } from "@/types/database";
import { useCartStore } from "@/store/cart";
import toast from "react-hot-toast";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();
  const { product, quantity } = item;

  const price = product.discount_price || product.price;
  const subtotal = price * quantity;

  const handleIncrement = () => {
    if (quantity < product.stock_quantity) {
      updateQuantity(product.id, quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    }
  };

  const handleRemove = () => {
    if (confirm("Удалить товар из корзины?")) {
      removeItem(product.id);
      toast.success("Товар удален из корзины");
    }
  };

  return (
    <div className="card p-4 flex flex-col sm:flex-row gap-4">
      {/* Image */}
      <Link
        href={`/products/${product.slug}`}
        className="relative w-full sm:w-24 h-24 flex-shrink-0 bg-lighter rounded-lg overflow-hidden group"
      >
        {product.images && product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name_ru || product.name_ko}
            fill
            className="object-cover group-hover:scale-110 transition-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-muted text-xs">Нет фото</span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link href={`/products/${product.slug}`} className="block group">
          {product.brand && (
            <p className="text-xs text-muted uppercase tracking-wide mb-1">
              {product.brand.name}
            </p>
          )}
          <h3 className="font-semibold text-white group-hover:text-primary transition-colors line-clamp-2">
            {product.name_ru || product.name_ko}
          </h3>
        </Link>

        {/* Price */}
        <div className="mt-2">
          <span className="text-lg font-bold text-primary">
            ₩{price.toLocaleString()}
          </span>
          {product.discount_price && (
            <span className="text-sm text-muted line-through ml-2">
              ₩{product.price.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* Quantity controls */}
      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4">
        {/* Quantity selector */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDecrement}
            disabled={quantity <= 1}
            className="w-8 h-8 rounded-lg bg-light hover:bg-lighter disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all"
          >
            <Minus size={14} className="text-secondary" />
          </button>
          <span className="text-white font-semibold w-8 text-center">
            {quantity}
          </span>
          <button
            onClick={handleIncrement}
            disabled={quantity >= product.stock_quantity}
            className="w-8 h-8 rounded-lg bg-light hover:bg-lighter disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all"
          >
            <Plus size={14} className="text-secondary" />
          </button>
        </div>

        {/* Subtotal */}
        <div className="text-right">
          <p className="text-xs text-muted mb-1">Итого:</p>
          <p className="text-lg font-bold text-white">
            ₩{subtotal.toLocaleString()}
          </p>
        </div>

        {/* Remove button */}
        <button
          onClick={handleRemove}
          className="w-8 h-8 rounded-lg bg-accent/10 hover:bg-accent/20 flex items-center justify-center transition-all group"
        >
          <Trash2
            size={16}
            className="text-accent group-hover:scale-110 transition-transform"
          />
        </button>
      </div>
    </div>
  );
}
