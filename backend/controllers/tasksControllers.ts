import { Request, Response } from "express";
import { supabase } from "../lib/supabaseClient";
import { createSupabaseClientWithAuth } from "../lib/setAuth";

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  const user = (req as any).user;
  const accessToken = (req as any).accessToken;

  const supabase = createSupabaseClientWithAuth(accessToken);

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user.sub)
    .order("created_at", { ascending: false });

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(200).json(data);
};

export const createTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = (req as any).user;
  const accessToken = (req as any).accessToken;

  const supabase = createSupabaseClientWithAuth(accessToken);

  const { title, description } = req.body;

  if (!title) {
    res.status(400).json({ error: "Title is required" });
    return;
  }

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      title,
      description,
      user_id: user.sub,
    })
    .select()
    .single();

  console.log("Creating task for user ID:", user.sub);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(201).json(data);
};

export const updateTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = (req as any).user;
  const accessToken = (req as any).accessToken;

  const supabase = createSupabaseClientWithAuth(accessToken);

  const { id } = req.params;
  const { title, description, is_complete } = req.body;

  const { data, error } = await supabase
    .from("tasks")
    .update({ title, description, is_complete })
    .eq("id", id)
    .eq("user_id", user.sub)
    .select()
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
  } else {
    res.status(200).json(data);
  }
};

export const deleteTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = (req as any).user;
  const accessToken = (req as any).accessToken;

  const supabase = createSupabaseClientWithAuth(accessToken);

  const { id } = req.params;

  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", id)
    .eq("user_id", user.sub);

  if (error) {
    res.status(500).json({ error: error.message });
  } else {
    res.status(204).send();
  }
};
