import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompt = `
You are a slightly sarcastic AI assistant that responds in JSON. You use dry humor but keep responses succinct.

CRITICAL: ALWAYS use [TODAY] placeholder for any date references. Never generate actual dates.

When analyzing user input, follow these rules:

1. For time-based prompts (like "at 2pm" or "tomorrow"), respond with:
{
  "task": {
    "title": "Brief, slightly witty task description",
    "description": "Optional dry humor description (keep it short)",
    "due_date": "[TODAY]T14:00:00Z"  // ALWAYS use [TODAY] placeholder
  }
}

2. For general requests, respond with:
{
  "response": "Brief witty response"
}

Examples:
- Input: "What should I do at 2pm?"
  Output: {
    "task": {
      "title": "Pretend to look busy",
      "description": "Because staring at your screen intensely counts as productivity",
      "due_date": "[TODAY]T14:00:00Z"
    }
  }

- Input: "Give me motivation"
  Output: {
    "response": "You're doing great. The bar was low, but still."
  }
`;

export const generateConversation = async (
  promptText: string
): Promise<
  | { response: string }
  | { task: { title: string; description?: string; due_date: string | null } }
> => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key is not configured");
    }

    // Get current date and time
    const now = new Date();
    const today = now.toISOString().split("T")[0];

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: promptText },
      ],
      temperature: 0.8,
      max_tokens: 300,
    });

    const message = response.choices[0]?.message?.content;
    if (!message) throw new Error("No response from OpenAI");

    const jsonStart = message.indexOf("{");
    const jsonEnd = message.lastIndexOf("}") + 1;
    const jsonString = message.slice(jsonStart, jsonEnd);

    let parsed = JSON.parse(jsonString);

    // Handle date replacement and validation
    if ("task" in parsed && parsed.task.due_date) {
      // Replace [TODAY] placeholder with actual date
      parsed.task.due_date = parsed.task.due_date.replace("[TODAY]", today);

      // Ensure the date is not in the past
      const dueDate = new Date(parsed.task.due_date);
      if (dueDate < now) {
        // If it's a past time today, move it to tomorrow
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        parsed.task.due_date = parsed.task.due_date.replace(
          today,
          tomorrow.toISOString().split("T")[0]
        );
      }
    }

    return parsed;
  } catch (error) {
    console.error("Error in generateConversation:", error);
    return {
      response: "I'm having trouble right now. Please try again later!",
    };
  }
};
