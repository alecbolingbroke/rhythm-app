import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatAssistantInput() {
  const [message, setMessage] = useState("");
  const [activePromptIndex, setActivePromptIndex] = useState(0);

  const promptSuggestions = useMemo(
    () => [
      "Give me a pep talk",
      "What should I do at 2pm?",
      "Add a task that makes me laugh",
      "I need fake motivation",
      "Make my to-do list ✨ aesthetic ✨",
      "Invent a new workplace ritual",
    ],
    []
  );

  // Cycle rolling prompts every few seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePromptIndex((prev) => (prev + 1) % promptSuggestions.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [promptSuggestions.length]);

  useEffect(() => {
    const handleGlobalSpace = (e: KeyboardEvent) => {
      if (
        e.key === " " &&
        document.activeElement?.tagName !== "INPUT" &&
        message.trim() === ""
      ) {
        e.preventDefault();
        const randomPrompt =
          promptSuggestions[
            Math.floor(Math.random() * promptSuggestions.length)
          ];
        setMessage(randomPrompt);
      }
    };

    window.addEventListener("keydown", handleGlobalSpace);
    return () => window.removeEventListener("keydown", handleGlobalSpace);
  }, [message, promptSuggestions]);

  // Inject random prompt on spacebar when input is empty
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " " && message.trim() === "") {
      e.preventDefault();
      const randomPrompt =
        promptSuggestions[Math.floor(Math.random() * promptSuggestions.length)];
      setMessage(randomPrompt);
    }
  };

  const handleSend = () => {
    if (!message.trim()) return;
    // send to backend or handle as needed
    setMessage("");
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-8rem)] max-w-2xl mx-auto w-full px-4 py-6">
      <div className="flex-1 flex items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-2"
        >
          <h1 className="text-3xl font-bold text-foreground flex items-center justify-center gap-2">
            <motion.span
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              🫀
            </motion.span>
            Welcome to PaceMaker
          </h1>
          <p className="text-muted-foreground text-sm">
            Feeling productive? Me neither. Ask for a pep talk or weirdly
            specific task to keep you going.
          </p>
        </motion.div>
      </div>

      <div className="text-xs text-muted-foreground mb-2 flex flex-wrap gap-2">
        {promptSuggestions.slice(0, 2).map((suggestion, i) => (
          <button
            key={i}
            className="px-2 py-1 rounded bg-muted hover:bg-muted/70 transition text-sm"
            onClick={() => setMessage(suggestion)}
            type="button"
          >
            {suggestion}
          </button>
        ))}
        <span className="text-muted-foreground text-sm flex items-center gap-1">
          or press
          <kbd className="px-1 py-0.5 rounded bg-muted text-xs font-medium text-muted-foreground border border-input">
            Space
          </kbd>
          if you're feeling lucky? (lazy).
        </span>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="relative flex items-center gap-2 border border-muted rounded-xl px-3 py-2 shadow-sm bg-background"
      >
        <div className="relative w-full">
          <AnimatePresence mode="wait">
            {message === "" && (
              <motion.span
                key={promptSuggestions[activePromptIndex]}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 0.5, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.3 }}
                className="absolute left-3 top-2.5 text-muted-foreground pointer-events-none text-sm"
              >
                {promptSuggestions[activePromptIndex]}
              </motion.span>
            )}
          </AnimatePresence>

          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full pl-3 bg-transparent placeholder-transparent focus:outline-none"
            placeholder=" "
            autoComplete="off"
          />
        </div>

        <Button type="submit" size="icon" variant="ghost" aria-label="Send">
          <Send className="w-5 h-5 text-muted-foreground" />
        </Button>
      </form>
    </div>
  );
}
