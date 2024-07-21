import { vi, describe, expect, it, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import Home from "../app/page";
import userEvent from "@testing-library/user-event";
import { useAppContext, AppWrapper } from "../context/context";
import { usePathname, useRouter } from "next/navigation";
import { login } from "../utils/api";

vi.mock("../utils/api", () => ({
  login: vi.fn(),
}));

vi.mock("../utils/cookieUtils", () => ({
  getTokenCookie: vi.fn(),
  setTokenCookie: vi.fn(),
  removeTokenCookie: vi.fn(),
}));

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

describe("Home Page", () => {
  beforeEach(() => {
    vi.mocked(useAppContext).mockReturnValue({
      setDecoded: vi.fn(),
      loading: false,
      decoded: null,
      setLoading: vi.fn(),
    });
    vi.clearAllMocks();
    vi.mocked(usePathname).mockResolvedValue("/");
  });

  it("should render email and password input and login button", () => {
    render(
      <AppWrapper>
        <Home />
      </AppWrapper>
    );

    const emailInput = screen.getByPlaceholderText("E-mail");
    const passwordInput = screen.getByPlaceholderText("Senha");
    const submitButton = screen.getByRole("button", { name: /entrar/i });

    expect(emailInput).toBeDefined();
    expect(passwordInput).toBeDefined();
    expect(submitButton).toBeDefined();
  });

  it("should show email error message when email is invalid", async () => {
    render(
      <AppWrapper>
        <Home />
      </AppWrapper>
    );

    const emailInput = screen.getByPlaceholderText("E-mail");
    const submitButton = screen.getByRole("button", { name: /entrar/i });

    userEvent.type(emailInput, "invalid@email");
    userEvent.click(submitButton);

    const emailError = await screen.findByText("E-mail inválido");
    expect(emailError).toBeDefined();
  });

  it("should show password error message when password is less than 6 characters", async () => {
    render(
      <AppWrapper>
        <Home />
      </AppWrapper>
    );

    const emailInput = screen.getByPlaceholderText("E-mail");
    const passwordInput = screen.getByPlaceholderText("Senha");
    const submitButton = screen.getByRole("button", { name: /entrar/i });

    await userEvent.type(emailInput, "test@email.com");
    await userEvent.type(passwordInput, "123");
    await userEvent.click(submitButton);

    await waitFor(() => {
      const errorMessage = screen.findByText(
        "A senha deverá ter no mínimo 6 caracteres"
      );
      expect(errorMessage).toBeDefined();
    });
  });

  it("should display and hide the password correctly", async () => {
    render(
      <AppWrapper>
        <Home />
      </AppWrapper>
    );

    const passwordInput = screen.getByPlaceholderText("Senha");
    const toggleButton = screen.getByTestId("toggleBtn");

    expect(passwordInput.getAttribute("type")).toBe("password");

    await userEvent.click(toggleButton);
    expect(passwordInput.getAttribute("type")).toBe("text");

    await userEvent.click(toggleButton);
    expect(passwordInput.getAttribute("type")).toBe("password");
  });

  it("should be able to login", async () => {
    vi.mocked(login).mockResolvedValue(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsIm5hbWUiOiJBZG1pbiIsImFkbWluIjp0cnVlLCJpYXQiOjE3MjEzODk1ODksImV4cCI6MTcyMTU2MjM4OX0.X-Pim1fVFN-iplfuMFpo7uuZTJ6Ek_M5DYkYuT6Ag_s"
    );
    vi.mocked(useRouter().push).mockResolvedValue();

    render(
      <AppWrapper>
        <Home />
      </AppWrapper>
    );

    const email = "test@email.com";
    const password = "123456";

    const emailInput = screen.getByPlaceholderText("E-mail");
    const passwordInput = screen.getByPlaceholderText("Senha");
    const submitButton = screen.getByRole("button", { name: /entrar/i });

    await userEvent.type(emailInput, email);
    await userEvent.type(passwordInput, password);
    await userEvent.click(submitButton);

    expect(login).toHaveBeenCalled();
    expect(login).toHaveBeenCalledWith(email, password);
  });
});
