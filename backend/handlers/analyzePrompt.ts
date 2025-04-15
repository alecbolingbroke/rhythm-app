import { Request, Response } from "express";
import { generateConversation } from "../utils/openAIPrompts";

export const analyzePrompt = async (req: Request, res: Response): Promise<void> => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      res.status(400).json({ error: "Prompt is required." });
      return;
    }

    const result = await generateConversation(prompt);

    if ('task' in result) {
      res.status(200).json({ task: result.task });
    } else if ('response' in result) {
      res.status(200).json({ message: result.response });
    } else {
      res.status(400).json({ error: "Invalid response format" });
    }
  } catch (error) {
    console.error("Error analyzing prompt:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to process prompt.";
    res.status(500).json({ error: errorMessage });
  }
};