import { Item, Address } from "@/types";
import React, { useState } from "react";
import { toast } from "sonner"; // ✅ added

interface Creator {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

interface OrderListingCardProps {
  id: string;
  items: Item[];
  commission: number;
  total: number;
  deliveryTime: string;
  address: Address;
  creator?: Creator;
  acceptedBy: string;
  onCancel?: (orderId: string) => void; // callback to parent
}

export default function OrderListingCard({
  id,
  items = [],
  commission,
  total,
  deliveryTime,
  address = { street: "", city: "", houseNo: "", roomNo: "" },
  creator,
  acceptedBy,
  onCancel,
}: OrderListingCardProps) {
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    const confirmed = window.confirm("⚠️ Are you sure you want to cancel this order?");
    if (!confirmed) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/orders/delete/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        toast.success("Order cancelled successfully ✅");
        onCancel?.(id); // inform parent to remove order from list
      } else {
        toast.error(data.message || "Failed to cancel order ❌");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error ⚠️");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-xl shadow p-4 flex flex-col gap-3 max-w-xs mb-4">
      <div className="flex gap-1 overflow-x-auto">
        {items.map((item) => (
          <img
            key={item.id}
            src={item.image}
            alt={item.name}
            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
          />
        ))}
      </div>

      <div className="space-y-1">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between items-center text-sm">
            <span>
              {item.name} x {item.quantity}
            </span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between text-sm text-slate-600">
        <span>Total Price:</span>
        <span>₹{items.reduce((acc, item) => acc + item.price * item.quantity, 0)}</span>
      </div>

      <div className="flex justify-between text-sm text-slate-600">
        <span>Commission:</span>
        <span>₹{commission}</span>
      </div>

      <div className="flex justify-between font-semibold text-green-600 text-base mt-1">
        <span>Total:</span>
        <span>₹{total}</span>
      </div>

      <div className="text-sm text-slate-600 mt-2">
        <p>
          <strong>Delivery Time:</strong> {deliveryTime}
        </p>
        <p>
          <strong>Address:</strong> {address.street}, {address.houseNo}, {address.roomNo},{" "}
          {address.city}
        </p>
      </div>

      <button
        onClick={handleCancel}
        disabled={loading}
        className="mt-2 bg-red-500 text-white text-sm py-1 px-3 rounded hover:bg-red-600 disabled:opacity-50"
      >
        {loading ? "Cancelling..." : "Cancel Order"}
      </button>
    </div>
  );
}
