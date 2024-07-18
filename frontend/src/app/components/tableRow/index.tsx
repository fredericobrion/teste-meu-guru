import { ChangeEvent, useState } from "react";
import { User } from "../../../types/user";
import { formatCPF, formatPhone } from "../../../utils/formatInputs";
import { ErrorsInputs } from "../../../types/errors-inputs";
import {
  validateCpf,
  validateEmail,
  validatePhone,
} from "../../../utils/validateInputs";
import { deleteUser, updateUser } from "../../../utils/api";
import Swal from "sweetalert2";

type TableRowProps = {
  user: User;
  usersData: User[];
  setUsersData: (users: User[]) => void;
  isAdmin: boolean;
};

export default function TableRow({
  user,
  usersData,
  setUsersData,
  isAdmin,
}: TableRowProps) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [cpf, setCpf] = useState(user.cpf);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [admin, setAdmin] = useState(user.admin);
  const [errors, setErrors] = useState<ErrorsInputs>({
    name: false,
    email: false,
    cpf: false,
    phone: false,
  });

  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setErrors({ ...errors, email: !validateEmail(e.target.value) });
  };

  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setErrors({ ...errors, name: !(e.target.value.length >= 2) });
  };

  const handleChangeCpf = (e: ChangeEvent<HTMLInputElement>) => {
    setCpf(formatCPF(e.target.value));
    setErrors({ ...errors, cpf: !validateCpf(e.target.value) });
  };

  const handleChangePhone = (e: ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
    setErrors({
      ...errors,
      phone: !validatePhone(formatPhone(e.target.value)),
    });
  };

  const handleDelete = async () => {
    try {
      await deleteUser(user.id);
      setUsersData(usersData.filter((u) => u.id !== user.id));
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        text: "Erro ao excluir usuário",
      });
    }
  };

  const handleUpdate = async () => {
    try {
      await updateUser(user.id, name, email, cpf, phone, admin);
      setUsersData(
        usersData.map((u) =>
          u.id === user.id ? { ...u, name, email, cpf, phone, admin } : u
        )
      );
      setEditing(false);
      Swal.fire({
        icon: "success",
        text: "Usuário atualizado",
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        text: "Erro ao atualizar usuário",
      });
    }
  };

  const validsInputs =
    errors.cpf || errors.email || errors.phone || errors.name;

  const handleChangeAdmin = (value: boolean) => {
    setAdmin(value);
  };

  return (
    <tr className="border-b">
      <td className="py-2 px-4 border-b w-1/5 align-middle">
        {editing ? (
          <input
            type="email"
            value={email}
            className={`rounded-md border px-2 py-1 w-full focus:shadow-purple-500 focus:shadow-sm focus:outline-none ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            onChange={handleChangeEmail}
          />
        ) : (
          email
        )}
      </td>
      <td className="py-2 px-4 border-b w-1/5 align-middle">
        {editing ? (
          <input
            type="text"
            value={name}
            className={`rounded-md border px-2 py-1 w-full focus:shadow-purple-500 focus:shadow-sm focus:outline-none ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            onChange={handleChangeName}
          />
        ) : (
          name
        )}
      </td>
      <td className="py-2 px-4 border-b w-1/5 align-middle">
        {editing ? (
          <input
            type="text"
            value={cpf}
            className={`rounded-md border px-2 py-1 w-full focus:shadow-purple-500 focus:shadow-sm focus:outline-none ${
              errors.cpf ? "border-red-500" : "border-gray-300"
            }`}
            onChange={handleChangeCpf}
          />
        ) : (
          cpf
        )}
      </td>
      <td className="py-2 px-4 border-b w-1/5 align-middle">
        {editing ? (
          <input
            type="text"
            value={phone}
            className={`rounded-md border px-2 py-1 w-full focus:shadow-purple-500 focus:shadow-sm focus:outline-none ${
              errors.phone ? "border-red-500" : "border-gray-300"
            }`}
            onChange={handleChangePhone}
          />
        ) : (
          phone
        )}
      </td>
      <td className="py-2 px-4 border-b w-1/5 align-middle">
        {editing ? (
          <select
            value={admin ? "Administrador" : "Usuário"}
            onChange={(e) => handleChangeAdmin(e.target.value === "Administrador")}
            className="rounded-md border px-2 py-1 w-full focus:shadow-purple-500 focus:shadow-sm focus:outline-none border-gray-300"
          >
            <option value="Administrador">Administrador</option>
            <option value="Usuário">Usuário</option>
          </select>
        ) : admin ? (
          "Administrador"
        ) : (
          "Usuário"
        )}
      </td>
      <td className="py-2 px-4 border-b w-1/5 text-center align-middle">
        <button
          className={`bg-blue-500 text-white px-4 py-2 mb-2 rounded block w-full ${
            validsInputs || !isAdmin
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-blue-600 hover:scale-105 cursor-pointer"
          }`}
          disabled={validsInputs || !isAdmin}
          onClick={() => (editing ? handleUpdate() : setEditing(!editing))}
        >
          {editing ? "Confirmar" : "Editar"}
        </button>
        <button
          onClick={() => (editing ? setEditing(false) : handleDelete())}
          disabled={!isAdmin}
          className={`bg-red-500 text-white px-4 py-2 rounded block w-full ${
            validsInputs || !isAdmin
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-red-600 hover:scale-105 cursor-pointer"
          }`}
        >
          {editing ? "Cancelar" : "Excluir"}
        </button>
      </td>
    </tr>
  );
}
