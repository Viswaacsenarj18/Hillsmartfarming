import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";
import tractorRoutes from "./routes/tractorRoutes.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

/* ================= CORS ================= */
// Production-ready CORS configuration
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://hillsmartfarming.vercel.app",
  "https://viswaacproject-elcmaxilw-viswaacsenars-projects.vercel.app"
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Allow requests from allowed origins or if no origin (server-to-server)
  if (!origin || allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin || "*");
  }
  
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

app.use(express.json());

/* ================= MongoDB ================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

/* ================= Routes ================= */

app.use("/api/tractors", tractorRoutes);
app.use("/api/auth", authRoutes);

/* ================= 🤖 AI ROUTE ================= */

app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    console.log("💬 Chat request received:", { userMessage });

    if (!userMessage) {
      console.log("❌ Chat: Missing message");
      return res.status(400).json({ reply: "Message is required" });
    }

    // Check if API key is set
    if (!process.env.OPENROUTER_API_KEY) {
      console.error("❌ Chat: OPENROUTER_API_KEY not set in environment");
      return res.status(500).json({ reply: "❌ AI service not configured. Please check backend configuration." });
    }

    console.log("🔄 Chat: Calling OpenRouter API...");
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3-8b-instruct",
        messages: [
          {
            role: "system",
            content: `
You are a Smart Agriculture AI assistant.
If Tamil → reply Tamil.
If English → reply English.
Give structured farming advice.
            `,
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply =
      response.data.choices?.[0]?.message?.content || "No response";

    console.log("✅ Chat: Response generated successfully");
    res.json({ reply });

  } catch (error: any) {
    console.error("❌ Chat Error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    
    // Provide more specific error messages
    let reply = "⚠️ AI Service Error";
    if (error.response?.status === 401) {
      reply = "❌ API key invalid. Check backend configuration.";
    } else if (error.response?.status === 429) {
      reply = "❌ Rate limited. Please wait and try again.";
    } else if (error.message?.includes("timeout")) {
      reply = "❌ Request timeout. Please try again.";
    }
    
    res.status(500).json({ reply });
  }
});

/* ================= Test Route ================= */

app.get("/", (req, res) => {
  res.json({ message: "🌾 HillSmart Backend Running" });
});

/* ================= Server Start ================= */

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});

app.listen(PORT, HOST, () => {
  console.log(`✅ Server running on ${HOST}:${PORT}`);
  console.log(`✅ Backend URL: https://hillsmartfarming.onrender.com`);
  console.log(`✅ MongoDB Status: ${mongoose.connection.readyState === 1 ? 'Connected ✅' : 'Connecting... ⏳'}`);
});
