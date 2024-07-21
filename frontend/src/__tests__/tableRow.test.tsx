import { describe, expect, it, vi, afterEach, beforeEach } from "vitest";
import { screen, waitFor, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TableRow from "../app/components/tableRow/index";
import { User } from "../types/user";
import { deleteUser, updateUser } from "../utils/api";
import { use } from "react";

const mockSetUserData = (users: User[]) => {
  console.log(users);
};

vi.mock("../utils/api", () => ({
  updateUser: vi.fn(),
  deleteUser: vi.fn(),
}));

const usersList: User[] = [
  {
    id: 1,
    email: "user1@email.com",
    name: "User One",
    cpf: "12345678900",
    phone: "1234567890",
    admin: true,
  },
  {
    id: 2,
    email: "user2@email.com",
    name: "User Two",
    cpf: "123.456.789-01",
    phone: "(12) 3456-7891",
    admin: false,
  },
];

describe("table row", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("should display all elements", () => {
    render(
      <TableRow
        isAdmin={true}
        setUsersData={mockSetUserData}
        usersData={usersList}
        user={usersList[0]}
      />
    );

    expect(screen.getByText(usersList[0].name)).toBeDefined();
    expect(screen.getByText(usersList[0].email)).toBeDefined();
    expect(screen.getByText(usersList[0].cpf)).toBeDefined();
    expect(screen.getByText(usersList[0].phone)).toBeDefined();
    expect(screen.getByRole("button", { name: /editar/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /excluir/i })).toBeDefined();
  });

  it("should be able to edit as admin", async () => {
    vi.mocked(updateUser).mockResolvedValue({});
    const user = usersList[0];

    render(
      <TableRow
        isAdmin={true}
        setUsersData={mockSetUserData}
        usersData={usersList}
        user={user}
      />
    );
    const editBtn = screen.getByRole("button", { name: /editar/i });

    await userEvent.click(editBtn);

    expect(screen.findByTestId("email-input")).toBeDefined();
    expect(screen.findByTestId("name-input")).toBeDefined();
    expect(screen.findByTestId("cpf-input")).toBeDefined();
    expect(screen.findByTestId("phone-input")).toBeDefined();
    expect(screen.findByTestId("admin-select")).toBeDefined();

    const confirmBtn = screen.getByRole("button", { name: /confirmar/i });

    expect(confirmBtn).toBeDefined();
    expect(screen.getByRole("button", { name: /cancelar/i })).toBeDefined();

    await userEvent.click(confirmBtn);

    expect(updateUser).toHaveBeenCalled();
    expect(updateUser).toHaveBeenCalledWith(
      user.id,
      user.name,
      user.email,
      user.cpf,
      user.phone,
      user.admin
    );
  });

  it("should be able to remove", async () => {
    vi.mocked(deleteUser).mockResolvedValue({});
    const user = usersList[0];

    render(
      <TableRow
        isAdmin={true}
        setUsersData={mockSetUserData}
        usersData={usersList}
        user={user}
      />
    );
    const removeBtn = screen.getByRole("button", { name: /excluir/i });

    await userEvent.click(removeBtn);

    expect(deleteUser).toHaveBeenCalled();
    expect(deleteUser).toHaveBeenCalledWith(user.id);
  });
});
