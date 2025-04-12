import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";

export type Task = {
  id: string;
  title: string;
  description?: string;
  is_complete: boolean;
  due_date?: string;
  created_at: string;
};

const API_URL = import.meta.env.VITE_API_URL;

async function apiRequest(
  path: string,
  options: RequestInit = {}
): Promise<any> {
  const session = await supabase.auth.getSession();
  const token = session.data.session?.access_token;

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error(await res.text());
  return res.status === 204 ? null : await res.json();
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await apiRequest("/api/tasks");
        setTasks(data);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const createTask = async (task: {
    title: string;
    is_complete: boolean;
    description?: string;
    due_date?: string;
    user_id?: string;
  }) => {
    try {
      const data = await apiRequest("/api/tasks", {
        method: "POST",
        body: JSON.stringify(task),
      });
      setTasks((prev) => [data, ...prev]);
      return { data };
    } catch (error) {
      return { error };
    }
  };

  const updateTask = async (
    id: string,
    updates: {
      title?: string;
      is_complete?: boolean;
      description?: string;
      due_date?: string;
    }
  ) => {
    try {
      const data = await apiRequest(`/api/tasks/${id}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      });
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...data } : t))
      );
      return { data };
    } catch (error) {
      return { error };
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await apiRequest(`/api/tasks/${id}`, { method: "DELETE" });
      setTasks((prev) => prev.filter((t) => t.id !== id));
      return {};
    } catch (error) {
      return { error };
    }
  };

  return { tasks, loading, createTask, updateTask, deleteTask };
}
