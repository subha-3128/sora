import { Express } from "express";
import { api } from "@shared/routes";
import { storage } from "../storage";
import { requireAuth } from "./auth";
import { z } from "zod";

export function registerHabitRoutes(app: Express) {
  // --- Habits ---
  app.get(api.habits.list.path, requireAuth, async (req, res, next) => {
    try {
      const habits = await storage.getHabits(req.userId!);
      res.json(habits);
    } catch (err) {
      next(err);
    }
  });

  app.post(api.habits.create.path, requireAuth, async (req, res, next) => {
    try {
      const input = api.habits.create.input.parse(req.body);
      const habit = await storage.createHabit(req.userId!, input);
      res.status(201).json(habit);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      next(err);
    }
  });

  app.delete(api.habits.delete.path, requireAuth, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
      await storage.deleteHabit(req.userId!, id);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  });

}
