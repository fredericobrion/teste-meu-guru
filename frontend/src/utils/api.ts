import axios, { AxiosError } from "axios";
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

    return token;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      if (error.response.data.errorMessage) {
        throw new Error(error.response.data.errorMessage);
      } else {
        throw new Error("Erro desconhecido");
      }
    } else {
      throw new Error("Erro ao comunicar com o servidor");
    }
  }
};

export const fetchUserData = async (page: number = 1, limit: number = 10, filter?: string) => {
  try {
    const response = await axiosInstance.get(`/user?page=${page}&limit=${limit}${filter ? `&filter=${filter}` : ''}`);
    return response.data;
  } catch (error) {
    throw new Error("Erro ao buscar dados do usuário");
  }
};

export const createUser = async (
  name: string,
  email: string,
  password: string,
  cpf: string,
  phone: string,
  isAdmin: boolean
) => {
  try {
    const response = await axiosInstance.post("/user", {
      name,
      email,
      password,
      cpf,
      phone,
      isAdmin,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      if (error.response.data) {
        throw new Error(error.response.data.errorMessage);
      } else {
        throw new Error("Erro desconhecido");
      }
    } else {
      throw new Error("Erro ao comunicar com o servidor");
    }
  }
};

export const deleteUser = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`/user/${id}`);
    return response.data;
  } catch (error) {
    throw new Error("Erro ao remover usuário");
  }
};

export const updateUser = async (
  id: number,
  name: string,
  email: string,
  cpf: string,
  phone: string,
  admin: boolean
) => {
  try {
    const response = await axiosInstance.patch(`/user/${id}`, {
      name,
      email,
      cpf,
      phone,
      admin,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      if (error.response.data) {
        throw new Error(error.response.data.errorMessage);
      } else {
        throw new Error("Erro desconhecido");
      }
    } else {
      throw new Error("Erro ao comunicar com o servidor");
    }
  }
};
