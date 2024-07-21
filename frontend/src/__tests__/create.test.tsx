import { describe, expect, it, vi, afterEach, beforeEach } from "vitest";
import { screen, waitFor, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppWrapper, useAppContext } from "../context/context";
import CreatePage from "../app/create/page";
import { usePathname } from "next/navigation";
import Swal, { SweetAlertResult } from "sweetalert2";
import { createUser } from "../utils/api";

vi.mock("../utils/api");
vi.mock("sweetalert2");
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

describe("CreatePage", () => {
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
    vi.mocked(Swal.fire).mockResolvedValue({
      isConfirmed: true,
      isDenied: false,
      isDismissed: false,
      value: true,
    } as SweetAlertResult<unknown>);

    render(
      <AppWrapper>
        <CreatePage />
      </AppWrapper>
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/E-mail/i)).toBeDefined();
      expect(screen.getByPlaceholderText(/Senha/i)).toBeDefined();
      expect(screen.getByPlaceholderText(/Nome/i)).toBeDefined();
      expect(screen.getByPlaceholderText(/CPF/i)).toBeDefined();
      expect(screen.getByPlaceholderText(/Telefone/i)).toBeDefined();
      expect(
        screen.getByRole("radio", {
          name: /usuário/i,
        })
      ).toBeDefined();
      expect(
        screen.getByRole("radio", {
          name: /administrador/i,
        })
      ).toBeDefined();
      expect(
        screen.getByRole("button", {
          name: /criar/i,
        })
      ).toBeDefined();
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
        <CreatePage />
      </AppWrapper>
    );

    expect(Swal.fire).toHaveBeenCalled();
  });

  it("should display errors", async () => {
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
    vi.mocked(Swal.fire).mockResolvedValue({
      isConfirmed: true,
      isDenied: false,
      isDismissed: false,
      value: true,
    } as SweetAlertResult<unknown>);

    render(
      <AppWrapper>
        <CreatePage />
      </AppWrapper>
    );
    const submitBtn = screen.getByRole("button", {
      name: /criar/i,
    });

    await userEvent.click(submitBtn);

    expect(screen.findByText(/e\-mail inválido/i)).toBeDefined();
    expect(
      screen.findByText(/a senha deverá ter no mínimo 6 caracteres/i)
    ).toBeDefined();
    expect(
      screen.findByText(/o nome deverá ter no mínimo 2 caracteres/i)
    ).toBeDefined();
    expect(screen.findByText(/cpf inválido/i)).toBeDefined();
    expect(screen.findByText(/telefone inválido/i)).toBeDefined();
  });

  it("should be able to create user", async () => {
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
    vi.mocked(Swal.fire).mockResolvedValue({
      isConfirmed: true,
      isDenied: false,
      isDismissed: false,
      value: true,
    } as SweetAlertResult<unknown>);
    vi.mocked(createUser).mockResolvedValue({})

    const email = "teste@email.com";
    const password = "password";
    const name = "teste";
    const cpf = "06657758877";
    const phone = "21558469845";

    render(
      <AppWrapper>
        <CreatePage />
      </AppWrapper>
    );

    const emailInput = screen.getByPlaceholderText(/E-mail/i);
    const passwordInput = screen.getByPlaceholderText(/Senha/i);
    const nameInput = screen.getByPlaceholderText(/Nome/i);
    const cpfInput = screen.getByPlaceholderText(/CPF/i);
    const phoneInput = screen.getByPlaceholderText(/Telefone/i);
    const submitBtn = screen.getByRole("button", {
      name: /criar/i,
    });

    await userEvent.type(emailInput, email);
    await userEvent.type(passwordInput, password);
    await userEvent.type(nameInput, name);
    await userEvent.type(cpfInput, cpf);
    await userEvent.type(phoneInput, phone);

    await userEvent.click(submitBtn);

    expect(Swal.fire).toHaveBeenCalled();
  });
});
