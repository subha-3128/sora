import { Express } from "express";
import { api } from "@shared/routes";
import { storage } from "../storage";
import { requireAuth } from "./auth";
import { z } from "zod";

export function registerTaskRoutes(app: Express) {
  // --- Tasks ---
  app.get(api.tasks.list.path, requireAuth, async (req, res, next) => {
    try {
      const date = req.query.date as string | undefined;
      const tasks = await storage.getTasks(req.userId!, date);
      res.json(tasks);
    } catch (err) {
      next(err);
    }
  });

  app.post(api.tasks.create.path, requireAuth, async (req, res, next) => {
    try {
      const input = api.tasks.create.input.parse(req.body);
      const task = await storage.createTask(req.userId!, input);
      res.status(201).json(task);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      next(err);
    }
  });

  app.put(api.tasks.update.path, requireAuth, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
      const input = api.tasks.update.input.parse(req.body);
      const task = await storage.updateTask(req.userId!, id, input);
      res.json(task);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      next(err);
    }
  });

  app.delete(api.tasks.delete.path, requireAuth, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
      await storage.deleteTask(req.userId!, id);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  });
}
