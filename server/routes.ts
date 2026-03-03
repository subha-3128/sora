import type { Express } from "express";
import { type Server } from "http";

import { registerAuthRoutes } from "./routes/auth";
import { registerTaskRoutes } from "./routes/tasks";
import { registerHabitRoutes } from "./routes/habits";
import { registerHabitLogRoutes } from "./routes/habitLogs";
import { registerStudySessionRoutes } from "./routes/studySessions";
import { registerDailyReflectionRoutes } from "./routes/dailyReflections";
import { registerWeeklyReviewRoutes } from "./routes/weeklyReviews";
import { registerMonthlyReviewRoutes } from "./routes/monthlyReviews";

import { seedDatabase } from "./seed";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Health check endpoint (for monitoring services like UptimeRobot)
  app.get("/api/health", (_req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Register auth routes first (before other routes)
  registerAuthRoutes(app);

  // delegate to feature-specific modules
  registerTaskRoutes(app);
  registerHabitRoutes(app);
  registerHabitLogRoutes(app);
  registerStudySessionRoutes(app);
  registerDailyReflectionRoutes(app);
  registerWeeklyReviewRoutes(app);
  registerMonthlyReviewRoutes(app);

  await seedDatabase();
  return httpServer;
}
