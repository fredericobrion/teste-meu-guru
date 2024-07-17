import axios from "axios";
import { getTokenCookie } from "./cookieUtils";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getTokenCookie();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const login = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post("/auth/login", {
      email,
      password,
    });

    const token = response.data.access_token;

    document.cookie = `token=${token}; path=/;`;

    return token;
  } catch (error) {
    if (error.response.status) {
      throw new Error("E-mail e/ou senha inválidos");
    } else {
      throw new Error("Erro ao comunicar com o servidor");
    }
  }
};

export const fetchUserData = async () => {
  try {
    const response = await axiosInstance.get("/user");
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Erro ao buscar dados do usuário");
  }
};
