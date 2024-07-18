"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePage() {
  return (
    <div className="container mx-auto">
      <form className="flex flex-col items-center mt-16">
        <input
          type="email"
          placeholder="E-mail"
          id="email"
          className="rounded-md border border-gray-300 px-4 py-2 focus:shadow-purple-500 focus:shadow-sm focus:outline-none my-4 w-80"
        />
        <input
          type="password"
          placeholder="Senha"
          id="password"
          className="rounded-md border border-gray-300 px-4 py-2 focus:shadow-purple-500 focus:shadow-sm focus:outline-none my-4 w-80"
        />
        <input
          type="text"
          placeholder="Nome"
          id="name"
          className="rounded-md border border-gray-300 px-4 py-2 focus:shadow-purple-500 focus:shadow-sm focus:outline-none my-4 w-80"
        />
        <input
          type="text"
          placeholder="CPF"
          id="cpf"
          className="rounded-md border border-gray-300 px-4 py-2 focus:shadow-purple-500 focus:shadow-sm focus:outline-none my-4 w-80"
        />
        <input
          type="text"
          placeholder="Telefone"
          id="phone"
          className="rounded-md border border-gray-300 px-4 py-2 focus:shadow-purple-500 focus:shadow-sm focus:outline-none my-4 w-80"
        />
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
