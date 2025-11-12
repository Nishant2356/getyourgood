"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    Search,
    MoreVertical,
    Menu,
    X,
    User,
    PlusCircle,
    MapPin,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import ListingModal from "./ListingModal";
import { useRouter } from "next/navigation";
import CartModal from "./CartModal";
import { useSession } from "next-auth/react";
import AddAddressModal from "./AddAddressModal";
import { Address, Item } from "@/types";

interface NavbarProps {
    onSearch?: (query: string) => void;
    onPlaceOrder: (
        items: Item[],
        commission: number,
        deliveryTime: string,
        address: Address
    ) => void;
}

export default function Navbar({ onSearch, onPlaceOrder }: NavbarProps) {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isMoreOpen, setIsMoreOpen] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isListingOpen, setIsListingOpen] = useState(false);
    const [cartData, setCartData] = useState<any[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [commission, setCommission] = useState(0);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

    const router = useRouter();

    // ✅ Properly typed refs
    const containerRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const { data: session } = useSession();
    const isLoggedIn = !!session;

    const sampleItems = [
        "Milk",
        "Bread",
        "Eggs",
        "Rice",
        "Maggi",
        "Toothpaste",
        "Soap",
        "Tea",
        "Sugar",
        "Salt",
        "Chips",
        "Cold Drink",
        "Notebook",
        "Pens",
    ];

    // ✅ Type-safe click outside handler
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setIsMoreOpen(false);
                setIsProfileOpen(false);
                setActiveIndex(-1);
                setSuggestions([]);
            }
        }

        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    // ✅ Debounce for search suggestions
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (!query.trim()) {
            setSuggestions([]);
            return;
        }
        debounceRef.current = setTimeout(() => {
            const q = query.toLowerCase().trim();
            const filtered = sampleItems
                .filter((s) => s.toLowerCase().includes(q))
                .slice(0, 6);
            setSuggestions(filtered);
            setActiveIndex(-1);
        }, 180);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [query]);

    // ✅ Type-safe handlers
    const handleSelect = (item: string) => {
        setQuery(item);
        setSuggestions([]);
        onSearch?.(item);
    };

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        setSuggestions([]);
        onSearch?.(query);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!suggestions.length) return;
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, 0));
        } else if (e.key === "Enter") {
            if (activeIndex >= 0) {
                e.preventDefault();
                handleSelect(suggestions[activeIndex]);
            } else {
                handleSubmit();
            }
        } else if (e.key === "Escape") {
            setSuggestions([]);
        }
    };


    const handleListingClick = () => {
        if (isLoggedIn) setIsListingOpen(true);
        else router.push("/login");
    };

    const handleOpenCart = (cart: any[]) => {
        setCartData(cart);
        setIsCartOpen(true);
    };

    const handleMyListingsClick = () => {
        if (isLoggedIn) router.push("/mylistings");
        else router.push("/login");
    };

    return (
        <header ref={containerRef} className="w-full">
            <div className="bg-green-600 text-white/95">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-14">
                        {/* Left: Logo + Hamburger */}
                        <div className="flex items-center gap-4">
                            <button
                                className="p-2 rounded-md hover:bg-white/10 md:hidden"
                                aria-label={isMobileOpen ? "Close menu" : "Open menu"}
                                onClick={() => setIsMobileOpen((s) => !s)}
                            >
                                {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>

                            <div className="flex items-center gap-2">
                                <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center">
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="text-white"
                                        aria-hidden
                                    >
                                        <rect x="3" y="3" width="18" height="18" rx="4" fill="white" fillOpacity="0.12" />
                                        <path d="M7 12h10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
                                    </svg>
                                </div>
                                <div className="font-semibold text-sm tracking-tight">getyourgood</div>
                            </div>
                        </div>

                        {/* Center Search */}
                        <form
                            onSubmit={handleSubmit}
                            className="hidden md:flex flex-1 px-6 justify-center"
                            role="search"
                            aria-label="Search items"
                        >
                            <div className="w-full max-w-xl relative">
                                <div className="flex items-center bg-white/95 rounded-xl shadow-md overflow-hidden h-11">
                                    <div className="px-3">
                                        <Search size={16} className="text-slate-600" />
                                    </div>
                                    <input
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        className="flex-1 outline-none h-full px-2 text-slate-800"
                                        placeholder="Search items (e.g. Rice, Soap) or people"
                                    />
                                    <button
                                        type="submit"
                                        className="px-4 h-full text-sm font-medium bg-green-600 text-white hover:bg-green-700"
                                    >
                                        Search
                                    </button>
                                </div>

                                <AnimatePresence>
                                    {suggestions.length > 0 && (
                                        <motion.ul
                                            initial={{ opacity: 0, y: -6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -6 }}
                                            className="absolute z-50 mt-2 w-full bg-white rounded-lg shadow-lg py-1 overflow-hidden"
                                        >
                                            {suggestions.map((s, i) => (
                                                <li
                                                    key={s}
                                                    onMouseDown={(ev) => ev.preventDefault()}
                                                    onClick={() => handleSelect(s)}
                                                    className={`px-4 py-2 text-sm text-green-600 hover:bg-green-50 cursor-pointer flex items-center gap-2 ${i === activeIndex ? "bg-green-50" : ""}`}
                                                >
                                                    <span className="flex-1">{s}</span>
                                                </li>
                                            ))}
                                        </motion.ul>
                                    )}
                                </AnimatePresence>
                            </div>
                        </form>

                        {/* Right actions */}
                        <div className="flex items-center gap-4">
                            <button
                                className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/10 hover:bg-white/15"
                                title="Create listing"
                                aria-label="Create listing"
                                onClick={handleListingClick}
                            >
                                <PlusCircle size={16} />
                                <span className="text-sm font-medium">List</span>
                            </button>

                            {/* Add Address */}
                            <button
                                className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/10 hover:bg-white/15 text-sm font-medium"
                                title="Add Address"
                                aria-label="Add Address"
                                onClick={() => {
                                    if (isLoggedIn) setIsAddressModalOpen(true);
                                    else router.push("/login");
                                }}
                            >
                                <MapPin size={16} />
                                Add Address
                            </button>

                            {/* Mobile only address icon */}
                            <button
                                className="sm:hidden p-2 rounded-md hover:bg-white/10"
                                aria-label="Add Address"
                                onClick={() => {
                                    if (isLoggedIn) setIsAddressModalOpen(true);
                                    else router.push("/login");
                                }}
                            >
                                <MapPin size={18} />
                            </button>

                            {/* More menu */}
                            <div className="relative">
                                <button
                                    className="hidden sm:inline-flex p-2 rounded-md hover:bg-white/10"
                                    aria-haspopup="true"
                                    aria-expanded={isMoreOpen}
                                    onClick={() => setIsMoreOpen((v) => !v)}
                                >
                                    <MoreVertical size={18} />
                                </button>

                                <AnimatePresence>
                                    {isMoreOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg text-slate-800 overflow-hidden z-50"
                                        >
                                            <button onClick={() => router.push("/home")} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50">Home</button>
                                            <button
                                                className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50"
                                                onClick={handleMyListingsClick}
                                            >
                                                My Listings
                                            </button>
                                            <button className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50" onClick={() => router.push("/orders")}>
                                                My Orders
                                            </button>
                                            <button className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50">Support</button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Profile */}
                            <div className="relative">
                                <button
                                    className="p-2 rounded-md hover:bg-white/10"
                                    aria-label="Profile"
                                    onClick={() => setIsProfileOpen((prev) => !prev)}
                                >
                                    <User size={18} />
                                </button>

                                <AnimatePresence>
                                    {isProfileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -8 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border text-slate-800 z-50 overflow-hidden"
                                        >
                                            {isLoggedIn ? (
                                                <button
                                                    className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50"
                                                    onClick={() => {
                                                        import("next-auth/react").then(({ signOut }) => signOut({ callbackUrl: "/" }));
                                                    }}
                                                >
                                                    Logout
                                                </button>
                                            ) : (
                                                <>
                                                    <Link href="/login">
                                                        <button className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50">
                                                            Login
                                                        </button>
                                                    </Link>
                                                    <Link href="/signup">
                                                        <button className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50">
                                                            Signup
                                                        </button>
                                                    </Link>
                                                </>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile search */}
                <div className="md:hidden px-4 pb-3">
                    <form onSubmit={handleSubmit} role="search" className="w-full">
                        <div className="w-full max-w-full relative">
                            <div className="flex items-center bg-white/95 rounded-xl overflow-hidden h-11 shadow-sm">
                                <div className="px-3">
                                    <Search size={16} className="text-slate-600" />
                                </div>
                                <input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="flex-1 outline-none h-full px-2 text-slate-800"
                                    placeholder="Search items or people"
                                />
                                <button type="submit" className="px-3 h-full text-sm font-medium bg-green-600 text-white">
                                    Go
                                </button>
                            </div>

                            <AnimatePresence>
                                {suggestions.length > 0 && (
                                    <motion.ul
                                        initial={{ opacity: 0, y: -6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -6 }}
                                        className="absolute left-0 right-0 mt-2 bg-white rounded-lg shadow-lg py-1 overflow-hidden z-40"
                                    >
                                        {suggestions.map((s, i) => (
                                            <li
                                                key={s}
                                                onMouseDown={(ev) => ev.preventDefault()}
                                                onClick={() => handleSelect(s)}
                                                className={`px-4 py-2 text-sm hover:bg-green-50 cursor-pointer ${i === activeIndex ? "bg-green-50" : ""}`}
                                            >
                                                {s}
                                            </li>
                                        ))}
                                    </motion.ul>
                                )}
                            </AnimatePresence>
                        </div>
                    </form>
                </div>
            </div>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.aside
                        initial={{ x: -280 }}
                        animate={{ x: 0 }}
                        exit={{ x: -280 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed top-0 left-0 w-72 h-full bg-white z-50 shadow-lg"
                    >
                        <div className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center">GY</div>
                                    <div className="font-semibold">getyourgood</div>
                                </div>
                                <button onClick={() => setIsMobileOpen(false)} aria-label="close">
                                    <X />
                                </button>
                            </div>

                            <nav className="mt-6 flex flex-col gap-2">
                                <button
                                    onClick={() => {
                                        router.push("/home");
                                        setIsMobileOpen(false);
                                    }}
                                    className="text-left p-3 rounded-md hover:bg-slate-50"
                                >
                                    Home
                                </button>

                                <button
                                    onClick={() => {
                                        handleMyListingsClick();
                                        setIsMobileOpen(false);
                                    }}
                                    className="text-left p-3 rounded-md hover:bg-slate-50"
                                >
                                    My Listings
                                </button>

                                <button
                                    onClick={() => {
                                        router.push("/orders");
                                        setIsMobileOpen(false);
                                    }}
                                    className="text-left p-3 rounded-md hover:bg-slate-50"
                                >
                                    My Orders
                                </button>

                                <button
                                    onClick={() => {
                                        handleListingClick();
                                        setTimeout(() => setIsMobileOpen(false), 200);
                                      }}                                      
                                    className="text-left p-3 rounded-md hover:bg-slate-50"
                                >
                                    Create Listing
                                </button>

                                <button
                                    onClick={() => {
                                        if (isLoggedIn) setIsAddressModalOpen(true);
                                        else router.push("/login");
                                        setIsMobileOpen(false); // ✅ closes drawer after click
                                    }}
                                    className="text-left p-3 rounded-md hover:bg-slate-50 flex items-center gap-2"
                                >
                                    <MapPin size={16} />
                                    Add Address
                                </button>

                                <button className="text-left p-3 rounded-md hover:bg-slate-50">Settings</button>
                            </nav>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            <ListingModal
                isOpen={isListingOpen}
                onClose={() => setIsListingOpen(false)}
                onOpenCart={handleOpenCart}
            />

            <CartModal
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cartItems={cartData}
                onQuantityChange={(id, qty) =>
                    setCartData((prev) =>
                        prev.map((item) =>
                            item.id === id ? { ...item, quantity: qty } : item
                        )
                    )
                }
                commission={commission}
                setCommission={setCommission}
                onPlaceOrder={(items, deliveryTime, address) =>
                    onPlaceOrder(items, commission, deliveryTime, address)
                }
            />

            <AddAddressModal
                isOpen={isAddressModalOpen}
                onClose={() => setIsAddressModalOpen(false)}
                userId={Number(session?.user?.id)}
            />
        </header>
    );
}
