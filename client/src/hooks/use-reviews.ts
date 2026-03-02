import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertDailyReflection, type InsertWeeklyReview, type InsertMonthlyReview } from "@shared/schema";

// Daily Reflections
export function useDailyReflection(date: string) {
  return useQuery({
    queryKey: [api.dailyReflections.get.path, date],
    queryFn: async () => {
      const url = buildUrl(api.dailyReflections.get.path, { date });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch daily reflection");
      return api.dailyReflections.get.responses[200].parse(await res.json());
    },
    enabled: !!date,
  });
}

export function useUpsertDailyReflection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertDailyReflection) => {
      const res = await fetch(api.dailyReflections.upsert.path, {
        method: api.dailyReflections.upsert.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save reflection");
      return api.dailyReflections.upsert.responses[200].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.dailyReflections.get.path, variables.date] });
    },
  });
}

// Weekly Reviews
export function useWeeklyReview(date: string) {
  return useQuery({
    queryKey: [api.weeklyReviews.get.path, date],
    queryFn: async () => {
      const url = buildUrl(api.weeklyReviews.get.path, { date });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch weekly review");
      return api.weeklyReviews.get.responses[200].parse(await res.json());
    },
    enabled: !!date,
  });
}

export function useUpsertWeeklyReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertWeeklyReview) => {
      const res = await fetch(api.weeklyReviews.upsert.path, {
        method: api.weeklyReviews.upsert.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save weekly review");
      return api.weeklyReviews.upsert.responses[200].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.weeklyReviews.get.path, variables.weekStartDate] });
    },
  });
}

// Monthly Reviews
export function useMonthlyReview(month: string) {
  return useQuery({
    queryKey: [api.monthlyReviews.get.path, month],
    queryFn: async () => {
      const url = buildUrl(api.monthlyReviews.get.path, { month });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch monthly review");
      return api.monthlyReviews.get.responses[200].parse(await res.json());
    },
    enabled: !!month,
  });
}

export function useUpsertMonthlyReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertMonthlyReview) => {
      const res = await fetch(api.monthlyReviews.upsert.path, {
        method: api.monthlyReviews.upsert.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save monthly review");
      return api.monthlyReviews.upsert.responses[200].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.monthlyReviews.get.path, variables.month] });
    },
  });
}
