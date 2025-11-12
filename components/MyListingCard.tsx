import { Address, Item } from "@/types";
import React, { useState } from "react";
import { toast } from "sonner";

interface MyListingCardProps {
  id: number;
  items: Item[];
  commission: number;
  deliveryTime: string;
  address: Address;
  acceptedBy?: { id: string; name: string; phone?: string; email?: string } | null;
  onDelete?: (id: number) => void; // ✅ callback for parent component to remove from state
}

export default function MyListingCard({
  id,
  items,
  commission,
  deliveryTime,
  address,
  acceptedBy,
  onDelete,
}: MyListingCardProps) {
  const [loading, setLoading] = useState(false);

  const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = totalPrice + commission;

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this listing?")) return;
  
    setLoading(true);
    try {
      const res = await fetch(`/api/listings/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId: id }),
      });
  
      const data = await res.json();
      if (data.success) {
        toast.success("Listing cancelled successfully!");
        onDelete?.(id);
      } else {
        // ✅ Show user-friendly message as toast
        toast.error(data.message || "Failed to cancel listing.");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      console.error("Error cancelling listing:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-xl shadow p-4 flex flex-col gap-3 max-w-xs">
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
            <span>{item.name} x {item.quantity}</span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between text-sm text-slate-600">
        <span>Total Price:</span>
        <span>₹{totalPrice}</span>
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
        <p><strong>Delivery Time:</strong> {deliveryTime}</p>
        <p><strong>Address:</strong> {address.street}, {address.houseNo}, {address.roomNo}, {address.city}</p>
        <p>
          <strong>Accepted By:</strong>{" "}
          {acceptedBy ? `${acceptedBy.name} (${acceptedBy.phone || "No phone"})` : "None"}
        </p>
      </div>

      {/* ✅ Cancel Button */}
      <button
        onClick={handleCancel}
        disabled={loading}
        className="mt-3 px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 text-sm disabled:bg-red-400"
      >
        {loading ? "Cancelling..." : "Cancel Listing"}
      </button>
    </div>
  );
}
