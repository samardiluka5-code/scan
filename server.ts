import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase payload limit because we are receiving base64 image strings
  app.use(express.json({ limit: "50mb" }));

  // API endpoints
  app.post("/api/analyze-foot", async (req, res) => {
    try {
      const { imageBase64 } = req.body;
      if (!imageBase64) {
        return res.status(400).json({ error: "Missing imageBase64" });
      }

      // Convert base64 data URL (data:image/jpeg;base64,...) to exact base64 payload
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            parts: [
              {
                text: `You are an expert podiatrist and aesthetic analyst. Analyze the provided image.
First, check if there is a clear, recognizable human foot in this image. 
If NOT, return exactly this JSON: {"hasFoot": false, "reason": "No clear human foot detected"}

If YES, provide a rigorous aesthetic and health analysis, scoring 0-100 for various metrics.
Return EXACTLY THIS JSON schema, and nothing else (no markdown wrappers like \`\`\`json):
{
  "hasFoot": true,
  "footScore": <overall score 0-100 integer>,
  "aestheticMetrics": {
    "shape": <0-100>,
    "toeType": "<Egyptian, Roman, Greek, Celtic, or Germanic>",
    "proportions": <0-100>,
    "arch": <0-100>,
    "symmetry": <0-100>,
    "lineClarity": <0-100>,
    "beautyIndex": <0-100>
  },
  "healthMetrics": {
    "pronation": <0-100>,
    "plantarArch": <0-100>,
    "halluxValgus": <0-100>,
    "sizeMm": <estimated length in mm, typically 220-300>
  }
}
Make sure all values fall within the bounds and be highly critical of the foot structure.`
              },
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: base64Data
                }
              }
            ]
          }
        ],
        config: {
          temperature: 0.2
        }
      });

      const responseText = response.text || "";
      const cleanedJSON = responseText.replace(/```json\n?|\n?```/g, "").trim();

      try {
        const data = JSON.parse(cleanedJSON);
        res.json(data);
      } catch (parseError) {
        console.error("Failed to parse Gemini response:", responseText);
        res.status(500).json({ error: "Invalid AI response formatting" });
      }
    } catch (error) {
      console.error("AI Analysis failed:", error);
      res.status(500).json({ error: "Failed to analyze image" });
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
    // Production serving
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // Use * for express v4, *all for v5. Express 4 is in package.json
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
