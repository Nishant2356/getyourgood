"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash } from "lucide-react";

interface Address {
  street: string;
  city: string;
  houseNo: string;
  roomNo: string;
}

interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
}

export default function AddAddressModal({ isOpen, onClose, userId }: AddAddressModalProps) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [newAddress, setNewAddress] = useState<Address>({
    street: "",
    city: "",
    houseNo: "",
    roomNo: "",
  });

  // Fetch existing addresses
  useEffect(() => {
    if (isOpen) {
      fetch(`/api/user/addresses?userId=${userId}`)
        .then((res) => res.json())
        .then((data) => setAddresses(data.addresses || []))
        .catch(console.error);
    }
  }, [isOpen, userId]);

  const handleAdd = async () => {
    if (!newAddress.street || !newAddress.city) return alert("Please fill all fields.");
    const updated = [...addresses, newAddress];
    setAddresses(updated);
    setNewAddress({ street: "", city: "", houseNo: "", roomNo: "" });

    await fetch("/api/user/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, addresses: updated }),
    });
  };

  const handleDelete = async (index: number) => {
    const updated = addresses.filter((_, i) => i !== index);
    setAddresses(updated);

    await fetch("/api/user/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, addresses: updated }),
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed top-1/2 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Manage Addresses</h2>
              <button onClick={onClose}>
                <X size={20} />
              </button>
            </div>

            {/* Existing addresses */}
            <div className="space-y-3 mb-5 max-h-64 overflow-y-auto">
              {addresses.length > 0 ? (
                addresses.map((addr, i) => (
                  <div
                    key={i}
                    className="border rounded-lg p-3 flex justify-between items-start"
                  >
                    <div className="text-sm">
                      <p><strong>Street:</strong> {addr.street}</p>
                      <p><strong>City:</strong> {addr.city}</p>
                      <p><strong>House No:</strong> {addr.houseNo}</p>
                      <p><strong>Room No:</strong> {addr.roomNo}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(i)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No addresses added yet.</p>
              )}
            </div>

            {/* Add new address */}
            <div className="space-y-2 mb-3">
              <input
                type="text"
                placeholder="Street"
                value={newAddress.street}
                onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                className="w-full border rounded-lg p-2 text-sm"
              />
              <input
                type="text"
                placeholder="City"
                value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                className="w-full border rounded-lg p-2 text-sm"
              />
              <input
                type="text"
                placeholder="House No"
                value={newAddress.houseNo}
                onChange={(e) => setNewAddress({ ...newAddress, houseNo: e.target.value })}
                className="w-full border rounded-lg p-2 text-sm"
              />
              <input
                type="text"
                placeholder="Room No"
                value={newAddress.roomNo}
                onChange={(e) => setNewAddress({ ...newAddress, roomNo: e.target.value })}
                className="w-full border rounded-lg p-2 text-sm"
              />
            </div>

            <button
              onClick={handleAdd}
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium"
            >
              <Plus size={16} /> Add Address
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
