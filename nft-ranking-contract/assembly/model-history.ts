import { context, math, PersistentMap, PersistentUnorderedMap, PersistentVector } from "near-sdk-core"
import { Card, cardIds, cards } from "./model"

export const history = new PersistentUnorderedMap<u64, u16> ("votes-history")
export const users = new PersistentUnorderedMap<u32, User>("users")

@nearBindgen
export class HistoryEvent {
  id: u32
  count: u32
}

@nearBindgen
export class Winner { 
  accountId: string
  contribution: u16
  normalizeContribution: f32 
}

@nearBindgen
export class User {
  
  id: u32
  accountId: string
  participationCount: u32

  constructor(accountId: string) {
    this.id = math.hash32<string>(accountId)
    this.accountId = accountId
    this.participationCount = 0
  }

  static current(): User {
    const user = new User(context.sender)
    if (users.contains(user.id)) {
      return users.getSome(user.id)
    }
    return user
  }

  static getHistory(user: User, cardId: u32): u16 {
    const key = (<u64>user.id << 32) + cardId 
    const count = history.contains(key)? history.getSome(key): 0
    return count
  }

  static voteCard(user: User, card: Card): bool {
    user.participationCount += 1
    users.set(user.id, user)

    const key = (<u64>user.id << 32) + card.id 
    if (history.contains(key)) {
      history.set(key, history.getSome(key)+1)
    } else {
      history.set(key, 1)
    }

    return true
  }

  static getAll(): User[] {
    return users.values()
  }

  static getFullHistory(): Winner[] {
    const winners: Winner[] = []

    const userKeys = users.keys()
    for (let i = 0; i < userKeys.length; i++) {
      const user = users.getSome(userKeys[i])
      for (let j = 0; j < cardIds.length; j++) {
        const key = (<u64>userKeys[i] << 32) + cardIds[j]
        if (history.contains(key)) {
          const contribution = history.getSome(key)
          winners.push({ 
            accountId: user.accountId, 
            contribution,
            normalizeContribution: <f32>contribution / <f32>user.participationCount
          })
        }
      }
    }
    return winners
  }

  static getWinnerCard(): Card {
    const allCards = Card.getAll()
    let cardWinner: Card = allCards[0]
    
    for (let i = 1; i < allCards.length; i++) {
      if (allCards[i].rate > cardWinner.rate){
        cardWinner = allCards[i]
      }
    }
    return cardWinner
  }

  static getWinners(): Winner[] {
    const cardWinner = User.getWinnerCard()

    const winners: Winner[] = []

    const userKeys = users.keys()
    for (let i = 0; i < userKeys.length; i++) {
      const key = (<u64>userKeys[i] << 32) + cardWinner.id
      if (history.contains(key)) {
        const user = users.getSome(userKeys[i])
        const contribution = history.getSome(key)
        winners.push({ 
          accountId: user.accountId, 
          contribution,
          normalizeContribution: <f32>contribution / <f32>user.participationCount
        })
      }
    }

    return winners
  }

  static clearMeta(): bool {
    users.clear()
    history.clear()
    return true
  }

}