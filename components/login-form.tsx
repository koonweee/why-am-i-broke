"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await signIn("credentials", {
        email,
        password,
        callbackUrl: "/dashboard",
      });
      if (res?.error) {
        setError(res.error);

        return;
      }
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to login user", error);
    }
  };
  return (
    <div>
      <h1>Login</h1>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          className="input"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="input"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="btn">
          Login
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}
