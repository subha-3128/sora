import { Express } from "express";
import { api } from "@shared/routes";
import { storage } from "../storage";
import { requireAuth } from "./auth";
import { z } from "zod";

export function registerWeeklyReviewRoutes(app: Express) {
  // --- Weekly Reviews ---
  app.get(api.weeklyReviews.list.path, requireAuth, async (req, res, next) => {
    try {
      const reviews = await storage.getWeeklyReviews(req.userId!);
      res.json(reviews);
    } catch (err) {
      next(err);
    }
  });

  app.get(api.weeklyReviews.get.path, requireAuth, async (req, res, next) => {
    try {
      const date = req.params.date as string;
      const review = await storage.getWeeklyReview(req.userId!, date);
      res.json(review || null);
    } catch (err) {
      next(err);
    }
  });

  app.post(api.weeklyReviews.upsert.path, requireAuth, async (req, res, next) => {
    try {
      const input = api.weeklyReviews.upsert.input.parse(req.body);
      const review = await storage.upsertWeeklyReview(req.userId!, input);
      res.json(review);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      next(err);
    }
  });
}
