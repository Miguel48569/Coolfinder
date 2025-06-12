import { api } from "../config/api";
import axios, { AxiosError } from "axios";

export interface Loja {
  _id?: string;
  nome: string;
  endereco: string;
  latitude: number;
  longitude: number;
  foto: string;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  isNetworkError?: boolean;
}

const handleError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;

    if (!axiosError.response) {
      // Erro de rede ou servidor não alcançável
      const message =
        axiosError.code === "ECONNABORTED"
          ? "O servidor demorou muito para responder. Tente novamente."
          : "Não foi possível conectar ao servidor. Verifique sua conexão com a internet.";

      return {
        message,
        isNetworkError: true,
      };
    }

    // Erro com resposta do servidor
    return {
      message:
        axiosError.response.data?.message ||
        `Erro ${axiosError.response.status}: ${axiosError.response.statusText}`,
      statusCode: axiosError.response.status,
    };
  }

  // Erro genérico
  return {
    message:
      error instanceof Error ? error.message : "Ocorreu um erro inesperado",
  };
};

export const LojaService = {
  listarLojas: async () => {
    try {
      const response = await api.get<Loja[]>("/lojas");
      return response.data;
    } catch (error) {
      const treatedError = handleError(error);
      console.error("Erro ao listar lojas:", treatedError);
      throw treatedError;
    }
  },

  cadastrarLoja: async (loja: Omit<Loja, "_id">) => {
    try {
      const response = await api.post<Loja>("/lojas", loja);
      return response.data;
    } catch (error) {
      const treatedError = handleError(error);
      console.error("Erro ao cadastrar loja:", treatedError);
      throw treatedError;
    }
  },
};
