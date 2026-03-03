import { Express } from "express";
import { api } from "@shared/routes";
import { storage } from "../storage";
import { requireAuth } from "./auth";
import { z } from "zod";

export function registerStudySessionRoutes(app: Express) {
  // --- Study Sessions ---
  app.get(api.studySessions.list.path, requireAuth, async (req, res, next) => {
    try {
      const date = req.query.date as string | undefined;
      const sessions = await storage.getStudySessions(req.userId!, date);
      res.json(sessions);
    } catch (err) {
      next(err);
    }
  });

  app.post(api.studySessions.create.path, requireAuth, async (req, res, next) => {
    try {
      const input = api.studySessions.create.input.parse(req.body);
      const session = await storage.createStudySession(req.userId!, input);
      res.status(201).json(session);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      next(err);
    }
  });

  app.delete(api.studySessions.delete.path, requireAuth, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
      await storage.deleteStudySession(req.userId!, id);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  });
}
