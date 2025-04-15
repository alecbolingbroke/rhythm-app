import ChatAssistant from "@/components/chat/ChatAssistantInput";
import { motion } from "framer-motion";

export default function ChatPage() {

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8"
    >
      <ChatAssistant />
    </motion.div>
  );
}
