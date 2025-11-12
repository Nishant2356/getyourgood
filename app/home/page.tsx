"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ListingCard from "@/components/ListingCard";
import { useSession } from "next-auth/react";
import { Creator, Address, Item } from "@/types";
import { toast } from "sonner";

interface Listing {
    id: number;
    items: Item[];
    commission: number;
    creator: Creator;
    deliveryTime: string;
    address: Address;
}

export default function Page() {
    const [listings, setListings] = useState<Listing[]>([]);
    const [allListings, setAllListings] = useState<Listing[]>([]); // store all listings
    const { data: session } = useSession();
    const userId = session?.user?.id;

    // Fetch all listings on mount
    useEffect(() => {
        const fetchListings = async () => {
            try {
                const res = await fetch("/api/listings/get");
                const data = await res.json();
                if (data.success) {
                    setListings(data.listings);
                    setAllListings(data.listings); // keep original copy
                }
            } catch (err) {
                console.error("Failed to fetch listings:", err);
            }
        };
        fetchListings();
    }, []);

    // ✅ Search Listings
    const handleSearch = (query: string) => {
        const q = query.toLowerCase().trim();
        if (!q) {
            setListings(allListings); // reset if search is empty
            return;
        }

        const filtered = allListings.filter((listing) => {
            // Check if creator name contains query
            const creatorMatch = listing.creator.name.toLowerCase().includes(q);

            // Check if any item name contains query
            const itemMatch = listing.items.some((item) =>
                item.name.toLowerCase().includes(q)
            );

            return creatorMatch || itemMatch;
        });

        setListings(filtered);
    };

    // ✅ Add Listing
    const handleAddListing = async (
        items: Item[],
        commission: number,
        deliveryTime: string,
        address: Address
    ) => {
        if (!userId) return console.error("User not logged in");
        if (!address.street || !address.city || !address.houseNo) {
            return alert("Please select or add a valid address!");
        }

        try {
            const res = await fetch("/api/listings/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items,
                    commission,
                    deliveryTime,
                    address,
                    creatorId: Number(userId),
                }),
            });

            const data = await res.json();
            if (data.success) {
                setListings((prev) => [...prev, data.listing]);
                toast.success("🎉 Listing created successfully!");
            } else {
                toast.error(data.message || "Failed to create listing");
            }
        } catch (err) {
            console.error("Error creating listing:", err);
        }
    };

    // ✅ Accept Listing
    const handleAcceptListing = async (listingData: Listing) => {
        if (!userId) return console.error("User not logged in");

        // Prevent accepting your own listing
        if (listingData.creator.id == userId) {
            return toast.error("You cannot accept your own listing!");
        }

        const totalPrice = listingData.items.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
        );

        try {
            const res = await fetch("/api/orders/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    listingId: listingData.id,
                    items: listingData.items,
                    commission: listingData.commission,
                    total: totalPrice + listingData.commission,
                    deliveryTime: listingData.deliveryTime,
                    address: listingData.address,
                    userId: userId,
                }),
            });

            const data = await res.json();
            if (data.success) {
                toast.success("Listing accepted successfully!");
                setListings((prev) => prev.filter((l) => l.id !== listingData.id));
            } else {
                console.error(data.message);
            }
        } catch (err) {
            console.error("Error accepting listing:", err);
        }
    };

    return (
        <>
            <Navbar onPlaceOrder={handleAddListing} onSearch={handleSearch} />

            <div className="max-w-5xl mx-auto p-4">
                {listings.length === 0 ? (
                    <div className="text-center py-12 text-gray-600">
                        <p className="text-base">No items listed yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {listings.map((listing) => (
                            <ListingCard
                                key={listing.id}
                                id={listing.id}
                                items={listing.items}
                                commission={listing.commission}
                                creator={listing.creator}
                                deliveryTime={listing.deliveryTime}
                                address={listing.address}
                                onAccept={handleAcceptListing}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
