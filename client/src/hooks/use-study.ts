import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertStudySession } from "@shared/schema";

export function useStudySessions(date?: string) {
  return useQuery({
    queryKey: [api.studySessions.list.path, date],
    queryFn: async () => {
      const url = new URL(api.studySessions.list.path, window.location.origin);
      if (date) url.searchParams.append("date", date);
      
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("Failed to fetch study sessions");
      return api.studySessions.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateStudySession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertStudySession) => {
      const res = await fetch(api.studySessions.create.path, {
        method: api.studySessions.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create study session");
      return api.studySessions.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.studySessions.list.path] }),
  });
}

export function useDeleteStudySession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.studySessions.delete.path, { id });
      const res = await fetch(url, { method: api.studySessions.delete.method });
      if (!res.ok) throw new Error("Failed to delete study session");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.studySessions.list.path] }),
  });
}
