import { pgTable, text, serial, integer, boolean, date, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// NOTE: Authentication is handled by Supabase Auth (auth.users table).
// Each data table has a `userId` column referencing Supabase's auth user UUID.

// Tasks
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").notNull(),
  title: text("title").notNull(),
  completed: boolean("completed").default(false).notNull(),
  isPriority: boolean("is_priority").default(false).notNull(),
  date: date("date").notNull(), // YYYY-MM-DD format
});

export const insertTaskSchema = createInsertSchema(tasks).omit({ id: true, userId: true });
export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type UpdateTaskRequest = Partial<InsertTask>;

// Habits
export const habits = pgTable("habits", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").notNull(),
  name: text("name").notNull(),
});

export const insertHabitSchema = createInsertSchema(habits).omit({ id: true, userId: true });
export type Habit = typeof habits.$inferSelect;
export type InsertHabit = z.infer<typeof insertHabitSchema>;

// Habit Logs
export const habitLogs = pgTable("habit_logs", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").notNull(),
  habitId: integer("habit_id").notNull(),
  date: date("date").notNull(),
  completed: boolean("completed").default(false).notNull(),
});

export const insertHabitLogSchema = createInsertSchema(habitLogs).omit({ id: true, userId: true });
export type HabitLog = typeof habitLogs.$inferSelect;
export type InsertHabitLog = z.infer<typeof insertHabitLogSchema>;

// Study Sessions
export const studySessions = pgTable("study_sessions", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").notNull(),
  subject: text("subject").notNull(),
  topic: text("topic").notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  date: date("date").notNull(),
});

export const insertStudySessionSchema = createInsertSchema(studySessions).omit({ id: true, userId: true });
export type StudySession = typeof studySessions.$inferSelect;
export type InsertStudySession = z.infer<typeof insertStudySessionSchema>;

// Daily Reflections
export const dailyReflections = pgTable("daily_reflections", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").notNull(),
  date: date("date").notNull(),
  content: text("content").notNull(),
});

export const insertDailyReflectionSchema = createInsertSchema(dailyReflections).omit({ id: true, userId: true });
export type DailyReflection = typeof dailyReflections.$inferSelect;
export type InsertDailyReflection = z.infer<typeof insertDailyReflectionSchema>;

// Weekly Reviews
export const weeklyReviews = pgTable("weekly_reviews", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").notNull(),
  weekStartDate: date("week_start_date").notNull(), // YYYY-MM-DD of Monday
  totalStudyHours: integer("total_study_hours").notNull(),
  topicsCompleted: text("topics_completed").notNull(),
  weakSubjects: text("weak_subjects").notNull(),
  wins: text("wins").notNull(),
  improvements: text("improvements").notNull(),
  nextWeekPlan: text("next_week_plan").notNull(),
});

export const insertWeeklyReviewSchema = createInsertSchema(weeklyReviews).omit({ id: true, userId: true });
export type WeeklyReview = typeof weeklyReviews.$inferSelect;
export type InsertWeeklyReview = z.infer<typeof insertWeeklyReviewSchema>;

// Monthly Reviews
export const monthlyReviews = pgTable("monthly_reviews", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").notNull(),
  month: text("month").notNull(), // YYYY-MM
  totalStudyHours: integer("total_study_hours").notNull(),
  subjectSummary: text("subject_summary").notNull(),
  habitConsistency: integer("habit_consistency").notNull(), // Percentage
  insight: text("insight").notNull(),
  nextMonthFocus: text("next_month_focus").notNull(),
});

export const insertMonthlyReviewSchema = createInsertSchema(monthlyReviews).omit({ id: true, userId: true });
export type MonthlyReview = typeof monthlyReviews.$inferSelect;
export type InsertMonthlyReview = z.infer<typeof insertMonthlyReviewSchema>;