"use client";
import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { formatCPF, formatPhone } from "../../utils/formatInputs";
import {
  validateCpf,
  validateEmail,
  validatePhone,
} from "../../utils/validateInputs";
import { getTokenCookie } from "../../utils/cookieUtils";
import { jwtDecode } from "jwt-decode";
import { createUser } from "../../utils/api";
import Swal from "sweetalert2";
import { Token } from "../../types/token";
import { useAppContext } from "../../context/context";
import Loading from "../components/loading";

export default function CreatePage() {
  const router = useRouter();

  const { decoded, loading, setLoading } = useAppContext();

  const [isAdmin, setIsAdmin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [cpf, setCpf] = useState("");
  const [cpfError, setCpfError] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [admin, setAdmin] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      if (decoded) {
        if (!decoded.admin) {
          setError("Necessário ser administrador para criar usuários");
        } else {
          setIsAdmin(true);
        }
      } else {
        Swal.fire({
          icon: "error",
          text: "Necessário estar logado",
          timer: 2000,
          confirmButtonText: "Voltar",
          timerProgressBar: true,
        }).then((result) => {
          if (result.isConfirmed) {
            router.push("/");
          }
        });

        setTimeout(() => router.push("/"), 2000);
      }
    };

    fetch();
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

  const validateNameInput = () => {
    if (name.length < 2) {
      setNameError("O nome deverá ter no mínimo 2 caracteres");
      return false;
    }
    return true;
  };

  const validateCpfInput = () => {
    if (!validateCpf(cpf)) {
      setCpfError("CPF inválido");
      return false;
    }
    return true;
  };

  const validatePhoneInput = () => {
    if (!validatePhone(phone)) {
      setPhoneError("Telefone inválido");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setEmailError("");
    setPasswordError("");
    setNameError("");
    setCpfError("");
    setPhoneError("");

    const validEmail = validateEmailInput();
    const validPassword = validatePasswordInput();
    const validName = validateNameInput();
    const validCpf = validateCpfInput();
    const validPhone = validatePhoneInput();

    if (
      !validEmail ||
      !validPassword ||
      !validName ||
      !validCpf ||
      !validPhone
    ) {
      return;
    }

    try {
      setLoading(true);
      await createUser(name, email, password, cpf, phone, admin);
      setLoading(false);

      Swal.fire({
        icon: "success",
        text: "Usuário criado",
        timer: 1500,
      });

      router.push("/users-list");
    } catch (error) {
      setLoading(false);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Ocorreu um erro inesperado");
      }
    }
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="container mx-auto">
      <form
        className="flex flex-col items-center mt-16"
        onSubmit={handleSubmit}
      >
        <input
          type="email"
          disabled={!isAdmin}
          value={email}
          placeholder="E-mail"
          id="email"
          className={
            "rounded-md border border-gray-300 px-4 py-2 focus:shadow-purple-500 focus:shadow-sm focus:outline-none my-4 w-80"
          }
          onChange={(e) => setEmail(e.target.value)}
        />
        {emailError && <p className="text-red-600">{emailError}</p>}
        <div className="relative">
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={!isAdmin}
            type={showPassword ? "text" : "password"}
            placeholder="Senha"
            id="password"
            className="rounded-md border border-gray-300 px-4 py-2 focus:shadow-purple-500 focus:shadow-sm focus:outline-none my-4 w-80"
          />
          <button
            type="button"
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
        <input
          value={name}
          disabled={!isAdmin}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Nome"
          id="name"
          className="rounded-md border border-gray-300 px-4 py-2 focus:shadow-purple-500 focus:shadow-sm focus:outline-none my-4 w-80"
        />
        {nameError && <p className="text-red-600">{nameError}</p>}
        <input
          value={cpf}
          disabled={!isAdmin}
          onChange={(e) => setCpf(formatCPF(e.target.value))}
          type="text"
          placeholder="CPF"
          id="cpf"
          className="rounded-md border border-gray-300 px-4 py-2 focus:shadow-purple-500 focus:shadow-sm focus:outline-none my-4 w-80"
        />
        {cpfError && <p className="text-red-600">{cpfError}</p>}
        <input
          value={phone}
          disabled={!isAdmin}
          onChange={(e) => setPhone(formatPhone(e.target.value))}
          type="text"
          placeholder="Telefone"
          id="phone"
          className="rounded-md border border-gray-300 px-4 py-2 focus:shadow-purple-500 focus:shadow-sm focus:outline-none my-4 w-80"
        />
        {phoneError && <p className="text-red-600">{phoneError}</p>}
        <div className="flex items-center my-4">
          <input
            type="radio"
            checked={!admin}
            disabled={!isAdmin}
            id="user"
            name="cargo"
            className={`form-radio h-5 w-5 text-purple-600 ${
              isAdmin ? "cursor-pointer" : "cursor-not-allowed"
            }`}
            onChange={() => setAdmin(false)}
          />
          <label
            htmlFor="user"
            className={`ml-2 ${
              isAdmin ? "cursor-pointer" : "cursor-not-allowed"
            }`}
          >
            Usuário
          </label>
          <input
            checked={admin}
            disabled={!isAdmin}
            type="radio"
            id="admin"
            name="cargo"
            className={`form-radio h-5 w-5 text-purple-600 ml-8 ${
              isAdmin ? "cursor-pointer" : "cursor-not-allowed"
            }`}
            onChange={() => setAdmin(true)}
          />
          <label
            htmlFor="admin"
            className={`ml-2 ${
              isAdmin ? "cursor-pointer" : "cursor-not-allowed"
            }`}
          >
            Administrador
          </label>
        </div>
        <button
          type="submit"
          disabled={!isAdmin}
          className={`bg-purple-500 text-white font-bold py-2 px-4 rounded-md mt-4 ${
            isAdmin
              ? "hover:bg-purple-600 hover:scale-105 cursor-pointer"
              : "opacity-50 cursor-not-allowed"
          }`}
        >
          Criar
        </button>
        {error && <p className="text-red-600 py-4 text-xl">{error}</p>}
      </form>
    </div>
  );
}
