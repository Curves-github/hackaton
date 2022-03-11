// contract/assembly/model.ts
import { math, PersistentSet, datetime, PersistentUnorderedMap, context } from "near-sdk-as";
import { User } from "./model-history";

export const votes = new PersistentSet<u32>("votes")
export const cards = new PersistentUnorderedMap<u32, Card>("cards");


@nearBindgen
export class Vote {
  cardA: Card
  cardB: Card

  constructor(cardA: Card, cardB: Card) {
    this.cardA = cardA
    this.cardB = cardB
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

    const card = new Card(id, src);
 
    cards.set(card.id, card);

    return card;
  }

  static getAll(): Card[] {
    return cards.values(0, cards.length)
  }

  static getLength(): u32 {
    return cards.length
  }

  static currentTimestamp(): u64 {
    return datetime.block_datetime().epochNanoseconds
  }

  static getTwoCards(): Vote {
    const allCards = Card.getAll()
    let indexA = 0
    let minParticipations = allCards[indexA].participations
    for (let i = 1; i < allCards.length; i++) {
      if (allCards[i].participations < minParticipations) {
        minParticipations = allCards[i].participations
        indexA = i
      }
    }

    let indexB = 0
    let closestRate: f32 = 9999
    for (let i = 0; i < allCards.length; i++) {
      if (i === indexA) continue
      if (abs(allCards[i].rate - allCards[indexA].rate) < closestRate) {
        closestRate = abs(allCards[i].rate - allCards[indexA].rate)
        indexB = i
      }
    }

    return new Vote(allCards[indexA], allCards[indexB])
  }

  static vote(a: u32, b: u32, decision: i8): bool {

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
    
    const user = User.current()
    if (decision !== 0) {
      User.voteCard(user, cardA)
    }

    return true
  }

  static clearAll(): bool {
    cards.clear()
    return true
  }
}