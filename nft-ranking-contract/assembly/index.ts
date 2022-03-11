// contract/assembly/index.ts
import { Card, Vote } from "./model";
import { HistoryEvent, User, Winner } from "./model-history";

// export the create method. This acts like an endpoint
// that we'll be able to call from our web app.
export function create(id: string, imgSrc: string): Card {
  // use the Todo class to persist the todo data
  return Card.insert(id, imgSrc);
}


export function getTwoCards(): Vote {
  return Card.getTwoCards();
}

export function vote(a: u32, b: u32, decision: i8): bool {
  return Card.vote(a, b, decision);
}

export function getAll(): Card[] {
  return Card.getAll()
}

export function getLength(): u32 {
  return Card.getLength()
}

export function getWinnerCard(): Card {
  return User.getWinnerCard()
}

export function getWinners(): Winner[] {
  return User.getWinners()
}

export function clearMeta(): bool {
  return User.clearMeta()
}

export function getUsers(): User[] {
  return User.getAll()
}

export function getFullHistory(): Winner[] {
  return User.getFullHistory()
}

export function clearAll(): bool {
  return Card.clearAll()
}