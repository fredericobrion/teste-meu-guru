import { vi, describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import Home from "../app/page";
import userEvent from "@testing-library/user-event";
import { login } from "../utils/api";
import { setTokenCookie, removeTokenCookie } from "../utils/cookieUtils";
import { useRouter } from "next/router";

vi.mock("../utils/api", () => ({
  login: vi.fn(),
}));

vi.mock("../utils/cookieUtils", () => ({
  setTokenCookie: vi.fn(),
  removeTokenCookie: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("Home Page", () => {
  it("should render email and password input and login button", () => {
    render(<Home />);

    const emailInput = screen.getByPlaceholderText("E-mail");
    const passwordInput = screen.getByPlaceholderText("Senha");
    const submitButton = screen.getByRole("button", { name: /entrar/i });

    expect(emailInput).toBeDefined();
    expect(passwordInput).toBeDefined();
    expect(submitButton).toBeDefined();
  });

  it("should show email error message when email is invalid", async () => {
    render(<Home />);

    const emailInput = screen.getByPlaceholderText("E-mail");
    const submitButton = screen.getByRole("button", { name: /entrar/i });

    userEvent.type(emailInput, "invalid@email");
    userEvent.click(submitButton);

    const emailError = await screen.findByText("E-mail inválido");
    expect(emailError).toBeDefined();
  });

  it("should show password error message when password is less than 6 characters", async () => {
    render(<Home />);

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

  it.skip("should submit the form and redirect on successful login", async () => {
    // (login as vi.Mock).mockResolvedValueOnce();
    const mockLogin = vi.mocked(login);
    mockLogin.mockResolvedValueOnce();

    render(<Home />);

    const email = 'test@example.com';
    const password = 'password123';

    
    const emailInput = screen.getByPlaceholderText("E-mail");
    const passwordInput = screen.getByPlaceholderText("Senha");
    const submitButton = screen.getByRole("button", { name: /entrar/i });
    
    await userEvent.type(emailInput, email);
    await userEvent.type(passwordInput, password);
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith(email, password);
      expect(setTokenCookie).toHaveBeenCalled();
      expect(useRouter().push).toHaveBeenCalledWith("/users-list");
    });
  });

  it("should display and hide the password correctly", async () => {
    render(<Home />);

    const passwordInput = screen.getByPlaceholderText("Senha");
    const toggleButton = screen.getByTestId("toggleBtn");

    // Initial state
    expect(passwordInput.getAttribute("type")).toBe("password");

    // Toggle visibility
    await userEvent.click(toggleButton);
    expect(passwordInput.getAttribute("type")).toBe("text");

    await userEvent.click(toggleButton);
    expect(passwordInput.getAttribute("type")).toBe("password");
  });
});
