"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus } from "lucide-react";
import { useSession } from "next-auth/react";

export interface Address {
  street: string;
  city: string;
  houseNo: string;
  roomNo: string;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onQuantityChange: (id: number, quantity: number) => void;
  commission: number;
  setCommission: (val: number) => void;
  onPlaceOrder: (items: CartItem[], deliveryTime: string, address: Address) => void;
}

export default function CartModal({
  isOpen,
  onClose,
  cartItems,
  onQuantityChange,
  commission,
  setCommission,
  onPlaceOrder
}: CartModalProps) {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [deliveryTime, setDeliveryTime] = useState("");
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number | "new">("new");
  const [newAddress, setNewAddress] = useState<Address>({
    street: "",
    city: "",
    houseNo: "",
    roomNo: "",
  });

  // Fetch saved addresses when modal opens
  useEffect(() => {
    if (isOpen && userId) {
      fetch(`/api/user/addresses?userId=${userId}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data.addresses)) {
            setSavedAddresses(data.addresses);
            if (data.addresses.length > 0) setSelectedAddressIndex(0);
          }
        })
        .catch(console.error);
    }
  }, [isOpen, userId]);

  // Add new address
  const handleAddNewAddress = async () => {
    if (!newAddress.street || !newAddress.city || !newAddress.houseNo) {
      return alert("Please fill all required fields.");
    }

    const updated = [...savedAddresses, newAddress];
    setSavedAddresses(updated);
    setSelectedAddressIndex(updated.length - 1);
    setNewAddress({ street: "", city: "", houseNo: "", roomNo: "" });

    await fetch("/api/user/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, addresses: updated }),
    });
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal + commission;

  // Correctly choose the address
  const chosenAddress: Address =
    selectedAddressIndex === "new"
      ? newAddress
      : savedAddresses[selectedAddressIndex as number];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed top-1/2 left-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-lg p-6 flex flex-col max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Your Cart</h2>
              <button onClick={onClose}><X size={20} /></button>
            </div>

            {/* Delivery Time */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Delivery Time</label>
              <input
                type="text"
                placeholder="Enter delivery time (e.g., 30-45 mins)"
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
                className="w-full border rounded-lg p-2 text-sm outline-none"
              />
            </div>

            {/* Address Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Select Address</label>
              <select
                value={selectedAddressIndex}
                onChange={(e) =>
                  setSelectedAddressIndex(
                    e.target.value === "new" ? "new" : Number(e.target.value)
                  )
                }
                className="w-full border rounded-lg p-2 text-sm outline-none"
              >
                {savedAddresses.map((addr, i) => (
                  <option key={i} value={i}>
                    {`${addr.street}, ${addr.city} (House ${addr.houseNo})`}
                  </option>
                ))}
                <option value="new">➕ Add New Address</option>
              </select>
            </div>

            {/* New Address Fields */}
            {selectedAddressIndex === "new" && (
              <div className="space-y-2 mb-4">
                <input
                  type="text"
                  placeholder="Street"
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                  className="w-full border rounded-lg p-2 text-sm outline-none"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  className="w-full border rounded-lg p-2 text-sm outline-none"
                />
                <input
                  type="text"
                  placeholder="House No"
                  value={newAddress.houseNo}
                  onChange={(e) => setNewAddress({ ...newAddress, houseNo: e.target.value })}
                  className="w-full border rounded-lg p-2 text-sm outline-none"
                />
                <input
                  type="text"
                  placeholder="Room No"
                  value={newAddress.roomNo}
                  onChange={(e) => setNewAddress({ ...newAddress, roomNo: e.target.value })}
                  className="w-full border rounded-lg p-2 text-sm outline-none"
                />
                <button
                  onClick={handleAddNewAddress}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm"
                >
                  Save Address
                </button>
              </div>
            )}

            {/* Cart Items */}
            <div className="space-y-4 flex-1 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between border rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-md"/>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-slate-500">₹{item.price}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button onClick={() => onQuantityChange(item.id, Math.max(0, item.quantity - 1))} className="p-1 bg-slate-200 rounded-full"><Minus size={14}/></button>
                    <span>{item.quantity}</span>
                    <button onClick={() => onQuantityChange(item.id, item.quantity + 1)} className="p-1 bg-slate-200 rounded-full"><Plus size={14}/></button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-4 space-y-3 border-t pt-4">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Subtotal</span>
                <span className="font-medium">₹{subtotal}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Delivery Commission</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => setCommission(Math.max(0, commission - 10))} className="p-1 bg-slate-200 rounded-full"><Minus size={14}/></button>
                  <input type="number" value={commission} onChange={(e) => setCommission(Number(e.target.value))} className="w-16 border rounded-lg text-center text-sm"/>
                  <button onClick={() => setCommission(commission + 10)} className="p-1 bg-slate-200 rounded-full"><Plus size={14}/></button>
                </div>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>

            {/* Place Order */}
            <div className="mt-4">
              <button
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium"
                onClick={() => {
                  if (!chosenAddress || !chosenAddress.street || !chosenAddress.city || !chosenAddress.houseNo) {
                    return alert("Please select or add a valid address!");
                  }
                  onPlaceOrder(cartItems, deliveryTime, chosenAddress);
                  onClose();
                }}
              >
                Place Order
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
