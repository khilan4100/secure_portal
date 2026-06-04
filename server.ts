import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Mock Loan Analytics for Dashboard
  app.get("/api/analytics/summary", (req, res) => {
    res.json({
      totalLent: 1250000,
      activeLoans: 45,
      pendingApplications: 12,
      averageInterest: 8.25,
      repaymentRate: 98.2
    });
  });

  // Gemini API helper for Loan Risk Assessment (just a demo endpoint)
  app.post("/api/assess-risk", async (req, res) => {
    const { amount, term, income, creditScore } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API key not configured" });
    }

    try {
      const genAI = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const prompt = `Assess mortgage/loan risk for:
        Amount: $${amount}
        Term: ${term} months
        Monthly Income: $${income}
        Credit Score: ${creditScore}
        Provide a short risk level (Low/Medium/High) and a one-sentence justification. Respond in JSON format like {"risk": "Low", "justification": "..."}`;

      const result = await genAI.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt
      });
      
      const text = result.text;
      // Basic JSON cleaning if necessary
      const jsonStr = text.replace(/```json|```/g, "").trim();
      res.json(JSON.parse(jsonStr));
    } catch (error) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: "Failed to assess risk" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
