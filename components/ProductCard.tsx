"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  onQuantityChange: (id: number, quantity: number) => void;
}

export default function ProductCard({ id, name, price, image, onQuantityChange }: ProductCardProps) {
  const [quantity, setQuantity] = useState(0);

  const increase = () => {
    const newQty = quantity + 1;
    setQuantity(newQty);
    onQuantityChange(id, newQty);
  };

  const decrease = () => {
    if (quantity === 0) return;
    const newQty = quantity - 1;
    setQuantity(newQty);
    onQuantityChange(id, newQty);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-3 flex flex-col">
      {/* Product Image */}
      <img
        src={image}
        alt={name}
        className="w-full h-32 object-cover rounded-lg mb-3"
      />

      {/* Product Info */}
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold truncate">{name}</h3>
        <span className="text-sm font-bold text-green-600">₹{price}</span>
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center justify-center mt-3">
        <button
          onClick={decrease}
          className="p-1 bg-slate-100 rounded-full disabled:opacity-50"
          disabled={quantity === 0}
        >
          <Minus size={16} />
        </button>

        <span className="mx-3 text-sm font-medium">{quantity}</span>

        <button
          onClick={increase}
          className="p-1 bg-green-500 text-white rounded-full hover:bg-green-600"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}
