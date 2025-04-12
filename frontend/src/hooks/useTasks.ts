import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";

export type Task = {
  id: string;
  title: string;
  description?: string;
  is_complete: boolean;
  created_at: string;
};

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading tasks:", error.message);
      } else {
        setTasks(data);
      }
      setLoading(false);
    };

    fetchTasks();
  }, []);

  const createTask = async (task: {
    title: string
    is_complete: boolean
    user_id: string
    description?: string
    due_date?: string
  }) => {
    const { title, is_complete, user_id, description, due_date } = task
  
    // Build insert object dynamically
    const insertData: Record<string, any> = {
      title,
      is_complete,
      user_id,
    }
  
    if (description?.trim()) {
      insertData.description = description
    }
  
    if (due_date?.trim()) {
      insertData.due_date = due_date
    }
  
    const { data, error } = await supabase
      .from("tasks")
      .insert(insertData)
      .select()
      .single()
  
    if (data) setTasks((prev) => [data, ...prev])
    return { data, error }
  }
  

  const updateTask = async (
    id: string,
    updates: {
      title?: string
      is_complete?: boolean
      description?: string
      due_date?: string
    }
  ) => {
    const updateData: Record<string, any> = {}
  
    if (updates.title?.trim()) updateData.title = updates.title
    if (typeof updates.is_complete === "boolean") updateData.is_complete = updates.is_complete
    if (updates.description?.trim()) updateData.description = updates.description
    if (updates.due_date?.trim()) updateData.due_date = updates.due_date
  
    const { data, error } = await supabase
      .from("tasks")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()
  
    if (data) {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...data } : t))
      )
    }
  
    return { data, error }
  }
  

  const deleteTask = async (id: string) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (!error) {
      setTasks((prev) => prev.filter((task) => task.id !== id)); // ⬅️ remove from list
    }

    return { error };
  };

  return { tasks, loading, createTask, updateTask, deleteTask };
}
