"use client";

import axios from "axios";
import { useState } from "react";
import Link from "next/link";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let avatarUrl = null;
      if (avatar) {
        const formData = new FormData();
        formData.append("file", avatar);
        formData.append("upload_preset", "frontend_signup");

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/dujwwjdkq/image/upload`,
          { method: "POST", body: formData }
        );

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok)
          throw new Error(uploadData.error?.message || "Image upload failed");

        avatarUrl = uploadData.secure_url;
      }

      await axios.post("/api/auth/signup", {
        name,
        email,
        password,
        phone,
        bio,
        avatar: avatarUrl,
      });

      window.location.href = "/login";
    } catch (err: any) {
      alert(err.response?.data?.error || err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-500 via-green-600 to-emerald-700 p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">
          Create Your Account 🌱
        </h1>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="John Doe"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="9876543210"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Profile Picture
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="w-full text-sm text-slate-600"
            />
            {avatarPreview && (
              <img
                src={avatarPreview}
                alt="Preview"
                className="w-20 h-20 rounded-full object-cover mt-2"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-center text-slate-600 mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-green-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
