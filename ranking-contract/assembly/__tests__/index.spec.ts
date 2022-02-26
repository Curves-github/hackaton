import { Unit } from "../models/Unit";
import { Pool } from "../models/Pool";
import {
  _generatePool,
  getPoolWithUnits,
  skipPool,
  votePool,
  addUnits,
} from "../index";
import { ADMINS_ACCOUNTS } from "../roles";
import { VMContext, VM } from "near-sdk-as";

describe("contract methods", () => {
  it("generatePool - should return latest unvoted pool if it exists", () => {
    VMContext.setSigner_account_id("bob");
    const bobVotedPools = [Pool.insert([1, 2]), Pool.insert([1, 3])];
    bobVotedPools.forEach((p) => Pool.skipPool(p.id));
    Pool.insert([1, 4]);

    VMContext.setSigner_account_id("alice");
    const aliceVotedPools = [Pool.insert([1, 2]), Pool.insert([1, 3])];
    aliceVotedPools.forEach((p) => Pool.skipPool(p.id));
    const aliceUnvotedPool = Pool.insert([1, 4]);

    const generatedPool = _generatePool();
    expect(generatedPool).toStrictEqual(aliceUnvotedPool);
  });
  it("generatePool - should return unique pool for user", () => {
    const units = [Unit.add("1", "1"), Unit.add("2", "2"), Unit.add("3", "3")];
    VMContext.setSigner_account_id("bob");
    const bobPools = [
      Pool.insert([units[0].id, units[1].id]),
      Pool.insert([units[0].id, units[2].id]),
      Pool.insert([units[1].id, units[2].id]),
    ];
    bobPools.forEach((p) => Pool.skipPool(p.id));

    VMContext.setSigner_account_id("alice");
    const alicePools = [
      Pool.insert([units[0].id, units[1].id]),
      Pool.insert([units[0].id, units[2].id]),
    ];
    alicePools.forEach((p) => Pool.skipPool(p.id));

    const uniquePool = _generatePool();
    expect(uniquePool.options).toInclude(units[1].id);
    expect(uniquePool.options).toInclude(units[2].id);
  });
  it("generatePool - should throw error if unique unvoted pair not exists", () => {
    const units = [Unit.add("1", "1"), Unit.add("2", "2"), Unit.add("3", "3")];
    const pools = [
      Pool.insert([units[0].id, units[1].id]),
      Pool.insert([units[0].id, units[2].id]),
      Pool.insert([units[1].id, units[2].id]),
    ];
    pools.forEach((p) => Pool.skipPool(p.id));

    expect(() => {
      _generatePool();
    }).toThrow();
  });
  it("getPoolWithUnits - should return pool and units", () => {
    Unit.add("1", "1");
    Unit.add("2", "2");
    Unit.add("3", "3");
    expect(() => {
      getPoolWithUnits();
    }).not.toThrow();
  });
  it("skipPool - should set flag in pool and decrease rate for booth units", () => {
    let unit1 = Unit.add("url1", "bob");
    let unit2 = Unit.add("url2", "bob");
    const initalRate1 = unit1.rate;
    const initalRate2 = unit2.rate;
    let pool = Pool.insert([unit1.id, unit2.id]);
    skipPool(pool.id);

    unit1 = Unit.getSome(unit1.id);
    unit2 = Unit.getSome(unit2.id);
    pool = Pool.getSome(pool.id);
    expect(unit1.rate).toBeLessThanOrEqual(initalRate1);
    expect(unit2.rate).toBeLessThanOrEqual(initalRate2);
    expect(pool.skip).toBeTruthy();
  });
  it("votePool - should add vote to pool and increase rate for winner unit and decrease for loser", () => {
    let winner = Unit.add("url1", "bob");
    let loser = Unit.add("url2", "bob");
    const initialWinnerRate = winner.rate;
    const initialLoserRate = loser.rate;
    let pool = Pool.insert([winner.id, loser.id]);
    votePool(pool.id, winner.id);
    winner = Unit.getSome(winner.id);
    loser = Unit.getSome(loser.id);
    pool = Pool.getSome(pool.id);

    expect(pool.vote).toBe(winner.id);
    expect(winner.rate).toBeGreaterThan(initialWinnerRate);
    expect(loser.rate).toBeLessThan(initialLoserRate);
  });
  it("addUnits - admin can store units", () => {
    VMContext.setSigner_account_id(ADMINS_ACCOUNTS[0]);
    const units = addUnits([
      { url: "1", owner: "1" },
      { url: "2", owner: "2" },
    ]);
    expect(Unit.all()).toStrictEqual(units);
  });
  it("addUnits - should throw error if account with admin role", () => {
    expect(() => {
      const units = addUnits([
        { url: "1", owner: "1" },
        { url: "2", owner: "2" },
      ]);
    }).toThrow();
  });
});
