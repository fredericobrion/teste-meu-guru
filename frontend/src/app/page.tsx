"use client";
import { FormEvent, useState } from "react";
import { login } from "../utils/api";
import { useRouter } from "next/navigation";
import { setTokenCookie } from "../utils/cookieUtils";

export default function Home() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("E-mail inválido");
      return false;
    }
    return true;
  };

  const validatePassword = () => {
    if (password.length < 6) {
      setPasswordError("A senha deverá ter no mínimo 6 caracteres");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateEmail() || !validatePassword()) {
      return;
    }

    try {
      const token = await login(email, password);

      setTokenCookie(token);

      router.push("/users-list");
    } catch (error) {
      if (error.response?.status === 401) {
        setLoginError("E-mail ou senha incorretos");
      } else {
        setLoginError("Erro ao fazer login. Por favor, tente novamente.");
      }
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
        {loginError && <p className="text-red-600">{loginError}</p>}
      </form>
    </div>
  );
}
