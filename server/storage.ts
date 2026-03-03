import { db } from "./db";
import { eq, and } from "drizzle-orm";
import {
  type InsertTask, type UpdateTaskRequest, type Task,
  type InsertHabit, type Habit,
  type InsertHabitLog, type HabitLog,
  type InsertStudySession, type StudySession,
  type InsertDailyReflection, type DailyReflection,
  type InsertWeeklyReview, type WeeklyReview,
  type InsertMonthlyReview, type MonthlyReview,
  tasks, habits, habitLogs, studySessions,
  dailyReflections, weeklyReviews, monthlyReviews,
} from "@shared/schema";

export interface IStorage {
  // Tasks
  getTasks(userId: string, date?: string): Promise<Task[]>;
  createTask(userId: string, task: InsertTask): Promise<Task>;
  updateTask(userId: string, id: number, task: UpdateTaskRequest): Promise<Task>;
  deleteTask(userId: string, id: number): Promise<void>;

  // Habits
  getHabits(userId: string): Promise<Habit[]>;
  createHabit(userId: string, habit: InsertHabit): Promise<Habit>;
  deleteHabit(userId: string, id: number): Promise<void>;

  // Habit Logs
  getHabitLogs(userId: string, date?: string): Promise<HabitLog[]>;
  upsertHabitLog(userId: string, log: InsertHabitLog): Promise<HabitLog>;

  // Study Sessions
  getStudySessions(userId: string, date?: string): Promise<StudySession[]>;
  createStudySession(userId: string, session: InsertStudySession): Promise<StudySession>;
  deleteStudySession(userId: string, id: number): Promise<void>;

  // Daily Reflections
  getDailyReflection(userId: string, date: string): Promise<DailyReflection | undefined>;
  upsertDailyReflection(userId: string, reflection: InsertDailyReflection): Promise<DailyReflection>;

  // Weekly Reviews
  getWeeklyReviews(userId: string): Promise<WeeklyReview[]>;
  getWeeklyReview(userId: string, date: string): Promise<WeeklyReview | undefined>;
  upsertWeeklyReview(userId: string, review: InsertWeeklyReview): Promise<WeeklyReview>;

  // Monthly Reviews
  getMonthlyReviews(userId: string): Promise<MonthlyReview[]>;
  getMonthlyReview(userId: string, month: string): Promise<MonthlyReview | undefined>;
  upsertMonthlyReview(userId: string, review: InsertMonthlyReview): Promise<MonthlyReview>;
}

export class SupabaseStorage implements IStorage {
  // Tasks
  async getTasks(userId: string, date?: string): Promise<Task[]> {
    const conditions = [eq(tasks.userId, userId)];
    if (date) conditions.push(eq(tasks.date, date));
    return db.select().from(tasks).where(and(...conditions));
  }

  async createTask(userId: string, task: InsertTask): Promise<Task> {
    const [created] = await db.insert(tasks).values({ ...task, userId }).returning();
    return created;
  }

  async updateTask(userId: string, id: number, updates: UpdateTaskRequest): Promise<Task> {
    const [updated] = await db
      .update(tasks)
      .set(updates)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .returning();
    if (!updated) throw new Error("Task not found");
    return updated;
  }

  async deleteTask(userId: string, id: number): Promise<void> {
    await db.delete(tasks).where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
  }

  // Habits
  async getHabits(userId: string): Promise<Habit[]> {
    return db.select().from(habits).where(eq(habits.userId, userId));
  }

  async createHabit(userId: string, habit: InsertHabit): Promise<Habit> {
    const [created] = await db.insert(habits).values({ ...habit, userId }).returning();
    return created;
  }

  async deleteHabit(userId: string, id: number): Promise<void> {
    await db.delete(habits).where(and(eq(habits.id, id), eq(habits.userId, userId)));
  }

  // Habit Logs
  async getHabitLogs(userId: string, date?: string): Promise<HabitLog[]> {
    const conditions = [eq(habitLogs.userId, userId)];
    if (date) conditions.push(eq(habitLogs.date, date));
    return db.select().from(habitLogs).where(and(...conditions));
  }

  async upsertHabitLog(userId: string, log: InsertHabitLog): Promise<HabitLog> {
    // Check existing
    const existing = await db
      .select()
      .from(habitLogs)
      .where(
        and(
          eq(habitLogs.userId, userId),
          eq(habitLogs.habitId, log.habitId),
          eq(habitLogs.date, log.date)
        )
      );

    if (existing.length > 0) {
      const [updated] = await db
        .update(habitLogs)
        .set({ completed: log.completed })
        .where(eq(habitLogs.id, existing[0].id))
        .returning();
      return updated;
    }

    const [created] = await db.insert(habitLogs).values({ ...log, userId }).returning();
    return created;
  }

  // Study Sessions
  async getStudySessions(userId: string, date?: string): Promise<StudySession[]> {
    const conditions = [eq(studySessions.userId, userId)];
    if (date) conditions.push(eq(studySessions.date, date));
    return db.select().from(studySessions).where(and(...conditions));
  }

  async createStudySession(userId: string, session: InsertStudySession): Promise<StudySession> {
    const [created] = await db.insert(studySessions).values({ ...session, userId }).returning();
    return created;
  }

  async deleteStudySession(userId: string, id: number): Promise<void> {
    await db.delete(studySessions).where(and(eq(studySessions.id, id), eq(studySessions.userId, userId)));
  }

  // Daily Reflections
  async getDailyReflection(userId: string, date: string): Promise<DailyReflection | undefined> {
    const rows = await db
      .select()
      .from(dailyReflections)
      .where(and(eq(dailyReflections.userId, userId), eq(dailyReflections.date, date)));
    return rows[0];
  }

  async upsertDailyReflection(userId: string, reflection: InsertDailyReflection): Promise<DailyReflection> {
    const existing = await this.getDailyReflection(userId, reflection.date);
    if (existing) {
      const [updated] = await db
        .update(dailyReflections)
        .set({ content: reflection.content })
        .where(eq(dailyReflections.id, existing.id))
        .returning();
      return updated;
    }
    const [created] = await db.insert(dailyReflections).values({ ...reflection, userId }).returning();
    return created;
  }

  // Weekly Reviews
  async getWeeklyReviews(userId: string): Promise<WeeklyReview[]> {
    return db.select().from(weeklyReviews).where(eq(weeklyReviews.userId, userId));
  }

  async getWeeklyReview(userId: string, date: string): Promise<WeeklyReview | undefined> {
    const rows = await db
      .select()
      .from(weeklyReviews)
      .where(and(eq(weeklyReviews.userId, userId), eq(weeklyReviews.weekStartDate, date)));
    return rows[0];
  }

  async upsertWeeklyReview(userId: string, review: InsertWeeklyReview): Promise<WeeklyReview> {
    const existing = await this.getWeeklyReview(userId, review.weekStartDate);
    if (existing) {
      const [updated] = await db
        .update(weeklyReviews)
        .set(review)
        .where(eq(weeklyReviews.id, existing.id))
        .returning();
      return updated;
    }
    const [created] = await db.insert(weeklyReviews).values({ ...review, userId }).returning();
    return created;
  }

  // Monthly Reviews
  async getMonthlyReviews(userId: string): Promise<MonthlyReview[]> {
    return db.select().from(monthlyReviews).where(eq(monthlyReviews.userId, userId));
  }

  async getMonthlyReview(userId: string, month: string): Promise<MonthlyReview | undefined> {
    const rows = await db
      .select()
      .from(monthlyReviews)
      .where(and(eq(monthlyReviews.userId, userId), eq(monthlyReviews.month, month)));
    return rows[0];
  }

  async upsertMonthlyReview(userId: string, review: InsertMonthlyReview): Promise<MonthlyReview> {
    const existing = await this.getMonthlyReview(userId, review.month);
    if (existing) {
      const [updated] = await db
        .update(monthlyReviews)
        .set(review)
        .where(eq(monthlyReviews.id, existing.id))
        .returning();
      return updated;
    }
    const [created] = await db.insert(monthlyReviews).values({ ...review, userId }).returning();
    return created;
  }
}

export const storage: IStorage = new SupabaseStorage();
