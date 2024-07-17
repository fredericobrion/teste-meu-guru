"use client";
import { useEffect, useState } from "react";
import { getTokenCookie } from "../../utils/cookieUtils";
import { fetchUserData } from "../../utils/api";
import { useRouter } from "next/navigation";

export default function UsersListPage() {
  const router = useRouter();

  const [usersData, setUsersData] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      if (getTokenCookie()) {
        try {
          const response = await fetchUserData();
          setUsersData(response.data);
        } catch (error) {
          console.error(error);
        }
      } else {
        router.push("/");
      }
    };

    fetch();
  }, []);

  console.log(usersData);

  return <h2>Lista de usuários</h2>;
}
