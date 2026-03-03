import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertStudySession } from "@shared/schema";
import { authenticatedFetch, getResponseErrorMessage } from "@/lib/fetch";

export function useStudySessions(date?: string) {
  return useQuery({
    queryKey: [api.studySessions.list.path, date],
    queryFn: async () => {
      const url = new URL(api.studySessions.list.path, window.location.origin);
      if (date) url.searchParams.append("date", date);
      
      const res = await authenticatedFetch(url.toString());
      if (!res.ok) throw new Error(await getResponseErrorMessage(res, "Failed to fetch study sessions"));
      return api.studySessions.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateStudySession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertStudySession) => {
      const res = await authenticatedFetch(api.studySessions.create.path, {
        method: api.studySessions.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(await getResponseErrorMessage(res, "Failed to create study session"));
      return api.studySessions.create.responses[201].parse(await res.json());
    },
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: [api.studySessions.list.path] });
      const previousSessions = queryClient.getQueryData([api.studySessions.list.path]);
      const optimisticSession = { id: -1, userId: "", ...data };
      Object.keys(previousSessions || {}).forEach(key => {
        queryClient.setQueryData([api.studySessions.list.path, key], (old: any[] = []) => [...old, optimisticSession]);
      });
      return { previousSessions };
    },
    onSuccess: (newSession) => {
      Object.keys((queryClient.getQueryData([api.studySessions.list.path]) || {})).forEach(key => {
        queryClient.setQueryData([api.studySessions.list.path, key], (old: any[] = []) =>
          old.map(s => s.id === -1 ? newSession : s)
        );
      });
    },
    onError: (_err, _data, context) => {
      if (context?.previousSessions) {
        queryClient.setQueryData([api.studySessions.list.path], context.previousSessions);
      }
    },
  });
}

export function useDeleteStudySession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.studySessions.delete.path, { id });
      const res = await authenticatedFetch(url, { method: api.studySessions.delete.method });
      if (!res.ok) throw new Error(await getResponseErrorMessage(res, "Failed to delete study session"));
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: [api.studySessions.list.path] });
      const previousSessions = queryClient.getQueryData([api.studySessions.list.path]);
      Object.keys(previousSessions || {}).forEach(key => {
        queryClient.setQueryData([api.studySessions.list.path, key], (old: any[] = []) =>
          old.filter(s => s.id !== id)
        );
      });
      return { previousSessions };
    },
    onError: (_err, _id, context) => {
      if (context?.previousSessions) {
        queryClient.setQueryData([api.studySessions.list.path], context.previousSessions);
      }
    },
  });
}
