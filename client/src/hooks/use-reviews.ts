import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertDailyReflection, type InsertWeeklyReview, type InsertMonthlyReview } from "@shared/schema";
import { authenticatedFetch, getResponseErrorMessage } from "@/lib/fetch";

// Daily Reflections
export function useDailyReflection(date: string) {
  return useQuery({
    queryKey: [api.dailyReflections.get.path, date],
    queryFn: async () => {
      const url = buildUrl(api.dailyReflections.get.path, { date });
      const res = await authenticatedFetch(url);
      if (!res.ok) throw new Error(await getResponseErrorMessage(res, "Failed to fetch daily reflection"));
      return api.dailyReflections.get.responses[200].parse(await res.json());
    },
    enabled: !!date,
  });
}

export function useUpsertDailyReflection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertDailyReflection) => {
      const res = await authenticatedFetch(api.dailyReflections.upsert.path, {
        method: api.dailyReflections.upsert.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(await getResponseErrorMessage(res, "Failed to save reflection"));
      return api.dailyReflections.upsert.responses[200].parse(await res.json());
    },
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: [api.dailyReflections.get.path, data.date] });
      const previousReflection = queryClient.getQueryData([api.dailyReflections.get.path, data.date]);
      queryClient.setQueryData([api.dailyReflections.get.path, data.date], { id: -1, userId: "", ...data });
      return { previousReflection };
    },
    onSuccess: (newReflection, variables) => {
      queryClient.setQueryData([api.dailyReflections.get.path, variables.date], newReflection);
    },
    onError: (_err, variables, context) => {
      if (context?.previousReflection) {
        queryClient.setQueryData([api.dailyReflections.get.path, variables.date], context.previousReflection);
      }
    },
  });
}

// Weekly Reviews
export function useWeeklyReview(date: string) {
  return useQuery({
    queryKey: [api.weeklyReviews.get.path, date],
    queryFn: async () => {
      const url = buildUrl(api.weeklyReviews.get.path, { date });
      const res = await authenticatedFetch(url);
      if (!res.ok) throw new Error(await getResponseErrorMessage(res, "Failed to fetch weekly review"));
      return api.weeklyReviews.get.responses[200].parse(await res.json());
    },
    enabled: !!date,
  });
}

export function useUpsertWeeklyReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertWeeklyReview) => {
      const res = await authenticatedFetch(api.weeklyReviews.upsert.path, {
        method: api.weeklyReviews.upsert.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(await getResponseErrorMessage(res, "Failed to save weekly review"));
      return api.weeklyReviews.upsert.responses[200].parse(await res.json());
    },
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: [api.weeklyReviews.get.path, data.weekStartDate] });
      const previousReview = queryClient.getQueryData([api.weeklyReviews.get.path, data.weekStartDate]);
      queryClient.setQueryData([api.weeklyReviews.get.path, data.weekStartDate], { id: -1, userId: "", ...data });
      return { previousReview };
    },
    onSuccess: (newReview, variables) => {
      queryClient.setQueryData([api.weeklyReviews.get.path, variables.weekStartDate], newReview);
    },
    onError: (_err, variables, context) => {
      if (context?.previousReview) {
        queryClient.setQueryData([api.weeklyReviews.get.path, variables.weekStartDate], context.previousReview);
      }
    },
  });
}

// Monthly Reviews
export function useMonthlyReview(month: string) {
  return useQuery({
    queryKey: [api.monthlyReviews.get.path, month],
    queryFn: async () => {
      const url = buildUrl(api.monthlyReviews.get.path, { month });
      const res = await authenticatedFetch(url);
      if (!res.ok) throw new Error(await getResponseErrorMessage(res, "Failed to fetch monthly review"));
      return api.monthlyReviews.get.responses[200].parse(await res.json());
    },
    enabled: !!month,
  });
}

export function useUpsertMonthlyReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertMonthlyReview) => {
      const res = await authenticatedFetch(api.monthlyReviews.upsert.path, {
        method: api.monthlyReviews.upsert.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(await getResponseErrorMessage(res, "Failed to save monthly review"));
      return api.monthlyReviews.upsert.responses[200].parse(await res.json());
    },
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: [api.monthlyReviews.get.path, data.month] });
      const previousReview = queryClient.getQueryData([api.monthlyReviews.get.path, data.month]);
      queryClient.setQueryData([api.monthlyReviews.get.path, data.month], { id: -1, userId: "", ...data });
      return { previousReview };
    },
    onSuccess: (newReview, variables) => {
      queryClient.setQueryData([api.monthlyReviews.get.path, variables.month], newReview);
    },
    onError: (_err, variables, context) => {
      if (context?.previousReview) {
        queryClient.setQueryData([api.monthlyReviews.get.path, variables.month], context.previousReview);
      }
    },
  });
}
