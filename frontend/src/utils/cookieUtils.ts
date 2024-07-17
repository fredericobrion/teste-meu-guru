import Cookies from "js-cookie";

const TOKEN_COOKIE_KEY = "myapp_jwt";

export const setTokenCookie = (token: string) => {
  Cookies.set(TOKEN_COOKIE_KEY, token, { expires: 2 });
};

export const getTokenCookie = (): string | undefined => {
  return Cookies.get(TOKEN_COOKIE_KEY);
};

export const removeTokenCookie = () => {
  Cookies.remove(TOKEN_COOKIE_KEY);
};