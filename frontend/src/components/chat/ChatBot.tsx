import { useState } from "react";
import { Bot, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ChatBot() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<string[]>([
    "👋 Hi there! I'm here to hype you up and throw in some fun tasks 🕺",
  ]);

  const handleSend = () => {
    if (!message.trim()) return;

    setChat((prev) => [...prev, `🧑‍💻 You: ${message}`]);

    // TODO: Replace with actual API call to OpenAI or your backend
    const mockResponse =
      message.toLowerCase().includes("motivate")
        ? "🔥 You’re doing amazing. Like, Olympic-level amazing."
        : "💡 Added: 'Dance like no one's watching at 3pm' to your calendar.";

    setTimeout(() => {
      setChat((prev) => [...prev, `🤖 RhythmBot: ${mockResponse}`]);
    }, 800);

    setMessage("");
  };

  return (
    <div className="fixed bottom-4 right-4 w-full max-w-sm p-4 bg-background shadow-lg rounded-xl border border-muted space-y-3 z-50">
      <div className="flex items-center gap-2 font-semibold text-foreground">
        <Bot className="h-5 w-5 text-primary" />
        RhythmBot
      </div>

      <div className="space-y-1 max-h-40 overflow-y-auto text-sm text-muted-foreground">
        {chat.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Input
          placeholder="Ask for hype or a fun task..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <Button onClick={handleSend} size="icon" variant="secondary">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
