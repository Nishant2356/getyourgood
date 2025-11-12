"use client";

import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Users, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleGetStarted = () => {
    if (session) {
      router.push("/home");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700 flex flex-col items-center justify-center text-white p-6">
      {/* Logo & Navbar */}
      <div className="absolute top-4 left-0 w-full flex justify-between items-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl font-extrabold tracking-wide"
        >
          GetYourGood 🌿
        </motion.h1>
        <Button
          onClick={() => (session ? router.push("/home") : router.push("/login"))}
          className="bg-white text-green-700 font-semibold hover:bg-green-100"
        >
          {session ? "Dashboard" : "Login"}
        </Button>
      </div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center text-center mt-16"
      >
        <ShoppingBag className="w-16 h-16 mb-4 text-white drop-shadow-lg" />
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4">
          Simplify your Hostel Shopping
        </h1>
        <p className="text-base sm:text-lg text-green-50 max-w-xl">
          Need something from the market but don’t feel like walking 2 km? 
          List what you need and let your hostel mates bring it for you — 
          earn commissions, save time, and help each other effortlessly!
        </p>

        <motion.button
          onClick={handleGetStarted}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 px-8 py-3 bg-white text-green-700 font-semibold rounded-full shadow-lg hover:bg-green-100 transition"
        >
          Get Started
        </motion.button>
      </motion.div>

      {/* Feature Highlights */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl w-full"
      >
        <FeatureCard
          icon={<Users className="w-8 h-8 text-green-800" />}
          title="Community First"
          desc="Connect with your hostel mates and make life easier together."
        />
        <FeatureCard
          icon={<Handshake className="w-8 h-8 text-green-800" />}
          title="Help & Earn"
          desc="Bring goods for others and earn a small commission for your effort."
        />
        <FeatureCard
          icon={<ShoppingBag className="w-8 h-8 text-green-800" />}
          title="List Your Needs"
          desc="Add daily-use items to the list and get them delivered easily."
        />
      </motion.div>

      {/* Footer */}
      <footer className="mt-16 text-sm text-green-50">
        © {new Date().getFullYear()} GetYourGood — Built by Hostelers, for Hostelers 💚
      </footer>
    </div>
  );
}

// ✅ Small reusable card component
function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white/90 text-green-800 rounded-2xl shadow-md p-6 flex flex-col items-center text-center"
    >
      <div className="mb-3">{icon}</div>
      <h3 className="font-semibold text-lg mb-1">{title}</h3>
      <p className="text-sm text-green-700">{desc}</p>
    </motion.div>
  );
}
