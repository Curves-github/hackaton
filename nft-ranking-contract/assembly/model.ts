// contract/assembly/model.ts
import { math, PersistentSet, datetime, PersistentUnorderedMap } from "near-sdk-as";

export const votes = new PersistentSet<u32>("votes")
export const cardIds = new PersistentSet<u32>("cardIds")
export const cards = new PersistentUnorderedMap<u32, Card>("cards");


@nearBindgen
export class Vote {
  cardA: Card
  cardB: Card
  timestamp: u64
  constructor(cardA: Card, cardB: Card, timestamp: u64) {
    this.cardA = cardA
    this.cardB = cardB
    this.timestamp = timestamp
  }
}

@nearBindgen
export class Card {
  id: u32
  rate: f32
  participations: u32
  imgSrc: string

  constructor(id: string, src: string) {
    this.id = math.hash32<string>(id);
    this.imgSrc = src
    this.rate = 100
    this.participations = 0
  }

  static insert(id: string, src: string): Card {

    const todo = new Card(id, src);
    if (cardIds.has(todo.id)) {
      throw new Error(`Card id ${id} already exists`)
    }
 
    cards.set(todo.id, todo);

    return todo;
  }

  static getAll(): Card[] {
    return cards.values()
  }

  static currentTimestamp(): u64 {
    return datetime.block_datetime().epochNanoseconds
  }

  static getVoteStamp(a: u32, b: u32, timestamp: u64): u32 {
    return math.hash32(a ^ b ^ timestamp)
  }

  static createVoteStamp(a: u32, b: u32): u64 {
    const timestamp = Card.currentTimestamp()
    votes.add(Card.getVoteStamp(a, b, timestamp))
    return timestamp
  }

  static checkVoteStamp(a: u32, b: u32, timestamp: u64): bool {
    const voteId = Card.getVoteStamp(a, b, timestamp)
    return votes.has(voteId)
  }

  static getTwoCards(): Vote {
    const allCards = cards.values()
    let indexA = 0
    let minParticipations = allCards[indexA].participations
    for (let i = 1; i < cards.length; i++) {
      if (allCards[i].participations < minParticipations) {
        minParticipations = allCards[i].participations
        indexA = i
      }
    }

    let indexB = 0
    let closestRate: f32 = 9999
    for (let i = 0; i < cards.length; i++) {
      if (i === indexA) continue
      if (Mathf.abs(allCards[i].rate - allCards[indexA].rate) < closestRate) {
        closestRate = Mathf.abs(allCards[i].rate - allCards[indexA].rate)
        indexB = i
      }
    }

    const time = Card.createVoteStamp(allCards[indexA].id, allCards[indexB].id)
    
    return new Vote(allCards[indexA], allCards[indexB], time)
  }

  static vote(a: u32, b: u32, decision: i8, timestamp: u64): bool {
    if (!Card.checkVoteStamp(a, b, timestamp)) {
      return false
    }

    const cardA = cards.getSome(decision < 0? b: a)
    const cardB = cards.getSome(decision < 0? a: b)

    const Ea: f32 = 1 / (1 + Mathf.pow(10, ( cardB.rate - cardA.rate ) / 400))
    const Eb: f32 = 1 / (1 + Mathf.pow(10, ( cardA.rate - cardB.rate ) / 400))

    const Sa: f32 = decision === 0? 0.5: 1
    const Sb: f32 = decision === 0? 0.5: 0

    cardA.rate = cardA.rate + 40 * (Sa - Ea)
    cardB.rate = cardB.rate + 40 * (Sb - Eb)

    cardA.participations += 1
    cardB.participations += 1

    cards.set(decision < 0? b: a, cardA)
    cards.set(decision < 0? a: b, cardB)

    return true
  }

  static clearAll(): bool {
    cards.clear()
    return true
  }
}