import { clearAll, create, getAll, getTwoCards, getWinners, vote } from "../index";
import { Card, cardIds, cards, cardsInfo, votes } from "../model";
import { history, User, users } from "../model-history";

describe('contract methods', () => {

  it("creates a one card", () => {
    const card = create("id0", "img1", "https://curves.digital/");
    expect(cardsInfo.getSome(card.id)).toStrictEqual(card);
  });

  it("creates a many card", () => {
    const a = create("id0", "img1", "https://curves.digital/");
    const b = create("id1", "img1", "https://curves.digital/");
    expect(getAll()).toContainEqual(a);
    expect(getAll()).toContainEqual(b);
  });

  it('get two cards', () => {

    const a = Card.insert("id0", "img1", "https://curves.digital/");
    const b = Card.insert("id1", "img2", "https://curves.digital/");
    
    expect(getTwoCards()).toStrictEqual([ a, b ])
  });

  it('vote', () => {

    const a = Card.insert("id0", "img1", "https://curves.digital/");
    const b = Card.insert("id1", "img2", "https://curves.digital/");

    const rivals = getTwoCards()
    //expect(Card.getVoteStamp(cards.cardA.id, cards.cardB.id, cards.timestamp)).toStrictEqual([0], "VoteStamp created")

    const result = vote(rivals[0].id, rivals[1].id, 1)
    expect(result).toBeTruthy("Vote success")

    expect(cards.getSome(a.id).rate).toBeGreaterThan(cards.getSome(b.id).rate, "rate A must be greater then rate B")

    // Also we must check votes history
    const user = users.values(0, 1)[0]
    expect(user.participationCount).toBe(1)
    expect(User.getHistory(user, a.id)).toBe(1)
    expect(User.getHistory(user, b.id)).toBe(0)
    
    expect(getWinners().length).toBe(1)

    vote(rivals[0].id, rivals[1].id, -1)
    log(getWinners())
    expect(getWinners()[0].normalizeContribution).toBeLessThanOrEqual(1)

  });

  it('clearAll', () => {
    create("id0", "img1", "https://curves.digital/");
    create("id1", "img2", "https://curves.digital/");
    expect(cardIds.length).toStrictEqual(2)

    clearAll()
    expect(cardIds.length).toStrictEqual(0)
  })
});