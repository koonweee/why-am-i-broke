"use client";
import { useState } from "react";

export default function RegisterForm() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        e.target.reset();
        console.log("User registered");
      } else {
        console.error("Failed to register user");
      }
    } catch (error) {
      console.error("Failed to register user", error);
    }
  };
  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
        />

        <button type="submit" className="btn">
          Register
        </button>
      </form>
    </div>
  );
}
