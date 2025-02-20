import { type Subscriber, type InsertSubscriber } from "@shared/schema";

export interface IStorage {
  createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;
  getSubscriberByEmail(email: string): Promise<Subscriber | undefined>;
}

export class MemStorage implements IStorage {
  private subscribers: Map<number, Subscriber>;
  private currentId: number;

  constructor() {
    this.subscribers = new Map();
    this.currentId = 1;
  }

  async createSubscriber(insertSubscriber: InsertSubscriber): Promise<Subscriber> {
    const existing = await this.getSubscriberByEmail(insertSubscriber.email);
    if (existing) {
      throw new Error("Email already subscribed");
    }

    const id = this.currentId++;
    const subscriber: Subscriber = { ...insertSubscriber, id };
    this.subscribers.set(id, subscriber);
    return subscriber;
  }

  async getSubscriberByEmail(email: string): Promise<Subscriber | undefined> {
    return Array.from(this.subscribers.values()).find(
      (sub) => sub.email === email
    );
  }
}

export const storage = new MemStorage();
