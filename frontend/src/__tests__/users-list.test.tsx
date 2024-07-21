import { describe, expect, it, vi, afterEach, beforeEach } from "vitest";
import { screen, waitFor, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getTokenCookie } from "../utils/cookieUtils";
import UsersListPage from "../app/users-list/page";
import { usersList, adminToken, filteredList } from "./helper/mock";
import { fetchUserData } from "../utils/api";
import { jwtDecode } from "jwt-decode";
import Swal, { SweetAlertResult } from "sweetalert2";
import { AppWrapper, useAppContext } from "../context/context";
import { useRouter, usePathname } from "next/navigation";

vi.mock("../utils/api");
vi.mock("../utils/cookieUtils");
vi.mock("jwt-decode");
vi.mock("sweetalert2", () => {
  return {
    default: {
      fire: vi.fn().mockResolvedValue({
        isConfirmed: true,
        isDenied: false,
        isDismissed: false,
        value: true,
      } as SweetAlertResult<unknown>),
    },
  };
});
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  usePathname: vi.fn(),
}));

vi.mock("../context/context", async (importOriginal) => {
  const actual = await importOriginal();
  if (typeof actual === "object" && actual !== null) {
    return {
      ...actual,
      useAppContext: vi.fn(),
    };
  }
  return {
    useAppContext: vi.fn(),
  };
});

describe("UsersListPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    vi.mocked(usePathname).mockResolvedValue("/user-list");
    vi.mocked(Swal.fire).mockResolvedValue({
      isConfirmed: true,
      isDenied: false,
      isDismissed: false,
      value: true,
    } as SweetAlertResult<unknown>);
  });

  it("should render the page correctly", async () => {
    vi.mocked(fetchUserData).mockResolvedValue({
      data: usersList,
      total: usersList.length,
    });
    vi.mocked(useAppContext).mockResolvedValue({
      decoded: {
        admin: true,
        name: "teste",
        sub: 1,
      },
      loading: false,
      setDecoded: vi.fn(),
      setLoading: vi.fn(),
    });

    render(
      <AppWrapper>
        <UsersListPage />
      </AppWrapper>
    );

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

  it("should handle user not logged in", async () => {
    vi.mocked(useAppContext).mockResolvedValue({
      decoded: null,
      loading: false,
      setDecoded: vi.fn(),
      setLoading: vi.fn(),
    });

    render(
      <AppWrapper>
        <UsersListPage />
      </AppWrapper>
    );

    expect(Swal.fire).toHaveBeenCalled();
  });
});

