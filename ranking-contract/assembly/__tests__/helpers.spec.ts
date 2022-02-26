import {Unit} from '../models/Unit';
import {Pool} from '../models/Pool';
import {getComplitedPoolsWithUnit, getMustUnusedUnit, getClosestByRate, getUnitOpponents, getPoolUnits, computeRate} from '../helpers';
import { VMContext } from "near-sdk-as";

describe('helpers',()=>{
  it("getComplitedPoolsWithUnit - should return completed pools with unit", ()=>{
    const units = [
      Unit.add('url1', 'bob'),
      Unit.add('url2', 'bob'),
      Unit.add('url3', 'alice'),
      Unit.add('url4', 'alice'),
    ]
    const pools = [
      Pool.insert([units[0].id, units[1].id]),
      Pool.insert([units[0].id, units[2].id]),
      Pool.insert([units[0].id, units[3].id]),
      Pool.insert([units[1].id, units[2].id]),
      Pool.insert([units[1].id, units[3].id]),
    ]
    Pool.skipPool(pools[0].id);
    Pool.votePool(pools[1].id, pools[1].options[0]);

    const resultIds = getComplitedPoolsWithUnit(units[0].id).map<u32>(pool=>pool.id);

    expect(resultIds).toInclude(pools[0].id)
    expect(resultIds).toInclude(pools[1].id)
    expect(resultIds.length).toBe(2);
  })
  it('getMustUnusedUnit - should return unit which have minimum particapation in completed pools', ()=>{
    const units = [
      Unit.add('url0', 'bob'),
      Unit.add('url1', 'bob'),
      Unit.add('url2', 'alice'),
      Unit.add('url3', 'alice'),
    ]
    const pools = [
      Pool.insert([units[0].id, units[1].id]),
      Pool.insert([units[0].id, units[2].id]),
      Pool.insert([units[0].id, units[3].id]),
      Pool.insert([units[1].id, units[2].id]),
      Pool.insert([units[1].id, units[3].id]),
    ]
    Pool.skipPool(pools[0].id);
    Pool.skipPool(pools[1].id);
    Pool.skipPool(pools[2].id);
    Pool.votePool(pools[3].id, pools[3].options[0]);
    expect(getMustUnusedUnit(Unit.all())).toStrictEqual(units[3]);
  })
 
  it('getClosestByRate - should return closest by rate for specific item', ()=>{
    const units = [
      Unit.add('url1', 'bob'),
      Unit.add('url2', 'bob'),
      Unit.add('url3', 'alice'),
      Unit.add('url4', 'alice'),
    ]
    Unit.setRate(units[0].id, 0);
    Unit.setRate(units[1].id, 10);
    Unit.setRate(units[2].id, -5);
    Unit.setRate(units[3].id, 50);
    const target = Unit.getSome(units[0].id);
    const expected = Unit.getSome(units[2].id);
    expect(getClosestByRate(Unit.all(), target)).toStrictEqual(expected)
  })
  it('getUnitOpponents - should return pair ids for specific unit', ()=>{
    const units = [
      Unit.add('url', 'bob'),
      Unit.add('url2', 'bob'),
      Unit.add('url3', 'alice'),
      Unit.add('url4', 'alice'),
    ]
    VMContext.setSigner_account_id("bob");
    Pool.insert([units[0].id, units[1].id]);
    Pool.insert([units[0].id, units[2].id]);
    Pool.insert([units[1].id, units[2].id]);
    Pool.insert([units[1].id, units[3].id]);
    VMContext.setSigner_account_id("alice");
    Pool.insert([units[0].id, units[1].id]);
    Pool.insert([units[0].id, units[2].id]);
    Pool.insert([units[1].id, units[2].id]);
    Pool.insert([units[1].id, units[3].id]);
    

    expect(getUnitOpponents(units[0].id, 'bob').length).toBe(2);
    expect(getUnitOpponents(units[0].id, 'bob')).toInclude(units[1].id);
    expect(getUnitOpponents(units[0].id, 'bob')).toInclude(units[2].id);

    expect(getUnitOpponents(units[1].id, 'alice').length).toBe(3);
    expect(getUnitOpponents(units[1].id, 'alice')).toInclude(units[0].id);
    expect(getUnitOpponents(units[1].id, 'alice')).toInclude(units[2].id);
    expect(getUnitOpponents(units[1].id, 'alice')).toInclude(units[3].id);
  })
  it("getPoolUnits - should return Units for specific pool", ()=>{
    const units = [
      Unit.add('url', 'bob'),
      Unit.add('url2', 'bob'),
      Unit.add('url3', 'alice'),
      Unit.add('url4', 'alice'),
    ]
    const pool = Pool.insert([units[0].id, units[1].id]);
    Pool.insert([units[0].id, units[2].id]);
    expect(getPoolUnits(pool.id)).toStrictEqual([units[0], units[1]])
  });
  it('computeRate - should increase rate for winner', ()=>{
    let winner = Unit.add('url1', 'bob');
    const loser = Unit.add('url2', 'bob');
    const initalRate = winner.rate;
    computeRate([winner, loser], 0)
    winner = Unit.getSome(winner.id);
    expect(winner.rate).toBeGreaterThan(initalRate)
  });
  it('computeRate - should decrease rate for loser', ()=>{
    let winner = Unit.add('url1', 'bob');
    let loser = Unit.add('url2', 'bob');
    const initalRate = winner.rate;
    computeRate([winner, loser], 0)
    loser = Unit.getSome(loser.id);
    expect(loser.rate).toBeLessThan(initalRate)
  });
  it('computeRate - should decrease both rates if user skip pool', ()=>{
    let unit1 = Unit.add('url1', 'bob');
    let unit2 = Unit.add('url2', 'bob');
    const initalRate1 = unit1.rate;
    const initalRate2 = unit2.rate;
    computeRate([unit1, unit2], -1);
    unit1 = Unit.getSome(unit1.id);
    unit2 = Unit.getSome(unit2.id);
    expect(unit1.rate).toBeLessThanOrEqual(initalRate1)
    expect(unit2.rate).toBeLessThanOrEqual(initalRate2)
  })
})