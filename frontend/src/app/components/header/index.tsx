"use client";
import { usePathname, useRouter } from "next/navigation";
import { removeTokenCookie } from "../../../utils/cookieUtils";
import logo from '../../../../public/logo.png';
import Image from "next/image";
import { useAppContext } from '../../../context/context';

function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const { decoded } = useAppContext();

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
      {pathname !== "/" && decoded && (
        <div className="flex flex-col text-white">
          <h3 className="text-lg font-semibold">{decoded.name}</h3>
          <h4 className="text-sm">
            {decoded.admin ? "Administrador (a)" : "Usuário"}
          </h4>
        </div>
      )}
      <div className="flex-grow flex justify-center">
        <Image src={logo} alt="Logo Meu Guru" width={160} height={120}/>
      </div>
      <div className="flex space-x-2">
        {pathname !== "/" && decoded && (
          <button
            className={`font-bold py-2 px-4 rounded ${
              decoded && !decoded.admin && pathname === "/users-list"
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "text-purple-600 bg-white hover:bg-purple-100"
            }`}
            disabled={!decoded.admin}
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
