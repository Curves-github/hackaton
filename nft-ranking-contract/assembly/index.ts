// contract/assembly/index.ts
import { Card, Pair } from "./model";

// export the create method. This acts like an endpoint
// that we'll be able to call from our web app.
export function create(id: string, imgSrc: string): Card {
  // use the Todo class to persist the todo data
  return Card.insert(id, imgSrc);
}


export function getTwoCards(): Pair {
  return Card.getTwoCards();
}

export function vote(a: u32, b: u32, decision: i8, timestamp: u64): bool {
  return Card.vote(a, b, decision, timestamp);
}

// export function getAll(): Card[] {
//   return Card.getAll()
// }

// export function getLength(): u32 {
//   return Card.getLength()
// }

// export function clearAll(): bool {
//   return Card.clearAll()
// }