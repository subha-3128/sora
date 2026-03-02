import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertHabit, type InsertHabitLog } from "@shared/schema";

export function useHabits() {
  return useQuery({
    queryKey: [api.habits.list.path],
    queryFn: async () => {
      const res = await fetch(api.habits.list.path);
      if (!res.ok) throw new Error("Failed to fetch habits");
      return api.habits.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateHabit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertHabit) => {
      const res = await fetch(api.habits.create.path, {
        method: api.habits.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create habit");
      return api.habits.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.habits.list.path] }),
  });
}

export function useDeleteHabit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.habits.delete.path, { id });
      const res = await fetch(url, { method: api.habits.delete.method });
      if (!res.ok) throw new Error("Failed to delete habit");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.habits.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.habitLogs.list.path] });
    },
  });
}

export function useHabitLogs(date?: string) {
  return useQuery({
    queryKey: [api.habitLogs.list.path, date],
    queryFn: async () => {
      const url = new URL(api.habitLogs.list.path, window.location.origin);
      if (date) url.searchParams.append("date", date);
      
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("Failed to fetch habit logs");
      return api.habitLogs.list.responses[200].parse(await res.json());
    },
  });
}

export function useUpsertHabitLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertHabitLog) => {
      const res = await fetch(api.habitLogs.upsert.path, {
        method: api.habitLogs.upsert.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to upsert habit log");
      return api.habitLogs.upsert.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.habitLogs.list.path] }),
  });
}
