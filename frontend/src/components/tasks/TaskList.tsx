import TaskItem from "@/components/tasks/TaskItem";
import { useTasks } from "@/hooks/useTasks";
import { toast } from "sonner";
import supabase from "@/lib/supabaseClient";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";

export default function TaskList() {
  const { tasks, loading, createTask, updateTask, deleteTask } = useTasks();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [newTaskText, setNewTaskText] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

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
      toast.error("Task creation failed", { description: error.message });
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
      toast.error("Delete failed", { description: error.message });
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
                  description: error.message,
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
      ) : tasks.length === 0 ? (
        <p className="text-sm text-muted-foreground">No tasks yet.</p>
      ) : (
        tasks.map((task) => (
          <TaskItem
            key={task.id}
            id={task.id}
            initialTitle={task.title}
            isComplete={task.is_complete}
            onSave={({ title, is_complete }) =>
              updateTask(task.id, { title, is_complete })
            }
            onDelete={() => handleDelete(task.id)}
          />
        ))
      )}
    </div>
  );
}
