const express = require("express");
const router = express.Router();
const Loja = require("../models/Loja");

// Middleware para log detalhado
const logRequest = (req, res, next) => {
  console.log(`\n=== ${req.method} ${req.baseUrl}${req.url} ===`);
  console.log("IP:", req.ip);
  console.log("Headers:", req.headers);
  if (req.body) {
    const logBody = { ...req.body };
    if (logBody.foto) {
      logBody.foto = "base64_image_data"; // Não logamos a imagem completa
    }
    console.log("Body:", logBody);
  }
  console.log("Query:", req.query);
  console.log("=================\n");
  next();
};

router.use(logRequest);

// GET /lojas - Retorna todas as lojas
router.get("/", async (req, res) => {
  console.log("\n=== GET /lojas ===");
  console.log("IP do cliente:", req.ip);
  console.log("Headers:", req.headers);

  try {
    const lojas = await Loja.find();
    console.log("Lojas encontradas:", lojas.length);

    // Se não encontrou nenhuma loja, retorna array vazio
    if (!lojas || lojas.length === 0) {
      console.log("Nenhuma loja encontrada");
      return res.json([]);
    }

    console.log("Enviando resposta com", lojas.length, "lojas");
    res.json(lojas);
  } catch (error) {
    console.error("Erro ao buscar lojas:", error);
    res.status(500).json({
      message: "Erro ao buscar lojas",
      error: error.message,
    });
  }
});

// POST /lojas - Cria uma nova loja
router.post("/", async (req, res) => {
  console.log("\n=== POST /lojas ===");
  console.log("IP do cliente:", req.ip);
  console.log("Headers:", req.headers);
  console.log("Dados recebidos:", {
    ...req.body,
    foto: req.body.foto ? "[BASE64]" : "sem foto",
  });

  try {
    const loja = new Loja({
      nome: req.body.nome,
      endereco: req.body.endereco,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      foto: req.body.foto,
    });

    const novaLoja = await loja.save();
    console.log("Loja criada com sucesso:", novaLoja._id);
    res.status(201).json(novaLoja);
  } catch (error) {
    console.error("Erro ao criar loja:", error);
    res.status(400).json({
      message: "Erro ao criar loja",
      error: error.message,
    });
  }
});

module.exports = router;
