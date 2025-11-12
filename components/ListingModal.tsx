"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Search } from "lucide-react";
import ProductCard from "./ProductCard";
import axios from "axios";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface ListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCart: (cart: CartItem[]) => void; // changed to full cart items
}

export default function ListingModal({ isOpen, onClose, onOpenCart }: ListingModalProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch products from DB API
  useEffect(() => {
    if (!isOpen) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get<Product[]>("/api/getItem");
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [isOpen]);

  // Update cart with full product detail + quantity
  const handleQuantityChange = (id: number, quantity: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing) {
        if (quantity === 0) {
          return prev.filter((item) => item.id !== id);
        }
        return prev.map((item) =>
          item.id === id ? { ...item, quantity } : item
        );
      } else {
        const product = products.find((p) => p.id === id);
        if (!product) return prev;
        return [...prev, { ...product, quantity }];
      }
    });
  };

  const totalItems = cart.reduce((a, item) => a + item.quantity, 0);

  // Filter products based on search
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ y: -50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -50, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed top-1/2 left-1/2 z-50 w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-lg p-6 flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Create Listing</h2>
              <button onClick={onClose}>
                <X size={20} />
              </button>
            </div>

            {/* Search Bar */}
            <div className="flex items-center bg-slate-100 rounded-lg px-3 py-2 shadow-inner mb-4">
              <Search size={18} className="text-slate-500" />
              <input
                type="text"
                placeholder="Search items..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="ml-2 flex-1 bg-transparent outline-none text-sm"
              />
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 flex-1 overflow-y-auto">
              {loading ? (
                <div className="col-span-full text-center text-sm text-slate-500">
                  Loading products...
                </div>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    {...p}
                    onQuantityChange={handleQuantityChange}
                  />
                ))
              ) : (
                <div className="col-span-full text-center text-sm text-slate-500">
                  No products found
                </div>
              )}
            </div>

            {/* Cart Button at Bottom */}
            <div className="mt-4">
              <button
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium"
                disabled={totalItems === 0}
                onClick={() => {
                  onClose(); // close listing modal
                  onOpenCart(cart); // pass full cart details
                }}
              >
                <ShoppingCart size={20} />
                {totalItems > 0 ? `Go to Cart (${totalItems} items)` : "Cart is Empty"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
