import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertSubscriberSchema } from "@shared/schema";

export async function registerRoutes(app: Express) {
  app.post("/api/subscribe", async (req, res) => {
    try {
      const parsed = insertSubscriberSchema.parse(req.body);
      const subscriber = await storage.createSubscriber(parsed);
      res.json(subscriber);
    } catch (error: any) {
      if (error.message === "Email already subscribed") {
        res.status(409).json({ message: error.message });
      } else if (error.errors) {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  return createServer(app);
}
