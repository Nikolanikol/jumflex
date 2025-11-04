"use client";

import { useState } from "react";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { Product } from "@/types/database";

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem(product, quantity);
    // TODO: Показать уведомление об успешном добавлении
    alert(`Добавлено в корзину: ${quantity} шт`);
  };

  const incrementQuantity = () => {
    if (quantity < product.stock_quantity) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="space-y-4">
      {/* Quantity selector */}
      <div className="flex items-center gap-4">
        <span className="text-white font-medium">Количество:</span>
        <div className="flex items-center gap-3">
          <button
            onClick={decrementQuantity}
            disabled={quantity <= 1}
            className="w-10 h-10 rounded-lg bg-light hover:bg-lighter disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all"
          >
            <Minus size={18} className="text-secondary" />
          </button>
          <span className="text-2xl font-bold text-white w-12 text-center">
            {quantity}
          </span>
          <button
            onClick={incrementQuantity}
            disabled={quantity >= product.stock_quantity}
            className="w-10 h-10 rounded-lg bg-light hover:bg-lighter disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all"
          >
            <Plus size={18} className="text-secondary" />
          </button>
        </div>
      </div>

      {/* Add to cart button */}
      <button
        onClick={handleAddToCart}
        disabled={product.stock_quantity === 0}
        className="w-full btn-primary flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ShoppingCart size={22} />
        <span>Добавить в корзину</span>
      </button>
    </div>
  );
}
