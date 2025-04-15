import { Request, Response } from "express";
import { generateConversation } from "../utils/openAIPrompts";
import { createSupabaseClientWithAuth } from "../lib/setAuth";

export const handleAssistantPrompt = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = (req as any).user;
  const accessToken = (req as any).accessToken;
  const supabase = createSupabaseClientWithAuth(accessToken);

  const { prompt } = req.body;

  try {
    console.log("Received prompt:", prompt);
    const result = await generateConversation(prompt);
    console.log("OpenAI result:", result);

    if ("task" in result) {
      const { title, description, due_date } = result.task;
      const formattedDueDate = due_date === "" ? null : due_date;

      console.log("Attempting to insert task:", {
        title,
        description,
        due_date: formattedDueDate,
        user_id: user.sub,
      });

      const { data, error } = await supabase
        .from("tasks")
        .insert({
          title,
          description,
          due_date: formattedDueDate,
          user_id: user.sub,
        })
        .select()
        .single();

      if (error) {
        console.error("Supabase insert error:", error);
        res.status(500).json({ error: error.message });
        return;
      }

      console.log("Successfully inserted task:", data);
      res.status(200).json({ task: data });
      return;
    }

    if ("response" in result) {
      res.status(200).json({ message: result.response });
      return;
    }

    res.status(400).json({ error: "Unhandled format from OpenAI" });
  } catch (err) {
    console.error("Error in handleAssistantPrompt:", err);
    res.status(500).json({ error: "Failed to process assistant prompt" });
  }
};
