import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-background text-foreground">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <h1 className="text-6xl font-bold tracking-tight">404</h1>
        <p className="text-xl font-medium">Uh oh. This page is off pace 🫠</p>
        <p className="text-muted-foreground">
          Maybe you took a detour? Either way, let’s head back.
        </p>
        <Link
          to="/tasks"
          className="inline-block mt-4 px-4 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition"
        >
          Back to Tasks
        </Link>
      </motion.div>
    </div>
  );
}
