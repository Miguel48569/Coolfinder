require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const os = require("os");
const ngrok = require("ngrok");
const lojasRouter = require("./routes/lojas");

const app = express();

// Configuração do CORS mais permissiva
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// Configuração do body-parser
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// Middleware de logging
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`\n=== Nova Requisição (${new Date().toISOString()}) ===`);
  console.log(`${req.method} ${req.url}`);
  console.log("IP:", req.ip);
  console.log("Headers:", req.headers);

  // Intercepta a finalização da resposta
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`\n=== Resposta Enviada (${duration}ms) ===`);
    console.log(`Status: ${res.statusCode}`);
    console.log("=================================\n");
  });

  next();
});

// Rota de teste
app.get("/", (req, res) => {
  res.json({
    message: "API do CoolFinder está funcionando!",
    timestamp: new Date(),
    serverInfo: {
      ips: getLocalIPs(),
      port: process.env.PORT || 3000,
      environment: process.env.NODE_ENV || "development",
    },
  });
});

// Rotas da API
app.use("/lojas", lojasRouter);

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error("\n=== Erro na Aplicação ===");
  console.error("Mensagem:", err.message);
  console.error("Stack:", err.stack);
  res.status(500).json({
    error: "Erro interno do servidor",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Função para obter IPs locais
const getLocalIPs = () => {
  const interfaces = os.networkInterfaces();
  return Object.values(interfaces)
    .flat()
    .filter((iface) => !iface.internal && iface.family === "IPv4")
    .map((iface) => iface.address);
};

// Função para iniciar o ngrok
const startNgrok = async (port) => {
  try {
    const url = await ngrok.connect(port);
    console.log("\n=== Túnel ngrok criado ===");
    console.log(`URL pública: ${url}`);
    console.log("===========================\n");
    return url;
  } catch (error) {
    console.error("Erro ao iniciar ngrok:", error);
    return null;
  }
};

// Inicialização do servidor
const port = process.env.PORT || 3000;
const host = "0.0.0.0";

// Conecta ao MongoDB
console.log("\n=== Conectando ao MongoDB ===");
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Timeout de 5 segundos
  })
  .then(async () => {
    console.log("✅ MongoDB conectado com sucesso\n");

    // Inicia o servidor
    app.listen(port, host, async () => {
      const ips = getLocalIPs();
      console.log("\n=== Servidor CoolFinder ===");
      console.log("Status: Rodando ✅");
      console.log(`Porta: ${port}`);
      console.log("IPs disponíveis:");
      ips.forEach((ip) => console.log(`- http://${ip}:${port}`));
      console.log(`Ambiente: ${process.env.NODE_ENV || "development"}`);
      console.log("=======================\n");

      // Inicia o túnel ngrok após o servidor estar rodando
      const ngrokUrl = await startNgrok(port);
      if (ngrokUrl) {
        console.log(
          "\n🔥 Use este URL no frontend para acessar o servidor de qualquer lugar:"
        );
        console.log(ngrokUrl);
      }
    });
  })
  .catch((error) => {
    console.error("❌ Erro ao conectar ao MongoDB:", error);
    process.exit(1);
  });
