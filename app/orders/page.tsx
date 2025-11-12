"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Navbar from "@/components/Navbar";
import OrderListingCard from "@/components/OrderListingCard";
import { Creator, Item } from "@/types";

interface Order {
  id: string;
  items: Item[];
  total: number;
  commission: number;
  deliveryTime: string;
  address: { street: string; city: string; houseNo: string; roomNo: string };
  creatorId: string;
  acceptedById: string;
  user?: Creator;
  acceptedBy?: string;
}

export default function OrdersPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      router.push("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders/get");
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders);
          console.log(data)
        } else {
          console.error(data.message);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [session, router]);

  if (loading) return <div className="p-4 text-center">Loading orders...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <Navbar
        onPlaceOrder={() => {
          // You can handle a new order from Navbar if needed
        }}
      />

      {/* Orders Content */}
      <div className="max-w-5xl mx-auto p-4 mt-6">
        <h1 className="text-2xl font-semibold mb-4">My Orders</h1>
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.map((order) => (
            <OrderListingCard
              key={order.id}
              id={order.id}
              items={order.items}
              total={order.total}
              commission={order.commission}
              deliveryTime={order.deliveryTime}
              address={order.address}
              creator={order.user}
              acceptedBy={order.acceptedById}
              onCancel={(orderId) => setOrders((prev) => prev.filter((o) => o.id !== orderId))}
            />
          ))
        )}
      </div>
    </div>
  );
}
