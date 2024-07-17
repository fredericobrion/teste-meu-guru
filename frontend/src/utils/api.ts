import axios from "axios";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

const api = axios.create({ baseURL: BACKEND_URL, withCredentials: true });

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', {
      email,
      password,
    });

    const token = response.data.access_token;

    document.cookie = `token=${token}; path=/;`;

    return token;
  } catch (error) {
    if (error.response.status) {
      throw new Error('E-mail e/ou senha inválidos');
    } else {
      throw new Error('Erro ao comunicar com o servidor');
    }
  }
};
