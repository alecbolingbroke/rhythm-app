import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompt = `
You are a slightly sarcastic AI assistant that responds in JSON. You use dry humor but keep responses succinct.

CRITICAL TIME HANDLING RULES:
1. ALWAYS use [TODAY] placeholder for dates
2. ALWAYS extract the exact time mentioned in the prompt
3. If no specific time is mentioned, use the time from the prompt or current time
4. Use 24-hour format (14:00:00 for 2 PM)
5. Common time patterns to detect:
   - "at 2pm" -> T14:00:00Z
   - "at 2:30pm" -> T14:30:00Z
   - "at 9am" -> T09:00:00Z
   - "morning" -> T09:00:00Z
   - "afternoon" -> T14:00:00Z
   - "evening" -> T18:00:00Z
   - "tonight" -> T20:00:00Z

When analyzing user input, follow these rules:

1. For time-based prompts, respond with:
{
  "task": {
    "title": "Brief, slightly witty task description",
    "description": "Optional dry humor description (keep it short)",
    "due_date": "[TODAY]T14:00:00Z"  // Use actual time from prompt
  }
}

Examples:
- Input: "What should I do at 2pm?"
  Output: {
    "task": {
      "title": "Pretend to look busy",
      "description": "Because staring at your screen intensely counts as productivity",
      "due_date": "[TODAY]T21:00:00Z"
    }
  }

- Input: "Remind me to call Bob at 9:30am"
  Output: {
    "task": {
      "title": "Call Bob",
      "description": "Time for another thrilling conversation about TPS reports",
      "due_date": "[TODAY]T09:30:00Z"
    }
  }

- Input: "Set a meeting for this afternoon"
  Output: {
    "task": {
      "title": "Another meeting that could be an email",
      "description": "Time to practice your thoughtful nodding",
      "due_date": "[TODAY]T14:00:00Z"
    }
  }

2. For general requests, respond with:
{
  "response": "Brief witty response"
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
    const today = now.toISOString().split('T')[0];

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: promptText },
      ],
      temperature: 0.6,
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
          tomorrow.toISOString().split('T')[0]
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
