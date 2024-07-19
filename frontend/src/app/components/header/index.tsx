"use client";
import { usePathname, useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { removeTokenCookie, getTokenCookie } from "../../../utils/cookieUtils";
import { useEffect, useState } from "react";
import logo from '../../../../public/logo.png';
import Image from "next/image";

function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [decode, setDecode] = useState({});


  useEffect(() => {
    const getToken = () => {
      if (pathname !== "/") {
        const token = getTokenCookie()!;

        if (token) {
          setDecode(jwtDecode(token));
        }
      }
    };

    getToken();
  }, []);

  const handleLogout = () => {
    removeTokenCookie();
    router.push("/");
  };

  const handleCreateButtonClick = () => {
    router.push("/create");
  };

  const handleListButtonClick = () => {
    router.push("/users-list");
  };

  return (
    <header className="flex items-center justify-between bg-purple-600 h-32 px-4">
      {pathname !== "/" && decode && (
        <div className="flex flex-col text-white">
          <h3 className="text-lg font-semibold">{decode.name}</h3>
          <h4 className="text-sm">
            {decode.admin ? "Administrador (a)" : "Usuário"}
          </h4>
        </div>
      )}
      <div className="flex-grow flex justify-center">
        <Image src={logo} alt="Logo Meu Guru" className="max-h-44 max-w-44" />
      </div>
      <div className="flex space-x-2">
        {pathname !== "/" && decode && (
          <button
            className={`font-bold py-2 px-4 rounded ${
              decode && !decode.admin && pathname === "/users-list"
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "text-purple-600 bg-white hover:bg-purple-100"
            }`}
            disabled={!decode.admin}
            onClick={() =>
              pathname === "/create"
                ? handleListButtonClick()
                : handleCreateButtonClick()
            }
          >
            {pathname === "/create" ? "Lista" : "Criar"}
          </button>
        )}
        {pathname !== "/" && (
          <button
            className="text-purple-600 bg-white font-bold py-2 px-4 rounded"
            onClick={handleLogout}
          >
            Sair
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
