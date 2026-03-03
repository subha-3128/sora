import type { Express, Request, Response, NextFunction } from "express";
import { supabaseAdmin } from "../supabase";

// Extend Express Request to carry the authenticated user id
declare global {
  namespace Express {
    interface Request {
      userId?: string; // Supabase auth user UUID
    }
  }
}

/**
 * Middleware that verifies the Supabase JWT from the Authorization header.
 * Attaches `req.userId` on success.
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid Authorization header" });
  }

  const token = authHeader.slice(7);

  const { data, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !data.user) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  req.userId = data.user.id;
  next();
}

export function registerAuthRoutes(_app: Express) {
  // Auth is handled entirely on the client via the Supabase JS SDK.
  // No server-side auth endpoints needed.
  // The `requireAuth` middleware above validates JWTs on protected routes.
}

