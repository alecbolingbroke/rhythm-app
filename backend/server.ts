import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import tasksRoutes from "./routes/tasksRoutes";
import assistantRoutes from "./routes/assistantRoutes";
import { authMiddleware } from "./middleware/authMiddleware";
import { corsHeaders } from "./lib/cors";

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    callback(null, true); // Allow all origins
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: corsHeaders["Access-Control-Allow-Headers"].split(", "),
  credentials: true,
  optionsSuccessStatus: 200
}));

app.options("*", (req, res) => {
  res.set(corsHeaders).status(200).send();
});

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
