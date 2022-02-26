import {
  getUnitOpponents,
  getMustUnusedUnit,
  getClosestByRate,
  getPoolUnits,
  computeRate,
} from "./helpers";
import { ADMINS_ACCOUNTS } from "./roles";
import { Pool } from "./models/Pool";
import { Unit, UnitConstructor } from "./models/Unit";
import { context } from "near-sdk-as";

class PoolWithUnits {
  pool: Pool;
  units: Unit[];
}

export function _generatePool(): Pool {
  const unvotedPool = Pool.getUserUncompletedPool();
  if (unvotedPool) {
    return unvotedPool;
  }
  const units = Unit.all();
  const mostUnusedUnit = getMustUnusedUnit(units);
  const forbiddenUnitsIds = getUnitOpponents(mostUnusedUnit.id, context.sender);

  const restUnits: Unit[] = [];
  for (let i = 0; i < units.length; i++) {
    const unit = units[i];
    if (unit.id == mostUnusedUnit.id || forbiddenUnitsIds.includes(unit.id))
      continue;
    restUnits.push(unit);
  }
  if (restUnits.length == 0) {
    throw new Error("Unique units pair not found");
  }
  const rival = getClosestByRate(restUnits, mostUnusedUnit);

  return Pool.insert([mostUnusedUnit.id, rival.id]);
}

export function getPoolWithUnits(): PoolWithUnits {
  const pool = _generatePool();
  const units: Unit[] = [];
  for (let i = 0; i < pool.options.length; i++) {
    const unitId = pool.options[i];
    const unit = Unit.getSome(unitId);
    units.push(unit);
  }

  return {
    pool,
    units,
  };
}

export function skipPool(poolId: u32): void {
  Pool.skipPool(poolId);
  const poolUnits = getPoolUnits(poolId);
  computeRate(poolUnits, -1);
}

export function votePool(poolId: u32, optionId: u32): void {
  Pool.votePool(poolId, optionId);
  const poolUnits = getPoolUnits(poolId);
  const index: i8 = poolUnits[0].id == optionId ? 0 : 1;
  computeRate(poolUnits, index);
}

export function addUnits(unitsProps: UnitConstructor[]): Unit[] {
  if (!ADMINS_ACCOUNTS.includes(context.sender)) {
    throw new Error("Access denied");
  }
  const units: Unit[] = [];
  for (let i = 0; i < unitsProps.length; i++) {
    const unitProps = unitsProps[i];
    const unit = Unit.add(unitProps.url, unitProps.owner);
    units.push(unit);
  }
  return units;
}
