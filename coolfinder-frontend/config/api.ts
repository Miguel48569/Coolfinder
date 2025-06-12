import axios from "axios";
import { Platform } from "react-native";
import Constants from "expo-constants";

const API_URL =
  Constants.expoConfig?.extra?.apiUrl ||
  "https://f0bb-45-224-218-120.ngrok-free.app";

// Debug da configuração
console.log("\n=== Debug API Config ===");
console.log("API URL:", API_URL);
console.log("Platform:", Platform.OS);
console.log("Dev Mode:", __DEV__);
console.log("======================\n");

export const api = axios.create({
  baseURL: API_URL,
  timeout: 5000, // Reduzindo para 5 segundos
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  validateStatus: (status) => {
    return status >= 200 && status < 500; // Aceita status 2xx, 3xx e 4xx
  },
  maxRedirects: 5,
  withCredentials: true, // Tenta manter credenciais
});

// Debug de requisições
api.interceptors.request.use(
  (config) => {
    const fullUrl = `${config.baseURL}${config.url}`;
    console.log(`\n🔷 Iniciando requisição:`);
    console.log(`URL: ${fullUrl}`);
    console.log(`Método: ${config.method?.toUpperCase()}`);
    console.log("Headers:", config.headers);
    console.log("Timeout:", config.timeout);
    return config;
  },
  (error) => {
    console.error("❌ Erro ao configurar requisição:", {
      message: error.message,
      code: error.code,
      config: error.config,
    });
    return Promise.reject(error);
  }
);

// Debug de respostas
api.interceptors.response.use(
  (response) => {
    console.log(`\n✅ Resposta recebida:`);
    console.log(`Status: ${response.status}`);
    console.log(`URL: ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error("\n❌ Erro na resposta:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else if (error.request) {
      console.error("Tipo de erro:", error.code || "Sem resposta");
      console.error("Mensagem:", error.message);
      console.error("Request:", {
        method: error.request._method,
        url: error.request._url,
        status: error.request.status,
        response: error.request._response,
      });
    }
    console.error("Configuração:", {
      url: `${error.config?.baseURL}${error.config?.url}`,
      method: error.config?.method,
      timeout: error.config?.timeout,
    });
    return Promise.reject(error);
  }
);
