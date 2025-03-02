import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRegistrationSchema, insertUserSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Events
  app.get("/api/events", async (req, res) => {
    const events = await storage.getEvents();
    res.json(events);
  });

  app.get("/api/events/:id", async (req, res) => {
    const event = await storage.getEvent(parseInt(req.params.id));
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  });

  // Users
  app.post("/api/users", async (req, res) => {
    const result = insertUserSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid user data" });
    }
    
    const user = await storage.createUser(result.data);
    res.json(user);
  });

  app.get("/api/users/firebase/:firebaseUid", async (req, res) => {
    const user = await storage.getUserByFirebaseId(req.params.firebaseUid);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  });

  // Registrations
  app.post("/api/registrations", async (req, res) => {
    const result = insertRegistrationSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid registration data" });
    }

    const event = await storage.getEvent(result.data.eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const user = await storage.getUser(result.data.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingRegistration = await storage.getRegistration(
      result.data.eventId,
      result.data.userId
    );
    if (existingRegistration) {
      return res.status(400).json({ message: "Already registered" });
    }

    const registrations = await storage.getRegistrationsForEvent(result.data.eventId);
    const status = registrations.length >= event.capacity ? "waitlist" : "confirmed";

    const registration = await storage.createRegistration({
      ...result.data,
      status
    });

    if (status === "confirmed") {
      await storage.updateEventRegisteredCount(event.id, event.registeredCount + 1);
    }

    res.json(registration);
  });

  const httpServer = createServer(app);
  return httpServer;
}
