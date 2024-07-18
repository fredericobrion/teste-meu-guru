import { ChangeEvent, useState } from "react";
import { User } from "../../../types/user";
import { formatCPF, formatPhone } from "../../../utils/formatInputs";
import { ErrorsInputs } from "../../..//types/errors-inputs";
import {
  validateCpf,
  validateEmail,
  validatePhone
} from "../../../utils/validateInputs";

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
    console.log(validatePhone(e.target.value));
    setErrors({
      ...errors,
      phone: !validatePhone(formatPhone(e.target.value)),
    });
  };

  const validsInputs =
    errors.cpf || errors.email || errors.phone || errors.name;

  return (
    <tr>
      <td className="py-2 px-2 md:px-4 border-b">
        {editing ? (
          <input
            type="email"
            value={email}
            className={`rounded-md border px-2 py-1 md:px-1 md:py-2 wd-fit focus:shadow-purple-500 focus:shadow-sm focus:outline-none my-4 ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            onChange={handleChangeEmail}
          />
        ) : (
          email
        )}
      </td>
      <td className="py-2 px-2 md:px-4 border-b">
        {editing ? (
          <input
            type="text"
            value={name}
            className={`rounded-md border px-2 py-1 md:px-1 md:py-2 focus:shadow-purple-500 focus:shadow-sm focus:outline-none my-4 ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            onChange={handleChangeName}
          />
        ) : (
          name
        )}
      </td>
      <td className="py-2 px-2 md:px-0 border-b">
        {editing ? (
          <input
            type="text"
            value={cpf}
            className={`rounded-md border px-2 py-1 md:px-1 md:py-2 focus:shadow-purple-500 focus:shadow-sm focus:outline-none my-4 ${
              errors.cpf ? "border-red-500" : "border-gray-300"
            }`}
            onChange={handleChangeCpf}
          />
        ) : (
          cpf
        )}
      </td>
      <td className="py-2 px-2 md:px-4 border-b">
        {editing ? (
          <input
            type="text"
            value={phone}
            className={`rounded-md border px-2 py-1 md:px-1 md:py-2 focus:shadow-purple-500 focus:shadow-sm focus:outline-none my-4 ${
              errors.phone ? "border-red-500" : "border-gray-300"
            }`}
            onChange={handleChangePhone}
          />
        ) : (
          phone
        )}
      </td>
      <td className="py-2 px-2 md:px-4 border-b">
        {admin ? "Administrador" : "Usuário"}
      </td>
      <td className="py-2 px-2 md:px-4 border-b text-center">
        <button
          className={`bg-blue-500 text-white px-2 py-1 rounded mr-2 ${
            validsInputs
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-blue-600 hover:scale-105 cursor-pointer"
          }`}
          disabled={validsInputs}
          onClick={() => setEditing(!editing)}
        >
          {editing ? "Confirmar" : "Editar"}
        </button>
        <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" disabled={!isAdmin}>
          Excluir
        </button>
      </td>
    </tr>
  );
}
