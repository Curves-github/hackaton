import { clearAll, create, getAll, getTwoCards, vote } from "../index";
import { Card, cards, votes, Vote } from "../model";

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
    
    expect(getTwoCards()).toStrictEqual(new Vote(a, b, Card.currentTimestamp()))
  });

  it('vote', () => {

    const a = Card.insert("id0", "https://curves.digital/");
    const b = Card.insert("id1", "https://curves.digital/");

    const rivals = getTwoCards()
    //expect(Card.getVoteStamp(cards.cardA.id, cards.cardB.id, cards.timestamp)).toStrictEqual([0], "VoteStamp created")
    expect(Card.checkVoteStamp(rivals.cardA.id, rivals.cardB.id, rivals.timestamp)).toBeTruthy("VoteStamp has")

    const result = vote(rivals.cardA.id, rivals.cardB.id, 1, rivals.timestamp)
    expect(result).toBeTruthy("Vote success")

    expect(cards.getSome(a.id).rate).toBeGreaterThan(cards.getSome(b.id).rate, "rate A must be greater then rate B")
  });

  it('clearAll', () => {
    create("id0", "https://curves.digital/");
    create("id1", "https://curves.digital/");
    expect(cards.length).toStrictEqual(2)

    clearAll()
    expect(cards.length).toStrictEqual(0)
  })
});