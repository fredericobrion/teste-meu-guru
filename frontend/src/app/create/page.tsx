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

export default function CreatePage() {
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
  };

  return (
    <div className="container mx-auto">
      <form
        className="flex flex-col items-center mt-16"
        onSubmit={handleSubmit}
      >
        <input
          type="email"
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
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Nome"
          id="name"
          className="rounded-md border border-gray-300 px-4 py-2 focus:shadow-purple-500 focus:shadow-sm focus:outline-none my-4 w-80"
        />
        {nameError && <p className="text-red-600">{nameError}</p>}
        <input
          value={cpf}
          onChange={(e) => setCpf(formatCPF(e.target.value))}
          type="text"
          placeholder="CPF"
          id="cpf"
          className="rounded-md border border-gray-300 px-4 py-2 focus:shadow-purple-500 focus:shadow-sm focus:outline-none my-4 w-80"
        />
        {cpfError && <p className="text-red-600">{cpfError}</p>}
        <input
          value={phone}
          onChange={(e) => setPhone(formatPhone(e.target.value))}
          type="text"
          placeholder="Telefone"
          id="phone"
          className="rounded-md border border-gray-300 px-4 py-2 focus:shadow-purple-500 focus:shadow-sm focus:outline-none my-4 w-80"
        />
        {phoneError && <p className="text-red-600">{phoneError}</p>}
        <button
          type="submit"
          className="bg-purple-500 text-white font-bold py-2 px-4 rounded-md hover:bg-purple-600 hover:scale-105 cursor-pointer mt-4"
        >
          Criar
        </button>
      </form>
    </div>
  );
}
