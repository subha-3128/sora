import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { format } from "date-fns";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // --- Tasks ---
  app.get(api.tasks.list.path, async (req, res) => {
    const date = req.query.date as string | undefined;
    const tasks = await storage.getTasks(date);
    res.json(tasks);
  });

  app.post(api.tasks.create.path, async (req, res) => {
    try {
      const input = api.tasks.create.input.parse(req.body);
      const task = await storage.createTask(input);
      res.status(201).json(task);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      throw err;
    }
  });

  app.put(api.tasks.update.path, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
      const input = api.tasks.update.input.parse(req.body);
      const task = await storage.updateTask(id, input);
      res.json(task);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      throw err;
    }
  });

  app.delete(api.tasks.delete.path, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    await storage.deleteTask(id);
    res.status(204).end();
  });

  // --- Habits ---
  app.get(api.habits.list.path, async (req, res) => {
    const habits = await storage.getHabits();
    res.json(habits);
  });

  app.post(api.habits.create.path, async (req, res) => {
    try {
      const input = api.habits.create.input.parse(req.body);
      const habit = await storage.createHabit(input);
      res.status(201).json(habit);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      throw err;
    }
  });

  app.delete(api.habits.delete.path, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    await storage.deleteHabit(id);
    res.status(204).end();
  });

  // --- Habit Logs ---
  app.get(api.habitLogs.list.path, async (req, res) => {
    const date = req.query.date as string | undefined;
    const logs = await storage.getHabitLogs(date);
    res.json(logs);
  });

  app.post(api.habitLogs.upsert.path, async (req, res) => {
    try {
      const input = api.habitLogs.upsert.input.parse(req.body);
      const log = await storage.upsertHabitLog(input);
      res.json(log);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      throw err;
    }
  });

  // --- Study Sessions ---
  app.get(api.studySessions.list.path, async (req, res) => {
    const date = req.query.date as string | undefined;
    const sessions = await storage.getStudySessions(date);
    res.json(sessions);
  });

  app.post(api.studySessions.create.path, async (req, res) => {
    try {
      const input = api.studySessions.create.input.parse(req.body);
      const session = await storage.createStudySession(input);
      res.status(201).json(session);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      throw err;
    }
  });

  app.delete(api.studySessions.delete.path, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    await storage.deleteStudySession(id);
    res.status(204).end();
  });

  // --- Daily Reflections ---
  app.get(api.dailyReflections.get.path, async (req, res) => {
    const date = req.params.date;
    const reflection = await storage.getDailyReflection(date);
    res.json(reflection || null);
  });

  app.post(api.dailyReflections.upsert.path, async (req, res) => {
    try {
      const input = api.dailyReflections.upsert.input.parse(req.body);
      const reflection = await storage.upsertDailyReflection(input);
      res.json(reflection);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      throw err;
    }
  });

  // --- Weekly Reviews ---
  app.get(api.weeklyReviews.list.path, async (req, res) => {
    const reviews = await storage.getWeeklyReviews();
    res.json(reviews);
  });

  app.get(api.weeklyReviews.get.path, async (req, res) => {
    const date = req.params.date;
    const review = await storage.getWeeklyReview(date);
    res.json(review || null);
  });

  app.post(api.weeklyReviews.upsert.path, async (req, res) => {
    try {
      const input = api.weeklyReviews.upsert.input.parse(req.body);
      const review = await storage.upsertWeeklyReview(input);
      res.json(review);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      throw err;
    }
  });

  // --- Monthly Reviews ---
  app.get(api.monthlyReviews.list.path, async (req, res) => {
    const reviews = await storage.getMonthlyReviews();
    res.json(reviews);
  });

  app.get(api.monthlyReviews.get.path, async (req, res) => {
    const month = req.params.month;
    const review = await storage.getMonthlyReview(month);
    res.json(review || null);
  });

  app.post(api.monthlyReviews.upsert.path, async (req, res) => {
    try {
      const input = api.monthlyReviews.upsert.input.parse(req.body);
      const review = await storage.upsertMonthlyReview(input);
      res.json(review);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      throw err;
    }
  });

  // --- Seed Database ---
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const habits = await storage.getHabits();
  if (habits.length === 0) {
    const h1 = await storage.createHabit({ name: "Drink Water" });
    const h2 = await storage.createHabit({ name: "Read 30 mins" });
    const h3 = await storage.createHabit({ name: "Exercise" });

    const today = format(new Date(), 'yyyy-MM-dd');
    
    await storage.createTask({
      title: "Finish project proposal",
      completed: false,
      isPriority: true,
      date: today
    });
    
    await storage.createTask({
      title: "Review pull requests",
      completed: true,
      isPriority: true,
      date: today
    });

    await storage.createTask({
      title: "Reply to emails",
      completed: false,
      isPriority: false,
      date: today
    });

    await storage.upsertHabitLog({ habitId: h1.id, date: today, completed: true });
    await storage.upsertHabitLog({ habitId: h2.id, date: today, completed: false });

    await storage.createStudySession({
      subject: "Math",
      topic: "Calculus Integrals",
      durationMinutes: 60,
      date: today
    });
    await storage.createStudySession({
      subject: "Computer Science",
      topic: "Data Structures",
      durationMinutes: 45,
      date: today
    });

    await storage.upsertDailyReflection({
      date: today,
      content: "A fairly productive day. Got stuck on some code but managed to figure it out later."
    });
  }
}
