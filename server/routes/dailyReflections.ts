import { Express } from "express";
import { api } from "@shared/routes";
import { storage } from "../storage";
import { requireAuth } from "./auth";
import { z } from "zod";

export function registerDailyReflectionRoutes(app: Express) {
  // --- Daily Reflections ---
  app.get(api.dailyReflections.get.path, requireAuth, async (req, res, next) => {
    try {
      const date = req.params.date as string;
      const reflection = await storage.getDailyReflection(req.userId!, date);
      res.json(reflection || null);
    } catch (err) {
      next(err);
    }
  });

  app.post(api.dailyReflections.upsert.path, requireAuth, async (req, res, next) => {
    try {
      const input = api.dailyReflections.upsert.input.parse(req.body);
      const reflection = await storage.upsertDailyReflection(req.userId!, input);
      res.json(reflection);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      next(err);
    }
  });
}
