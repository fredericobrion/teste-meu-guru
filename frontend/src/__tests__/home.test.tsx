import { afterEach, describe, expect, it } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import Home from "../app/page";
import userEvent from "@testing-library/user-event";
import { beforeEach } from "node:test";

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
    userEvent.click(submitButton);

    const errorMessage = await screen.findByText(
      "A senha deverá ter no mínimo 6 caracteres"
    );

    expect(errorMessage).toBeDefined();
  });
});
