"use client";
import { useEffect, useState } from "react";
import { getTokenCookie } from "../../utils/cookieUtils";
import { fetchUserData } from "../../utils/api";
import { useRouter } from "next/navigation";
import { User } from "../../types/user";
import TableRow from "../components/tableRow";

export default function UsersListPage() {
  const router = useRouter();

  const [usersData, setUsersData] = useState<User[]>([]);

  useEffect(() => {
    const fetch = async () => {
      if (getTokenCookie()) {
        try {
          const response = await fetchUserData();
          setUsersData(response.data.filter((u: User) => u.email !== 'admin@admin.com'));
        } catch (error) {
          console.error(error);
        }
      } else {
        router.push("/");
      }
    };

    fetch();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Lista de usuários</h2>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b w-2/9">E-mail</th>
            <th className="py-2 px-4 border-b w-2/9">Nome</th>
            <th className="py-2 px-0 border-b w-1/9">CPF</th>
            <th className="py-2 px-4 border-b w-1/9">Telefone</th>
            <th className="py-2 px-4 border-b w-1/9">Cargo</th>
            <th className="py-2 px-4 border-b w-2/9">Ações</th>
          </tr>
        </thead>
        <tbody>
          {usersData.map((user) => (
            <TableRow key={user.id} user={user} usersData={usersData} setUsersData={setUsersData}/>
          ))}
        </tbody>
      </table>
    </div>
  );
}
