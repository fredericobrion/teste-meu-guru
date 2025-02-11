"use client";
import { FormEvent, useState, useEffect } from "react";
import { login } from "../utils/api";
import { useRouter } from "next/navigation";
import { removeTokenCookie, setTokenCookie } from "../utils/cookieUtils";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { validateEmail } from "../utils/validateInputs";
import { useAppContext } from "../context/context";
import { jwtDecode } from "jwt-decode";
import { Token } from "../types/token";
import Loading from "./components/loading";
import Header from "./components/header";

export default function Home() {
  const router = useRouter();

  const { setDecoded, loading, setLoading } = useAppContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const cleanCookie = () => {
      removeTokenCookie();
      setDecoded(null);
    };

    cleanCookie();
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateEmailInput = () => {
    if (!validateEmail(email)) {
      setEmailError("E-mail inválido");
      return false;
    }
    return true;
  };

  const validatePasswordInput = () => {
    if (password.length < 6) {
      setPasswordError("A senha deverá ter no mínimo 6 caracteres");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setEmailError("");
    setPasswordError("");
    setLoginError("");

    const validEmail = validateEmailInput();
    const validPassword = validatePasswordInput();

    if (!validEmail || !validPassword) {
      return;
    }

    try {
      setLoading(true);
      const token = await login(email, password);

      setTokenCookie(token);

      const decodedToken = jwtDecode(token) as Token;
      setDecoded(decodedToken);

      router.push("/users-list");
    } catch (error) {
      setLoading(false);
      if (error instanceof Error) {
        setLoginError(error.message);
      } else {
        setLoginError("Ocorreu um erro inesperado.");
      }
    }
  };

  return loading ? <Loading /> : (
    <div>
      <Header />

    <div className="container mx-auto">
      <form
        className="flex flex-col items-center mt-16"
        onSubmit={(e) => handleSubmit(e)}
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
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="Senha"
            id="password"
            className="rounded-md border border-gray-300 px-4 py-2 focus:shadow-purple-500 focus:shadow-sm focus:outline-none my-4"
          />
          <button
            type="button"
            data-testid="toggleBtn"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            {showPassword ? (
              <EyeSlashIcon className="h-6 w-6 text-gray-400 hover:text-gray-600 cursor-pointer" />
            ) : (
              <EyeIcon className="h-6 w-6 text-gray-400 hover:text-gray-600 cursor-pointer" />
            )}
          </button>
        </div>
        {passwordError && <p className="text-red-600">{passwordError}</p>}
        <button
          type="submit"
          className="bg-purple-500 text-white font-bold py-2 px-4 rounded-md hover:bg-purple-600 hover:scale-105 cursor-pointer mt-4"
        >
          Entrar
        </button>
        {loginError && <p className="text-red-600 my-4">{loginError}</p>}
      </form>
    </div>
    </div>

  );
}
