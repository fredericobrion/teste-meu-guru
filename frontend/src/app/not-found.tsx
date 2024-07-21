"use client";
import { useRouter } from "next/navigation";
import Header from "./components/header";

export default function NotFound() {
  const router = useRouter();

  return (
    <div>
        <Header />
      <div className="flex flex-col items-center justify-center my-40">
        <div className="text-center p-6 rounded-lg">
          <h2 className="text-4xl font-bold text-red-600">Houve um problema</h2>
          <h3 className="text-xl text-gray-700 mt-2 mb-4">
            Não conseguimos encontrar a página buscada.
          </h3>
          <button
            onClick={() => router.push('/')}
            className="bg-purple-500 text-white font-bold py-2 px-4 rounded-md hover:bg-purple-600 hover:scale-105 cursor-pointer mt-4"
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}
