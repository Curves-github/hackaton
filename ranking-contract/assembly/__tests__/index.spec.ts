import { Pool } from "../models/Pool";
import { Unit } from "../models/Unit";
import { _generatePool } from "../index";
import { VMContext } from "near-sdk-as";

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
});
