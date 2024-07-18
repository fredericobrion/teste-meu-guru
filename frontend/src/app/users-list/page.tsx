"use client";
import { ChangeEvent, useEffect, useState } from "react";
import { getTokenCookie } from "../../utils/cookieUtils";
import { fetchUserData } from "../../utils/api";
import { useRouter } from "next/navigation";
import { User } from "../../types/user";
import TableRow from "../components/tableRow";
import { jwtDecode } from "jwt-decode";
import {
  ChevronDoubleRightIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  ChevronDoubleLeftIcon,
} from "@heroicons/react/24/outline";

export default function UsersListPage() {
  const router = useRouter();

  const [usersData, setUsersData] = useState<User[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterValue, setFilterValue] = useState("");

  const totalPages = Math.ceil(totalUsers / itemsPerPage);

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

  useEffect(() => {
    const fetch = async () => {
      if (getTokenCookie()) {
        const decoded = jwtDecode(getTokenCookie()!);

        setIsAdmin(decoded.admin);

        try {
          const response = await fetchUserData();
          setTotalUsers(response.total);
          setUsersData(
            response.data.filter((u: User) => u.email !== "admin@admin.com")
          );
        } catch (error) {
          console.error(error);
        }
      } else {
        router.push("/");
      }
    };

    fetch();
  }, []);

  const getUsers = async (
    page: number = currentPage,
    limit: number = itemsPerPage,
    filter: string = filterValue
  ) => {
    const response = await fetchUserData(page, limit, filter);
    setTotalUsers(response.total);
    setUsersData(
      response.data.filter((u: User) => u.email !== "admin@admin.com")
    );
  };

  return (
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
            <option value={3}>3 por página</option>
            <option value={10}>10 por página</option>
            <option value={20}>20 por página</option>
            <option value={30}>30 por página</option>
            <option value={40}>40 por página</option>
            <option value={50}>50 por página</option>
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
        {totalPages > 3 && (
          <button
            onClick={() => handlePageChange(1)}
            className="px-4 py-2 mx-1 rounded-md border bg-purple-500 text-white hover:bg-purple-600"
          >
            Primeira
          </button>
        )}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className={`px-4 py-2 mx-1 rounded-md border ${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-purple-500 text-white hover:bg-purple-600"
          }`}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        {totalPages > 3 && currentPage > 1 && (
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-4 py-2 mx-1 rounded-md border bg-purple-500 text-white hover:bg-purple-600"
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
            className="px-4 py-2 mx-1 rounded-md border bg-purple-500 text-white hover:bg-purple-600"
          >
            {currentPage + 1}
          </button>
        )}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className={`px-4 py-2 mx-1 rounded-md border ${
            currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-purple-500 text-white hover:bg-purple-600"
          }`}
          disabled={currentPage === totalPages}
        >
          Próxima
        </button>
        {totalPages > 3 && (
          <button
            onClick={() => handlePageChange(totalPages)}
            className="px-4 py-2 mx-1 rounded-md border bg-purple-500 text-white hover:bg-purple-600"
          >
            Última
          </button>
        )}
      </div>
    </div>
  );
}
