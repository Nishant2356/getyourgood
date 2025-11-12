"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import MyListingCard from "@/components/MyListingCard";
import Navbar from "@/components/Navbar";

interface Listing {
  id: number;
  items: any[];
  commission: number;
  deliveryTime?: string;
  address?: any;
  createdAt: string;
  updatedAt?: string;
  orders?: {
    id: number;
    status: string;
    acceptedById?: number;
    total?: number;
    user: {
      id: number;
      name: string;
      phone?: string;
      email?: string;
    };
  }[];
}



export default function MyListingsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      router.push("/login");
      return;
    }

    const fetchListings = async () => {
      try {
        const res = await fetch("/api/listings/mine");
        const data = await res.json();
        if (data.success) {
          setListings(data.listings);
          console.log(data.listings)
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [session, router]);

  if (loading) return <div className="p-4 text-center">Loading your listings...</div>;

  return (
    <>
      <Navbar onPlaceOrder={() => { }} />
      <div className="max-w-5xl mx-auto p-4">
        <h1 className="text-2xl font-semibold mb-4">My Listings</h1>
        {listings.length === 0 ? (
          <p>No listings found.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => {
              // Find accepted order if any
              const acceptedOrder = listing?.orders?.find((order: any) => order.status === "accepted");

              const acceptedBy = acceptedOrder
              ? {
                  id: acceptedOrder.user?.id?.toString() || "", // ✅ ensure string
                  name: acceptedOrder.user?.name || "Unknown",
                  phone: acceptedOrder.user?.phone || "No phone",
                  email: acceptedOrder.user?.email || "",
                }
              : null;            

              return (
                <MyListingCard
                  key={listing.id}
                  id={listing.id}
                  items={listing.items}
                  commission={listing.commission}
                  deliveryTime={listing.deliveryTime || "Not specified"}
                  address={listing.address}
                  acceptedBy={acceptedBy}
                  onDelete={(id) => setListings((prev) => prev.filter((l) => l.id !== id))}
                />
              );
            })}

          </div>
        )}
      </div>
    </>
  );
}

// deliveryTime={listing.deliveryTime || "Not specified"}
