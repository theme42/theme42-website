import { Event, InsertEvent, User, InsertUser, Registration, InsertRegistration } from "@shared/schema";

export interface IStorage {
  // Events
  getEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEventRegisteredCount(id: number, count: number): Promise<void>;
  
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByFirebaseId(firebaseUid: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Registrations
  getRegistration(eventId: number, userId: number): Promise<Registration | undefined>;
  getRegistrationsForEvent(eventId: number): Promise<Registration[]>;
  createRegistration(registration: InsertRegistration): Promise<Registration>;
}

export class MemStorage implements IStorage {
  private events: Map<number, Event>;
  private users: Map<number, User>;
  private registrations: Map<number, Registration>;
  private eventId: number = 1;
  private userId: number = 1;
  private registrationId: number = 1;

  constructor() {
    this.events = new Map();
    this.users = new Map();
    this.registrations = new Map();
    
    // Add some sample events
    this.createEvent({
      titleEn: "Introduction to GenAI",
      titleFr: "Introduction à GenAI",
      descriptionEn: "Learn about the fundamentals of Generative AI",
      descriptionFr: "Découvrez les fondamentaux de l'IA générative",
      date: new Date("2024-03-15"),
      locationEn: "Montreal Tech Hub",
      locationFr: "Centre Tech Montréal",
      capacity: 50,
      imageUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1",
      status: "upcoming"
    });
  }

  async getEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const id = this.eventId++;
    const newEvent: Event = { ...event, id, registeredCount: 0 };
    this.events.set(id, newEvent);
    return newEvent;
  }

  async updateEventRegisteredCount(id: number, count: number): Promise<void> {
    const event = this.events.get(id);
    if (event) {
      this.events.set(id, { ...event, registeredCount: count });
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByFirebaseId(firebaseUid: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.firebaseUid === firebaseUid);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userId++;
    const newUser: User = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }

  async getRegistration(eventId: number, userId: number): Promise<Registration | undefined> {
    return Array.from(this.registrations.values()).find(
      r => r.eventId === eventId && r.userId === userId
    );
  }

  async getRegistrationsForEvent(eventId: number): Promise<Registration[]> {
    return Array.from(this.registrations.values()).filter(r => r.eventId === eventId);
  }

  async createRegistration(registration: InsertRegistration): Promise<Registration> {
    const id = this.registrationId++;
    const newRegistration: Registration = { 
      ...registration, 
      id, 
      createdAt: new Date() 
    };
    this.registrations.set(id, newRegistration);
    return newRegistration;
  }
}

export const storage = new MemStorage();
