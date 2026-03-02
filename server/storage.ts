import { db } from "./db";
import {
  tasks, habits, habitLogs, studySessions, dailyReflections, weeklyReviews, monthlyReviews,
  type InsertTask, type UpdateTaskRequest, type Task,
  type InsertHabit, type Habit,
  type InsertHabitLog, type HabitLog,
  type InsertStudySession, type StudySession,
  type InsertDailyReflection, type DailyReflection,
  type InsertWeeklyReview, type WeeklyReview,
  type InsertMonthlyReview, type MonthlyReview
} from "@shared/schema";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // Tasks
  getTasks(date?: string): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: UpdateTaskRequest): Promise<Task>;
  deleteTask(id: number): Promise<void>;

  // Habits
  getHabits(): Promise<Habit[]>;
  createHabit(habit: InsertHabit): Promise<Habit>;
  deleteHabit(id: number): Promise<void>;

  // Habit Logs
  getHabitLogs(date?: string): Promise<HabitLog[]>;
  upsertHabitLog(log: InsertHabitLog): Promise<HabitLog>;

  // Study Sessions
  getStudySessions(date?: string): Promise<StudySession[]>;
  createStudySession(session: InsertStudySession): Promise<StudySession>;
  deleteStudySession(id: number): Promise<void>;

  // Daily Reflections
  getDailyReflection(date: string): Promise<DailyReflection | undefined>;
  upsertDailyReflection(reflection: InsertDailyReflection): Promise<DailyReflection>;

  // Weekly Reviews
  getWeeklyReviews(): Promise<WeeklyReview[]>;
  getWeeklyReview(date: string): Promise<WeeklyReview | undefined>;
  upsertWeeklyReview(review: InsertWeeklyReview): Promise<WeeklyReview>;

  // Monthly Reviews
  getMonthlyReviews(): Promise<MonthlyReview[]>;
  getMonthlyReview(month: string): Promise<MonthlyReview | undefined>;
  upsertMonthlyReview(review: InsertMonthlyReview): Promise<MonthlyReview>;
}

export class DatabaseStorage implements IStorage {
  // Tasks
  async getTasks(date?: string): Promise<Task[]> {
    if (date) {
      return await db.select().from(tasks).where(eq(tasks.date, date));
    }
    return await db.select().from(tasks);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const [task] = await db.insert(tasks).values(insertTask).returning();
    return task;
  }

  async updateTask(id: number, updates: UpdateTaskRequest): Promise<Task> {
    const [task] = await db.update(tasks).set(updates).where(eq(tasks.id, id)).returning();
    return task;
  }

  async deleteTask(id: number): Promise<void> {
    await db.delete(tasks).where(eq(tasks.id, id));
  }

  // Habits
  async getHabits(): Promise<Habit[]> {
    return await db.select().from(habits);
  }

  async createHabit(insertHabit: InsertHabit): Promise<Habit> {
    const [habit] = await db.insert(habits).values(insertHabit).returning();
    return habit;
  }

  async deleteHabit(id: number): Promise<void> {
    await db.delete(habits).where(eq(habits.id, id));
  }

  // Habit Logs
  async getHabitLogs(date?: string): Promise<HabitLog[]> {
    if (date) {
      return await db.select().from(habitLogs).where(eq(habitLogs.date, date));
    }
    return await db.select().from(habitLogs);
  }

  async upsertHabitLog(insertLog: InsertHabitLog): Promise<HabitLog> {
    // Check if it exists
    const [existing] = await db.select().from(habitLogs).where(
      and(
        eq(habitLogs.habitId, insertLog.habitId),
        eq(habitLogs.date, insertLog.date)
      )
    );

    if (existing) {
      const [updated] = await db.update(habitLogs)
        .set({ completed: insertLog.completed })
        .where(eq(habitLogs.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(habitLogs).values(insertLog).returning();
      return created;
    }
  }

  // Study Sessions
  async getStudySessions(date?: string): Promise<StudySession[]> {
    if (date) {
      return await db.select().from(studySessions).where(eq(studySessions.date, date));
    }
    return await db.select().from(studySessions);
  }

  async createStudySession(insertSession: InsertStudySession): Promise<StudySession> {
    const [session] = await db.insert(studySessions).values(insertSession).returning();
    return session;
  }

  async deleteStudySession(id: number): Promise<void> {
    await db.delete(studySessions).where(eq(studySessions.id, id));
  }

  // Daily Reflections
  async getDailyReflection(date: string): Promise<DailyReflection | undefined> {
    const [reflection] = await db.select().from(dailyReflections).where(eq(dailyReflections.date, date));
    return reflection;
  }

  async upsertDailyReflection(insertReflection: InsertDailyReflection): Promise<DailyReflection> {
    const [existing] = await db.select().from(dailyReflections).where(eq(dailyReflections.date, insertReflection.date));

    if (existing) {
      const [updated] = await db.update(dailyReflections)
        .set({ content: insertReflection.content })
        .where(eq(dailyReflections.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(dailyReflections).values(insertReflection).returning();
      return created;
    }
  }

  // Weekly Reviews
  async getWeeklyReviews(): Promise<WeeklyReview[]> {
    return await db.select().from(weeklyReviews);
  }

  async getWeeklyReview(date: string): Promise<WeeklyReview | undefined> {
    const [review] = await db.select().from(weeklyReviews).where(eq(weeklyReviews.weekStartDate, date));
    return review;
  }

  async upsertWeeklyReview(insertReview: InsertWeeklyReview): Promise<WeeklyReview> {
    const [existing] = await db.select().from(weeklyReviews).where(eq(weeklyReviews.weekStartDate, insertReview.weekStartDate));

    if (existing) {
      const [updated] = await db.update(weeklyReviews)
        .set(insertReview)
        .where(eq(weeklyReviews.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(weeklyReviews).values(insertReview).returning();
      return created;
    }
  }

  // Monthly Reviews
  async getMonthlyReviews(): Promise<MonthlyReview[]> {
    return await db.select().from(monthlyReviews);
  }

  async getMonthlyReview(month: string): Promise<MonthlyReview | undefined> {
    const [review] = await db.select().from(monthlyReviews).where(eq(monthlyReviews.month, month));
    return review;
  }

  async upsertMonthlyReview(insertReview: InsertMonthlyReview): Promise<MonthlyReview> {
    const [existing] = await db.select().from(monthlyReviews).where(eq(monthlyReviews.month, insertReview.month));

    if (existing) {
      const [updated] = await db.update(monthlyReviews)
        .set(insertReview)
        .where(eq(monthlyReviews.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(monthlyReviews).values(insertReview).returning();
      return created;
    }
  }
}

export const storage = new DatabaseStorage();
