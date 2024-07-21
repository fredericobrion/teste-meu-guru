import { vi, describe, expect, it, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import Header from "../app/components/header";
import userEvent from "@testing-library/user-event";
import { useAppContext, AppWrapper } from "../context/context";
import { usePathname } from "next/navigation";
import Home from "../app/page";
import UsersListPage from "../app/users-list/page";
import { useRouter } from "next/navigation";

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
    vi.clearAllMocks();
  });

  it("should render all elements in home page", () => {
    vi.mocked(usePathname).mockResolvedValue("/");
    vi.mocked(useAppContext).mockReturnValue({
      setDecoded: vi.fn(),
      loading: false,
      decoded: null,
      setLoading: vi.fn(),
    });

    render(
      <AppWrapper>
        <Home />
      </AppWrapper>
    );

    expect(screen.getByTestId("logo")).toBeDefined();
  });

  it("should render all elements in users-list page as admin", () => {
    vi.mocked(usePathname).mockResolvedValue("/users-list");
    vi.mocked(useAppContext).mockResolvedValue({
      decoded: {
        admin: true,
        name: "admin",
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

    expect(screen.getByTestId("logo")).toBeDefined();
    expect(screen.findByText(/admin/i)).toBeDefined();
    expect(
      screen.findByRole("heading", {
        name: /administrador\(a\)/i,
      })
    ).toBeDefined();
    expect(
      screen.findByRole("button", {
        name: /criar/i,
      })
    ).toBeDefined();
    expect(
      screen.findByRole("button", {
        name: /sair/i,
      })
    ).toBeDefined();
  });

  it("should render all elements in users-list page as user", () => {
    vi.mocked(usePathname).mockResolvedValue("/users-list");
    vi.mocked(useAppContext).mockResolvedValue({
      decoded: {
        admin: true,
        name: "user",
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

    expect(screen.getByTestId("logo")).toBeDefined();
    expect(screen.findByText(/user/i)).toBeDefined();
    expect(
      screen.findByRole("heading", {
        name: /usuário\(a\)/i,
      })
    ).toBeDefined();
    expect(
      screen.findByRole("button", {
        name: /criar/i,
      })
    ).toBeDefined();
    expect(
      screen.findByRole("button", {
        name: /sair/i,
      })
    ).toBeDefined();
  });

  // it.only("should redirect do create page", async () => {
  //   vi.mocked(usePathname).mockResolvedValue("/users-list");
  //   vi.mocked(useAppContext).mockResolvedValue({
  //     decoded: {
  //       admin: true,
  //       name: "user",
  //       sub: 1,
  //     },
  //     loading: false,
  //     setDecoded: vi.fn(),
  //     setLoading: vi.fn(),
  //   });

  //   const router = useRouter();

  //   vi.mocked(useRouter().push).mockResolvedValue();

  //   render(
  //     <AppWrapper>
  //       <UsersListPage />
  //     </AppWrapper>
  //   );

  
  //     const createBtn = await screen.findByRole("button", {
  //       name: /criar/i,
  //     })
    
  //     await userEvent.click(createBtn);

  //     expect(useRouter).toHaveBeenCalled();
  // });
});
