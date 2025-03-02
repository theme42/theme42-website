import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  titleEn: text("title_en").notNull(),
  titleFr: text("title_fr").notNull(),
  descriptionEn: text("description_en").notNull(),
  descriptionFr: text("description_fr").notNull(),
  date: timestamp("date").notNull(),
  locationEn: text("location_en").notNull(),
  locationFr: text("location_fr").notNull(),
  capacity: integer("capacity").notNull(),
  registeredCount: integer("registered_count").default(0),
  imageUrl: text("image_url").notNull(),
  status: text("status").notNull().default("upcoming"), // upcoming, past
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  firebaseUid: text("firebase_uid").notNull().unique(),
});

export const registrations = pgTable("registrations", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull(),
  userId: integer("user_id").notNull(),
  status: text("status").notNull(), // confirmed, waitlist
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertEventSchema = createInsertSchema(events).omit({ id: true, registeredCount: true });
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertRegistrationSchema = createInsertSchema(registrations).omit({ id: true, createdAt: true });

export type Event = typeof events.$inferSelect;
export type User = typeof users.$inferSelect;
export type Registration = typeof registrations.$inferSelect;

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertRegistration = z.infer<typeof insertRegistrationSchema>;
