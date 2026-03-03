import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertHabit, type InsertHabitLog } from "@shared/schema";
import { authenticatedFetch, getResponseErrorMessage } from "@/lib/fetch";

export function useHabits() {
  return useQuery({
    queryKey: [api.habits.list.path],
    queryFn: async () => {
      const res = await authenticatedFetch(api.habits.list.path);
      if (!res.ok) throw new Error(await getResponseErrorMessage(res, "Failed to fetch habits"));
      return api.habits.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateHabit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertHabit) => {
      const res = await authenticatedFetch(api.habits.create.path, {
        method: api.habits.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(await getResponseErrorMessage(res, "Failed to create habit"));
      return api.habits.create.responses[201].parse(await res.json());
    },
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: [api.habits.list.path] });
      const previousHabits = queryClient.getQueryData([api.habits.list.path]);
      const optimisticHabit = { id: -1, userId: "", ...data };
      queryClient.setQueryData([api.habits.list.path], (old: any[] = []) => [...old, optimisticHabit]);
      return { previousHabits };
    },
    onSuccess: (newHabit) => {
      queryClient.setQueryData([api.habits.list.path], (old: any[] = []) =>
        old.map(h => h.id === -1 ? newHabit : h)
      );
    },
    onError: (_err, _data, context) => {
      if (context?.previousHabits) {
        queryClient.setQueryData([api.habits.list.path], context.previousHabits);
      }
    },
  });
}

export function useDeleteHabit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.habits.delete.path, { id });
      const res = await authenticatedFetch(url, { method: api.habits.delete.method });
      if (!res.ok) throw new Error(await getResponseErrorMessage(res, "Failed to delete habit"));
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: [api.habits.list.path] });
      await queryClient.cancelQueries({ queryKey: [api.habitLogs.list.path] });
      const previousHabits = queryClient.getQueryData([api.habits.list.path]);
      const previousLogs = queryClient.getQueryData([api.habitLogs.list.path]);
      queryClient.setQueryData([api.habits.list.path], (old: any[] = []) =>
        old.filter(h => h.id !== id)
      );
      return { previousHabits, previousLogs };
    },
    onError: (_err, _id, context) => {
      if (context?.previousHabits) {
        queryClient.setQueryData([api.habits.list.path], context.previousHabits);
      }
      if (context?.previousLogs) {
        queryClient.setQueryData([api.habitLogs.list.path], context.previousLogs);
      }
    },
  });
}

export function useHabitLogs(date?: string) {
  return useQuery({
    queryKey: [api.habitLogs.list.path, date],
    queryFn: async () => {
      const url = new URL(api.habitLogs.list.path, window.location.origin);
      if (date) url.searchParams.append("date", date);
      
      const res = await authenticatedFetch(url.toString());
      if (!res.ok) throw new Error(await getResponseErrorMessage(res, "Failed to fetch habit logs"));
      return api.habitLogs.list.responses[200].parse(await res.json());
    },
  });
}

export function useUpsertHabitLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertHabitLog) => {
      const res = await authenticatedFetch(api.habitLogs.upsert.path, {
        method: api.habitLogs.upsert.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(await getResponseErrorMessage(res, "Failed to upsert habit log"));
      return api.habitLogs.upsert.responses[200].parse(await res.json());
    },
    onMutate: async (data) => {
      // Cancel pending queries for all habit logs
      await queryClient.cancelQueries({ queryKey: [api.habitLogs.list.path] });
      
      // Save previous state
      const previousLogs: Record<string, any[] | undefined> = {};
      
      // Update the specific date query
      const dateKey = data.date;
      previousLogs[dateKey] = queryClient.getQueryData([api.habitLogs.list.path, dateKey]);
      
      queryClient.setQueryData([api.habitLogs.list.path, dateKey], (old: any[] = []) => {
        const exists = old.find(log => log.habitId === data.habitId && log.date === data.date);
        if (exists) {
          return old.map(log => log.habitId === data.habitId && log.date === data.date ? { ...log, completed: data.completed } : log);
        }
        return [...old, { id: -1, habitId: data.habitId, date: data.date, completed: data.completed }];
      });
      
      return { previousLogs };
    },
    onSuccess: (newLog) => {
      // Update the specific date query with real data
      queryClient.setQueryData([api.habitLogs.list.path, newLog.date], (old: any[] = []) =>
        old.map(log => (log.habitId === newLog.habitId && log.date === newLog.date) ? newLog : log)
      );
    },
    onError: (_err, data, context) => {
      if (context?.previousLogs?.[data.date]) {
        queryClient.setQueryData([api.habitLogs.list.path, data.date], context.previousLogs[data.date]);
      }
    },
  });
}
