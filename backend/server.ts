import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import tasksRoutes from "./routes/tasksRoutes";
import { authMiddleware } from "./middleware/authMiddleware";

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/tasks", authMiddleware, tasksRoutes);

app.get("/", (req, res) => {
  res.send("Rhythm backend is running.");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
