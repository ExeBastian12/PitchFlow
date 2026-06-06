import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { getMidtransClient } from "./server/midtrans";

let _ai: GoogleGenAI | null = null;
function getAI() {
  if (!_ai) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY") {
      throw new Error("GEMINI_API_KEY is not configured. Please add your Gemini API key in the settings.");
    }
    _ai = new GoogleGenAI({ apiKey: key });
  }
  return _ai;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Midtrans Payment Route
  app.post("/api/checkout", async (req, res) => {
     try {
         const { orderId, grossAmount, customerDetails } = req.body;
         const apiClient = getMidtransClient();
         
         const parameter = {
             "transaction_details": {
                 "order_id": orderId,
                 "gross_amount": grossAmount
             },
             "credit_card": {
                 "secure": true
             },
             "customer_details": {
                 "first_name": customerDetails.firstName,
                 "email": customerDetails.email
             }
         };
         
         const transaction = await apiClient.createTransaction(parameter);
         res.json({ token: transaction.token, redirect_url: transaction.redirect_url });
     } catch (e: any) {
         console.error("Midtrans Error:", e);
         res.status(500).json({ error: e.message || "Midtrans payment failed" });
     }
  });

  app.post("/api/assistant", async (req, res) => {
    try {
      const { query, role } = req.body;
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are PitchFlow AI Assistant. The user's role is ${role}. They asked: ${query}. Answer in exactly 2-3 short sentences. No markdown for links.`
      });
      res.json({ text: response.text });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message || "Something went wrong" });
    }
  });

  app.post("/api/auto-tag", async (req, res) => {
    try {
      const { description, existingTags } = req.body;
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Analyze this drill description: "${description}". Suggest 1 to 3 relevant tags from this existing list: [${existingTags.join(', ')}]. If none fit, suggest up to 2 short, new relevant tags. Return ONLY a JSON array of strings. No markdown, no json blocks.`,
        config: {
          responseMimeType: "application/json",
        }
      });
      res.json(JSON.parse(response.text || "[]"));
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message || "Failed to generate tags" });
    }
  });

  app.post("/api/generate-plan", async (req, res) => {
    try {
      const { objective, duration, focusArea } = req.body;
      const ai = getAI();
      const focusText = focusArea ? ` Primary focus area is: ${focusArea}.` : "";
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are PitchFlow AI Assistant. The user wants to auto-generate a soccer training plan. The objective is "${objective}" and the average total duration is ${duration} minutes.${focusText} Return a JSON array of drills. Each drill should have: id (unique standard string), title, durationMins (integer), duration (e.g. "15 mins"), category, difficulty (Beginner/Intermediate/Advanced), description, tags (array of strings). Return ONLY valid JSON, no markdown formatting.`,
        config: {
          responseMimeType: "application/json",
        }
      });
      res.json(JSON.parse(response.text || "[]"));
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message || "Failed to generate plan" });
    }
  });

  app.post("/api/suggest-lineup", async (req, res) => {
    try {
      const { roster } = req.body;
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are PitchFlow AI Assistant. Analyze this roster: ${JSON.stringify(roster)}. Based on player status (Available/Injured/Suspended), positions, and return dates, suggest a starting lineup of 11 players for an upcoming match, along with a brief explanation. Return ONLY a JSON object with two fields: 'lineup' (array of player names) and 'explanation' (string). No markdown.`,
        config: {
          responseMimeType: "application/json",
        }
      });
      res.json(JSON.parse(response.text || "{}"));
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message || "Failed to generate suggestions" });
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
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
