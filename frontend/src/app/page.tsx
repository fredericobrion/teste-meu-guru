"use client";
import { FormEvent, useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let valid = true;

    setEmailError("");
    setPasswordError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("E-mail inválido");
      valid = false;
    }

    if (password.length < 6) {
      setPasswordError("A senha deverá ter no mínimo 6 caracteres");
      valid = false;
    }

    if (valid) {
      console.log("Form is valid!");
    }
  };

  return (
    <div className="container mx-auto">
      <form
        className="flex flex-col items-center mt-16"
        onSubmit={handleSubmit}
      >
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="E-mail"
          id="email"
          className="rounded-md border border-gray-300 px-4 py-2 focus:shadow-purple-500 focus:shadow-sm focus:outline-none my-4"
        />
        {emailError && <p className="text-red-600">{emailError}</p>}
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Senha"
          id="password"
          className="rounded-md border border-gray-300 px-4 py-2 focus:shadow-purple-500 focus:shadow-sm focus:outline-none my-4"
        />
        {passwordError && <p className="text-red-600">{passwordError}</p>}
        <button
          type="submit"
          className="bg-purple-500 text-white font-bold py-2 px-4 rounded-md hover:bg-purple-600 hover:scale-105 cursor-pointer mt-4"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
