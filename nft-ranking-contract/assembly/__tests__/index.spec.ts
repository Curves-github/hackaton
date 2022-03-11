import { clearAll, create, getAll, getTwoCards, getWinners, vote } from "../index";
import { Card, cards, votes, Vote } from "../model";
import { history, User, users } from "../model-history";

describe('contract methods', () => {

  it("creates a todo", () => {
    const todo = create("id0", "https://curves.digital/");
    expect(cards.getSome(todo.id)).toStrictEqual(todo);
  });

  it("creates a todo", () => {
    const a = create("id0", "https://curves.digital/");
    const b = create("id1", "https://curves.digital/");
    expect(getAll()).toContainEqual(a);
    expect(getAll()).toContainEqual(b);
  });

  it('get two cards', () => {

    const a = Card.insert("id0", "https://curves.digital/");
    const b = Card.insert("id1", "https://curves.digital/");
    
    expect(getTwoCards()).toStrictEqual(new Vote(a, b))
  });

  it('vote', () => {

    const a = Card.insert("id0", "https://curves.digital/");
    const b = Card.insert("id1", "https://curves.digital/");

    const rivals = getTwoCards()
    //expect(Card.getVoteStamp(cards.cardA.id, cards.cardB.id, cards.timestamp)).toStrictEqual([0], "VoteStamp created")

    const result = vote(rivals.cardA.id, rivals.cardB.id, 1)
    expect(result).toBeTruthy("Vote success")

    expect(cards.getSome(a.id).rate).toBeGreaterThan(cards.getSome(b.id).rate, "rate A must be greater then rate B")

    // Also we must check votes history
    const user = users.values(0, 1)[0]
    expect(user.participationCount).toBe(1)
    expect(User.getHistory(user, a)).toBe(1)
    expect(User.getHistory(user, b)).toBe(0)
    
    expect(getWinners().length).toBe(1)

    vote(rivals.cardA.id, rivals.cardB.id, -1)
    log(getWinners())
    expect(getWinners()[0].normalizeContribution).toBeLessThanOrEqual(1)

  });

  it('clearAll', () => {
    create("id0", "https://curves.digital/");
    create("id1", "https://curves.digital/");
    expect(cards.length).toStrictEqual(2)

    clearAll()
    expect(cards.length).toStrictEqual(0)
  })
});