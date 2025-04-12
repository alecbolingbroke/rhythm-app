import TaskItem from "@/components/tasks/TaskItem";
import { useTasks } from "@/hooks/useTasks";
import { toast } from "sonner";
import supabase from "@/lib/supabaseClient";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";

export default function TaskList({
  filter,
}: {
  filter: "pending" | "completed" | "all";
}) {
  const { tasks, loading, createTask, updateTask, deleteTask } = useTasks();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [newTaskText, setNewTaskText] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    if (filter === "pending") return !task.is_complete;
    if (filter === "completed") return task.is_complete;
  });

  const handleCreate = async () => {
    if (!newTaskText.trim()) return;

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      toast.error("Not logged in");
      return;
    }

    const { error } = await createTask({
      title: newTaskText,
      description,
      due_date: dueDate,
      is_complete: false,
      user_id: user.id,
    });

    if (error) {
      toast.error("Task creation failed", {
        description: (error as Error).message || "Unknown error",
      });
    } else {
      toast.success("Task created");
      setNewTaskText("");
      setDescription("");
      setDueDate("");
      inputRef.current?.focus();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await deleteTask(id);

    if (error) {
      toast.error("Delete failed", {
        description: (error as Error).message || "Unknown error",
      });
    } else {
      toast.success("Task deleted");
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <TaskItem
            key="new"
            title={newTaskText}
            setTitle={setNewTaskText}
            isComplete={false}
            description={description}
            dueDate={dueDate}
            setDescription={setDescription}
            setDueDate={setDueDate}
            onSave={async ({ title }) => {
              if (!title.trim()) return;

              const {
                data: { user },
                error: userError,
              } = await supabase.auth.getUser();

              if (userError || !user) {
                toast.error("Not logged in");
                return;
              }

              const { error } = await createTask({
                title,
                description,
                due_date: dueDate,
                is_complete: false,
                user_id: user.id,
              });

              if (error) {
                toast.error("Task creation failed", {
                  description: (error as Error).message || "Unknown error",
                });
              } else {
                toast.success("Task created");
                setNewTaskText("");
                setDescription("");
                setDueDate("");
              }
            }}
          />
        </div>
        <Button variant="ghost" size="icon" onClick={handleCreate}>
          <Plus size={20} />
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading tasks...</p>
      ) : filteredTasks.length === 0 ? (
        <p className="text-sm text-muted-foreground">No tasks to show.</p>
      ) : (
        filteredTasks.map((task) => (
          <TaskItem
            key={task.id}
            id={task.id}
            initialTitle={task.title}
            initialDescription={task.description}
            initialDueDate={task.due_date}
            isComplete={task.is_complete}
            onSave={({ title, description, due_date, is_complete }) =>
              updateTask(task.id, { title, description, due_date, is_complete })
            }
            onDelete={() => handleDelete(task.id)}
          />
        ))
      )}
    </div>
  );
}
