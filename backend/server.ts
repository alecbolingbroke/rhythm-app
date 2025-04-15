import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import tasksRoutes from "./routes/tasksRoutes";
import assistantRoutes from "./routes/assistantRoutes";
import { authMiddleware } from "./middleware/authMiddleware";

const app = express();

// Update CORS configuration to handle multiple origins
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://rhythm-frontend.web.app', 
  'http://localhost:5173',          
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json());


// Routes
app.use("/api/tasks", authMiddleware, tasksRoutes);

console.log("Loading assistant routes...");
app.use("/api/assistant", authMiddleware, assistantRoutes);

app.get("/", (req, res) => {
  res.send("Rhythm backend is running.");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
