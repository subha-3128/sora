import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  // Use process.cwd() to resolve from the working directory
  // In production, this is the root where dist/ and dist/public/ exist
  const distPath = path.resolve(process.cwd(), "dist/public");
  
  if (!fs.existsSync(distPath)) {
    console.error(`Public directory not found at: ${distPath}`);
    console.error(`Current working directory: ${process.cwd()}`);
    console.error(`Available files:`, fs.readdirSync(process.cwd()).slice(0, 10));
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("/{*path}", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
