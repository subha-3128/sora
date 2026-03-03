import { Express } from "express";
import { api } from "@shared/routes";
import { storage } from "../storage";
import { requireAuth } from "./auth";
import { z } from "zod";

export function registerHabitLogRoutes(app: Express) {
  // --- Habit Logs ---
  app.get(api.habitLogs.list.path, requireAuth, async (req, res, next) => {
    try {
      const date = req.query.date as string | undefined;
      const logs = await storage.getHabitLogs(req.userId!, date);
      res.json(logs);
    } catch (err) {
      next(err);
    }
  });

  app.post(api.habitLogs.upsert.path, requireAuth, async (req, res, next) => {
    try {
      const input = api.habitLogs.upsert.input.parse(req.body);
      const log = await storage.upsertHabitLog(req.userId!, input);
      res.json(log);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      next(err);
    }
  });
}
