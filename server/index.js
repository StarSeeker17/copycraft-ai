const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");
const { GoogleGenAI } = require("@google/genai");

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.post("/products", async (req, res) => {
  try {
    const { name, category, features, tone, description } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        category,
        features,
        tone,
        description,
      },
    });

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to create product" });
  }
});

app.get("/products", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const product = await prisma.product.findUnique({
      where: { id },
    });

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

app.put("/products/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, category, features, tone, description } = req.body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        category,
        features,
        tone,
        description,
      },
    });

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to update product" });
  }
});

app.delete("/products/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.product.delete({
      where: { id },
    });

    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

app.post("/generate", async (req, res) => {
  try {
    const { name, category, features, tone } = req.body;

    const prompt = `
Write a compelling ecommerce product description.

Product name: ${name}
Category: ${category}
Features: ${features}
Tone: ${tone}

Requirements:
- Keep it under 120 words
- Make it clear and engaging
- Focus on benefits, not only features
- Return only the final product description
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.json({ description: response.text });
  } catch (error) {
    console.error("Gemini generation error:", error);
    res.status(500).json({ error: "Failed to generate description" });
  }
});