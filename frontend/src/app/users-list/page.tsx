"use client";
import { ChangeEvent, useEffect, useState } from "react";
import { fetchUserData } from "../../utils/api";
import { useRouter } from "next/navigation";
import { User } from "../../types/user";
import TableRow from "../components/tableRow";
import {
  ChevronDoubleRightIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  ChevronDoubleLeftIcon,
} from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import { useAppContext } from '../../context/context';
import Loading from "../components/loading";
import Header from '../components/header';


export default function UsersListPage() {
  const router = useRouter();

  const { decoded, loading, setLoading } = useAppContext();

  const [usersData, setUsersData] = useState<User[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterValue, setFilterValue] = useState("");
  const [error, setError] = useState("");

  const totalPages = Math.ceil(totalUsers / itemsPerPage);

  useEffect(() => {
    const fetch = async () => {
      if (decoded) {
        setIsAdmin(decoded.admin);
        getUsers();
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
        
        setTimeout(() => {
          setLoading(false);
          router.push("/");
        }, 2000);
      }
    };

    fetch();
  }, []);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      getUsers(page, itemsPerPage, filterValue);
    }
  };

  const handleItemsPerPageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1);
    getUsers(1, parseInt(e.target.value, 10));
  };

  const getUsers = async (
    page: number = currentPage,
    limit: number = itemsPerPage,
    filter: string = filterValue
  ) => {
    try {
      setLoading(true);
      const response = await fetchUserData(page, limit, filter);
      setTotalUsers(response.total);
      setUsersData(
        response.data
      );
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Ocorreu um erro inesperado.");
      }
    }
  };

  return loading ? <Loading /> : (
    <div>
      <Header />
    <div className="container mx-auto p-4">
      <div className="flex flex-col items-center mb-4">
        <h2 className="text-2xl font-semibold mb-4">Lista de usuários</h2>
        <div className="flex items-center justify-between w-full mb-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Filtrar por nome ou e-mail"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1"
            />
            <button
              onClick={() => getUsers()}
              className="bg-purple-500 text-white rounded-md px-4 py-1 hover:bg-purple-600"
            >
              Buscar
            </button>
          </div>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="border border-gray-300 rounded-md px-2 py-1"
          >
            <option data-testid="select-option" value={5}>5 por página</option>
            <option data-testid="select-option" value={10}>10 por página</option>
            <option data-testid="select-option" value={20}>20 por página</option>
            <option data-testid="select-option" value={30}>30 por página</option>
            <option data-testid="select-option" value={40}>40 por página</option>
            <option data-testid="select-option" value={50}>50 por página</option>
          </select>
        </div>
        <p className="mb-4 text-gray-600">
          Resultados encontrados: {totalUsers}
        </p>
      </div>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b w-1/5">E-mail</th>
            <th className="py-2 px-4 border-b w-1/5">Nome</th>
            <th className="py-2 px-4 border-b w-1/5">CPF</th>
            <th className="py-2 px-4 border-b w-1/5">Telefone</th>
            <th className="py-2 px-4 border-b w-1/10">Cargo</th>
            <th className="py-2 px-4 border-b w-1/5">Ações</th>
          </tr>
        </thead>
        <tbody>
          {usersData.map((user) => (
            <TableRow
              key={user.id}
              user={user}
              usersData={usersData}
              setUsersData={setUsersData}
              isAdmin={isAdmin}
            />
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-4">
        {currentPage > 2 && (
          <button
            onClick={() => handlePageChange(1)}
            className="px-4 py-2 mx-1 rounded-md border bg-purple-300 text-white hover:bg-purple-600"
          >
            <ChevronDoubleLeftIcon className="size-4 text-white hover:text-gray-600 cursor-pointer" />
          </button>
        )}
        {currentPage > 1 && (
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-4 py-2 mx-1 rounded-md border bg-purple-300 text-white hover:bg-purple-600"
            disabled={currentPage === 1}
          >
            <ChevronLeftIcon className="size-4 text-white hover:text-gray-600 cursor-pointer" />
          </button>
        )}
        {totalPages > 3 && currentPage > 1 && (
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-4 py-2 mx-1 rounded-md border bg-purple-300 text-white hover:bg-purple-600"
          >
            {currentPage - 1}
          </button>
        )}
        <button
          onClick={() => handlePageChange(currentPage)}
          className="px-4 py-2 mx-1 rounded-md border bg-purple-600 text-white hover:bg-purple-700"
        >
          {currentPage}
        </button>
        {totalPages > 3 && currentPage < totalPages && (
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-4 py-2 mx-1 rounded-md border bg-purple-300 text-white hover:bg-purple-600"
          >
            {currentPage + 1}
          </button>
        )}
        {currentPage < totalPages && (
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-4 py-2 mx-1 rounded-md border bg-purple-300 text-white hover:bg-purple-600"
            disabled={currentPage === totalPages}
            data-testid="next-page-btn"
          >
            <ChevronRightIcon className="size-4 text-white hover:text-gray-600 cursor-pointer" />
          </button>
        )}
        {currentPage + 1 < totalPages && (
          <button
            onClick={() => handlePageChange(totalPages)}
            className="px-4 py-2 mx-1 rounded-md border bg-purple-300 text-white hover:bg-purple-600"
          >
            <ChevronDoubleRightIcon className="size-4 text-white hover:text-gray-600 cursor-pointer" />
          </button>
        )}
      </div>
      {error && (
        <p>{error}</p>
      )}
    </div>
    </div>
  );
}
