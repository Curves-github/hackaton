import { Pool, POOLS } from "../models/Pool";
import { VMContext } from "near-sdk-as";

describe("Pool model", () => {
  it("Insert - should add item to pools storage", () => {
    const pool = Pool.insert([1,2]);
    expect(POOLS.values()[0]).toStrictEqual(pool);
  });
  it("insert - should throw error if user already create pool with same name", () => {
    Pool.insert([1,2]);
    expect(() => {
      Pool.insert([1,2]);
    }).toThrow();
  });
  it("insert - diffrenet users can create pools with same options", ()=>{
    expect(()=>{
      Pool.insert([1,2]);
      VMContext.setSigner_account_id("alice");
      Pool.insert([1,2]);
    }).not.toThrow()
    
  })
  it("get - should return pool instance if exist", () => {
    const pool = Pool.insert([1,2]);
    expect(Pool.get(pool.id)).toStrictEqual(pool);
  });
  it("get - should return undefined if pool not found", () => {
    expect(Pool.get(1)).toBe(null);
  });
  it("getSome - should return pool instance if exist", () => {
    const pool = Pool.insert([1,2]);
    expect(Pool.getSome(pool.id)).toStrictEqual(pool);
  });
  it("getSome - should throw error if pool not found", () => {
    expect(() => Pool.getSome(1)).toThrow();
  });
  it("all - should return all values", ()=>{
    const createdPools = [Pool.insert([1,2]), Pool.insert([3,2])];
    const storedPools = Pool.all();
    expect(storedPools).toStrictEqual(createdPools)
  })
  it("list - should return 'limit' of pools start's from 'offset'", () => {
    const poolsList = [
      Pool.insert([1,2]),
      Pool.insert([2,3]),
      Pool.insert([4,5]),
    ];

    const list = Pool.list(0, 2);
    expect(list.length).toBe(2);
    expect(list).toStrictEqual(poolsList.slice(0, 2));
  });
  it("list - should return 'limit'(or less) of pools start's from 'offset'", () => {
    const poolsList = [
      Pool.insert([1,2]),
      Pool.insert([2,3]),
      Pool.insert([4,5]),
    ];

    let list = Pool.list(0, poolsList.length - 1);
    expect(list.length).toBe(2);
    expect(list).toStrictEqual(poolsList.slice(0, poolsList.length - 1));

    list = Pool.list(0, poolsList.length + 1);
    expect(list.length).toBe(poolsList.length);
    expect(list).toStrictEqual(poolsList);
  });
  it("getPoolsByUser - should return only pools for requested user", ()=>{
    VMContext.setSigner_account_id("bob");
    const userPools = [Pool.insert([1,2]), Pool.insert([2,3])];

    VMContext.setSigner_account_id("alice");
    const otherPools = [Pool.insert([1,2]), Pool.insert([2,3])];

    const storedUserPools = Pool.getPoolsByUser('bob');
    expect(storedUserPools).toStrictEqual(userPools);
  })
  it("getPoolsByOption - should return only pools for requested option", ()=>{
    const optionId = 1;
    const optionPools = [Pool.insert([optionId,2]), Pool.insert([optionId,3])];
    Pool.insert([3,4])
    expect(Pool.getPoolsByOption(optionId)).toStrictEqual(optionPools);
  });
  it("vote - should set mark in vote field", ()=>{
    let pool = Pool.insert([1,2]);
    Pool.vote(pool.id, 1);
    pool = Pool.getSome(pool.id);
    expect(pool.vote).toBe(1);
  })
  it("vote - shoud throw error if option not found", ()=>{
    expect(()=>{
      const pool = Pool.insert([3,4]);
      Pool.vote(pool.id, 1);
    }).toThrow()
  })
  it("vote - should throw error if pool not found", ()=>{
    expect(()=>{
      Pool.vote(1, 1);
    }).toThrow()
  })
  it("skip - should set mark in skip field", ()=>{
    let pool = Pool.insert([1,2]);
    Pool.skip(pool.id);
    pool = Pool.getSome(pool.id);
    expect(pool.skip).toBeTruthy();
  })
  it('skip - should trhow error if pool not found', ()=>{
    expect(()=>{
      Pool.skip(1);
    }).toThrow();
  })
  it("getPoolsWithOptionWinner - should return pools with option winner",()=>{
    const winnerOption = 1;
    let pools = [Pool.insert([winnerOption,2]), Pool.insert([winnerOption,3]),Pool.insert([3,4])];
    Pool.vote(pools[0].id, winnerOption)
    Pool.vote(pools[1].id, winnerOption)
    pools = Pool.all();
    const poolsWithWinner = Pool.getPoolsWithOptionWinner(1);
    expect(poolsWithWinner[0]).toStrictEqual(pools[0])
    expect(poolsWithWinner[1]).toStrictEqual(pools[1])
    
  });
  it("getUserUnvotedPool - should return unvoted pools created current user, and skip pools with skip flag",()=>{
    Pool.insert([1,2]);
    Pool.insert([1,3]);
    VMContext.setSigner_account_id("alice");
    const userPools = [Pool.insert([1,2]), Pool.insert([1,3]), Pool.insert([1,4])];

    Pool.vote(userPools[0].id, 1);
    Pool.skip(userPools[1].id);
    expect(Pool.getUserUnvotedPool()).toStrictEqual(userPools[2]);
  })
})