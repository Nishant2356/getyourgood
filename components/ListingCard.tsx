import { Item, Address, Creator } from "@/types";
import React from "react";

interface ListingCardProps {
  id: number;  // change from string → number
  items: Item[];
  commission: number;
  creator: Creator;
  deliveryTime: string;
  address: Address;
  onAccept?: (listing: any) => void;
}


export default function ListingCard({
  id,
  items,
  commission,
  creator,
  deliveryTime,
  address,
  onAccept,
}: ListingCardProps) {
  const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = totalPrice + commission;

  const handleAccept = async () => {
    if (onAccept) {
      await onAccept({
        id,
        items,
        commission,
        total,
        deliveryTime,
        address,
        creator,
        // creatorId: null, // you can pass if needed
      });
    }
  };

  return (
    <div className="border rounded-xl shadow p-4 flex flex-col gap-3 max-w-xs">
      {/* Multiple item images */}
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

      {/* Items details */}
      <div className="space-y-1">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between items-center text-sm">
            <span>{item.name} x {item.quantity}</span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}
      </div>

      {/* Total Price */}
      <div className="flex justify-between text-sm text-slate-600">
        <span>Total Price:</span>
        <span>₹{totalPrice}</span>
      </div>

      {/* Commission */}
      <div className="flex justify-between text-sm text-slate-600">
        <span>Commission:</span>
        <span>₹{commission}</span>
      </div>

      {/* Total (with green color) */}
      <div className="flex justify-between font-semibold text-green-600 text-base mt-1">
        <span>Total:</span>
        <span>₹{total}</span>
      </div>

            {/* Delivery Info */}
            <div className="text-sm text-slate-600 mt-2">
        <p><strong>Delivery Time:</strong> {deliveryTime}</p>
        <p><strong>Address:</strong> {address.street}, {address.houseNo}, {address.roomNo}, {address.city}</p>
      </div>

      <p className="text-xs text-slate-500 mt-1">Listed by: {creator.name}</p>
      <p className="text-xs text-slate-500 mt-1">Contact: {creator.phone}</p>
      {/* Accept button */}
      <button
        onClick={handleAccept}
        className="mt-2 px-3 py-1 rounded-md bg-green-600 text-white hover:bg-green-700 text-sm"
      >
        Accept
      </button>
    </div>
  );
}