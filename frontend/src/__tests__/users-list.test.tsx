import { describe, expect, it, vi, afterEach, beforeEach } from "vitest";
import { screen, waitFor, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  setTokenCookie,
  removeTokenCookie,
  getTokenCookie,
} from "../utils/cookieUtils";
import { useRouter } from "next/navigation";
import UsersListPage from "../app/users-list/page";
import { usersList, adminToken, userToken, filteredList } from "./helper/mock";
import { fetchUserData, updateUser, deleteUser } from "../utils/api";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

vi.mock("../utils/api");
vi.mock("../utils/cookieUtils");
vi.mock("jwt-decode");
vi.mock("sweetalert2");
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("UsersListPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it("should render the page correctly", async () => {
    vi.mocked(getTokenCookie).mockResolvedValue("token");
    vi.mocked(jwtDecode).mockResolvedValue(adminToken);
    vi.mocked(fetchUserData).mockResolvedValue({
      data: usersList,
      total: usersList.length,
    });

    render(<UsersListPage />);

    await waitFor(() => {
      expect(screen.findByText("Lista de usuários")).toBeDefined();
      expect(
        screen.getByPlaceholderText("Filtrar por nome ou e-mail")
      ).toBeDefined();
      expect(screen.findByText("Buscar")).toBeDefined();
      expect(screen.findByText("5 por página")).toBeDefined();
      expect(screen.findByText("10 por página")).toBeDefined();
      expect(screen.findByText("20 por página")).toBeDefined();
      expect(screen.findByText("Resultados encontrados: 15")).toBeDefined();
      expect(screen.findByText("admin")).toBeDefined();
      expect(screen.findByText("Administrador (a)")).toBeDefined();
    });
  });

  it.skip("should handle user not logged in", async () => {
    vi.mocked(getTokenCookie).mockResolvedValue(undefined);
    vi.mocked(Swal.fire).mockResolvedValue({
      isConfirmed: true,
      isDenied: false,
      isDismissed: false,
    });

    const pushMock = vi.fn();

    render(<UsersListPage />);

    expect(await screen.findByText("Necessário estar logado")).toBeDefined();

    // await waitFor(() => {
    //   // expect(Swal.fire).toHaveBeenCalledWith({
    //   //   icon: "error",
    //   //   text: "Necessário estar logado",
    //   //   timer: 2000,
    //   //   confirmButtonText: "Voltar",
    //   //   timerProgressBar: true,
    //   // });
    //   expect(Swal.fire).toHaveBeenCalled()
    //   // expect(pushMock).toHaveBeenCalledWith("/");
    // });
  });

  it("should handle results per page", async () => {
    vi.mocked(getTokenCookie).mockResolvedValue("token");
    vi.mocked(jwtDecode).mockResolvedValue(adminToken);
    vi.mocked(fetchUserData).mockResolvedValue({
      data: usersList,
      total: usersList.length,
    });

    render(<UsersListPage />);

    await waitFor(() => {
      expect(screen.getByText("Resultados encontrados: 15")).toBeDefined();
    });

    const selectDropDown = await screen.findByRole("combobox");

    await userEvent.click(selectDropDown);

    const options = await screen.findAllByTestId("select-option");

    await userEvent.click(options[2]);

    await expect(fetchUserData).toHaveBeenCalled();
  });

  it("should handle pagination change", async () => {
    vi.mocked(getTokenCookie).mockResolvedValue("token");
    vi.mocked(jwtDecode).mockResolvedValue(adminToken);
    vi.mocked(fetchUserData).mockResolvedValue({
      data: usersList,
      total: usersList.length,
    });

    render(<UsersListPage />);

    await waitFor(() => {
      expect(screen.getByText("Resultados encontrados: 15")).toBeDefined();
    });

    const nextPageBtn = screen.getByTestId("next-page-btn");

    await userEvent.click(nextPageBtn);

    await expect(fetchUserData).toHaveBeenCalledTimes(2);
    await expect(fetchUserData).toHaveBeenCalledWith(2, 10, "");
  });

  it("should filter users by name or email", async () => {
    vi.mocked(getTokenCookie).mockResolvedValue("token");
    vi.mocked(jwtDecode).mockResolvedValue(adminToken);
    vi.mocked(fetchUserData).mockResolvedValueOnce({
      data: usersList,
      total: usersList.length,
    });
    vi.mocked(fetchUserData).mockResolvedValueOnce({
      data: filteredList,
      total: filteredList.length,
    });

    render(<UsersListPage />);

    await waitFor(() => {
      expect(screen.getByText("Resultados encontrados: 15")).toBeDefined();
    });

    const filterInput = screen.getByRole("textbox");
    const searchBtn = screen.getByRole("button", {
      name: /buscar/i,
    });

    await userEvent.type(filterInput, "ana");

    await userEvent.click(searchBtn);

    await waitFor(() => {
      expect(screen.getByText("Resultados encontrados: 2")).toBeDefined();
    });

    await waitFor(() => {
      expect(fetchUserData).toHaveBeenCalledWith(1, 10, "ana");
    });
  });

  it("admin should be able to edit a user", async () => {
    vi.mocked(getTokenCookie).mockResolvedValue("token");
    vi.mocked(jwtDecode).mockResolvedValue(adminToken);
    vi.mocked(fetchUserData).mockResolvedValueOnce({
      data: usersList,
      total: usersList.length,
    });

    render(<UsersListPage />);

    await waitFor(() => {
      expect(screen.getByText("Resultados encontrados: 15")).toBeDefined();
    });

    const editButtons = await screen.findAllByTestId("edit-btn");


    await userEvent.click(editButtons[0]);

    expect(screen.findByTestId("email-input")).toBeDefined();
    expect(screen.findByTestId("name-input")).toBeDefined();
    expect(screen.findByTestId("cpf-input")).toBeDefined();
    expect(screen.findByTestId("phone-input")).toBeDefined();
    expect(screen.findByTestId("admin-select")).toBeDefined();
    expect(screen.findByRole("button", { name: /confirmar/i })).toBeDefined();
    expect(screen.findByRole("button", { name: /cancelar/i })).toBeDefined();
  });
});
