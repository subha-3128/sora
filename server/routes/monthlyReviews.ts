import { Express } from "express";
import { api } from "@shared/routes";
import { storage } from "../storage";
import { requireAuth } from "./auth";
import { z } from "zod";

export function registerMonthlyReviewRoutes(app: Express) {
  // --- Monthly Reviews ---
  app.get(api.monthlyReviews.list.path, requireAuth, async (req, res, next) => {
    try {
      const reviews = await storage.getMonthlyReviews(req.userId!);
      res.json(reviews);
    } catch (err) {
      next(err);
    }
  });

  app.get(api.monthlyReviews.get.path, requireAuth, async (req, res, next) => {
    try {
      const month = req.params.month as string;
      const review = await storage.getMonthlyReview(req.userId!, month);
      res.json(review || null);
    } catch (err) {
      next(err);
    }
  });

  app.post(api.monthlyReviews.upsert.path, requireAuth, async (req, res, next) => {
    try {
      const input = api.monthlyReviews.upsert.input.parse(req.body);
      const review = await storage.upsertMonthlyReview(req.userId!, input);
      res.json(review);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      next(err);
    }
  });
}
