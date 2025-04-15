import express from "express";
import { handleAssistantPrompt } from "../controllers/assistantController";

const router = express.Router();

router.post("/", handleAssistantPrompt);

export default router;
