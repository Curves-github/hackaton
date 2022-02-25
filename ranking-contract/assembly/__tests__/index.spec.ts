import { Pool } from "../models/Pool";
import { Unit } from "../models/Unit";
import {_generatePool} from '../index';

describe('contract methods', () => {
  it('generatePool - should return latest unvoted pool if it exists', ()=>{
    const votedPools = [Pool.insert([1,2]), Pool.insert([1,3])]
    votedPools.forEach((p)=>Pool.skipPool(p.id));
    
    const latestUnvotedPool = Pool.insert([1,4]);

    const generatedPool = _generatePool();
    expect(generatedPool).toStrictEqual(latestUnvotedPool)
  })
  it("generatePool - should return unique pool", ()=>{
    const units = [
      Unit.add('1', '1'),
      Unit.add('2', '2'),
      Unit.add('3', '3'),
    ]
    Pool.insert([units[0].id,units[1].id]);
    Pool.insert([units[0].id, units[2].id])
    const uniquePool = _generatePool();

    
  })
});
