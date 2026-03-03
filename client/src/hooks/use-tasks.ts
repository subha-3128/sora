import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertTask, type UpdateTaskRequest, type Task } from "@shared/schema";
import { authenticatedFetch, getResponseErrorMessage } from "@/lib/fetch";

export function useTasks(date?: string) {
  return useQuery({
    queryKey: [api.tasks.list.path, date],
    queryFn: async () => {
      const url = new URL(api.tasks.list.path, window.location.origin);
      if (date) url.searchParams.append("date", date);
      
      const res = await authenticatedFetch(url.toString());
      if (!res.ok) throw new Error(await getResponseErrorMessage(res, "Failed to fetch tasks"));
      return api.tasks.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertTask) => {
      const res = await authenticatedFetch(api.tasks.create.path, {
        method: api.tasks.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(await getResponseErrorMessage(res, "Failed to create task"));
      return api.tasks.create.responses[201].parse(await res.json());
    },
    onMutate: async (data) => {
      // Cancel pending queries
      await queryClient.cancelQueries({ queryKey: [api.tasks.list.path] });
      
      // Get previous data
      const previousTasks = queryClient.getQueryData<Task[]>([api.tasks.list.path, data.date]);
      
      // Optimistically update with placeholder
      const optimisticTask: Task = {
        id: -1,
        userId: "",
        title: data.title,
        date: data.date,
        completed: data.completed ?? false,
        isPriority: data.isPriority ?? false,
      };
      
      queryClient.setQueryData([api.tasks.list.path, data.date], (old: Task[] | undefined) => [
        ...(old || []),
        optimisticTask,
      ]);
      
      return { previousTasks };
    },
    onSuccess: (newTask, data) => {
      // Update cache with real data
      queryClient.setQueryData([api.tasks.list.path, data.date], (old: Task[] | undefined) => {
        if (!old) return [newTask];
        return old.map(t => t.id === -1 ? newTask : t);
      });
    },
    onError: (_err, data, context) => {
      // Rollback on error
      if (context?.previousTasks) {
        queryClient.setQueryData([api.tasks.list.path, data.date], context.previousTasks);
      }
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & UpdateTaskRequest) => {
      const url = buildUrl(api.tasks.update.path, { id });
      const res = await authenticatedFetch(url, {
        method: api.tasks.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error(await getResponseErrorMessage(res, "Failed to update task"));
      return api.tasks.update.responses[200].parse(await res.json());
    },
    onMutate: async ({ id, ...updates }) => {
      // Cancel pending queries
      await queryClient.cancelQueries({ queryKey: [api.tasks.list.path] });
      
      // Capture previous state
      const previousTasks: Record<string, Task[] | undefined> = {};
      
      // Optimistically update across all date queries
      for (const [key] of queryClient.getQueriesData({ queryKey: [api.tasks.list.path] })) {
        const dateKey = Array.isArray(key) ? (key[1] as string) : undefined;
        if (dateKey) {
          previousTasks[dateKey] = queryClient.getQueryData([api.tasks.list.path, dateKey]);
          queryClient.setQueryData([api.tasks.list.path, dateKey], (old: Task[] | undefined) => {
            if (!old) return old;
            return old.map(t => t.id === id ? { ...t, ...(updates as Partial<Task>) } : t);
          });
        }
      }
      
      return { previousTasks };
    },
    onError: (_err, _data, context) => {
      if (context?.previousTasks) {
        Object.entries(context.previousTasks).forEach(([dateKey, tasks]) => {
          queryClient.setQueryData([api.tasks.list.path, dateKey], tasks);
        });
      }
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.tasks.delete.path, { id });
      const res = await authenticatedFetch(url, { method: api.tasks.delete.method });
      if (!res.ok) throw new Error(await getResponseErrorMessage(res, "Failed to delete task"));
    },
    onMutate: async (id) => {
      // Cancel pending queries
      await queryClient.cancelQueries({ queryKey: [api.tasks.list.path] });
      
      // Capture previous state
      const previousTasks: Record<string, Task[] | undefined> = {};
      
      // Optimistically remove task
      for (const [key] of queryClient.getQueriesData({ queryKey: [api.tasks.list.path] })) {
        const dateKey = Array.isArray(key) ? (key[1] as string) : undefined;
        if (dateKey) {
          previousTasks[dateKey] = queryClient.getQueryData([api.tasks.list.path, dateKey]);
          queryClient.setQueryData([api.tasks.list.path, dateKey], (old: Task[] | undefined) => {
            if (!old) return old;
            return old.filter(t => t.id !== id);
          });
        }
      }
      
      return { previousTasks };
    },
    onError: (_err, _id, context) => {
      if (context?.previousTasks) {
        Object.entries(context.previousTasks).forEach(([dateKey, tasks]) => {
          queryClient.setQueryData([api.tasks.list.path, dateKey], tasks);
        });
      }
    },
  });
}
