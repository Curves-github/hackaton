import { Unit, UNITS } from "../models/Unit";

describe("Unit model", () => {
  it("add - should add item to units storage", () => {
    const unit = Unit.add("url", "owner");
    expect(UNITS.values()[0]).toStrictEqual(unit);
  });
  it("add - should throw error if user already create unit with this url", () => {
    Unit.add("url", "owner");
    expect(() => {
      Unit.add("url", "owner");
    }).toThrow();
  });
  it("get - should return unit instance if exist", () => {
    const unit = Unit.add("url", "owner");
    expect(Unit.get(unit.id)).toStrictEqual(unit);
  });
  it("get - should return null if unit not found", () => {
    expect(Unit.get(1)).toBe(null);
  });
  it("getSome - should return unit instance if exist", () => {
    const unit = Unit.add("url", "owner");
    expect(Unit.getSome(unit.id)).toStrictEqual(unit);
  });
  it("getSome - should throw error if unit not found", () => {
    expect(() => Unit.getSome(1)).toThrow();
  });
  it("all - should return all values", () => {
    const createdUnits = [Unit.add("url", "owner"), Unit.add("url2", "owner")];
    const storedUnits = Unit.all();
    expect(storedUnits).toStrictEqual(createdUnits);
  });
  it("getByOwner - should return units for specific owner", () => {
    const bobUnits = [Unit.add("url", "bob"), Unit.add("url2", "bob")];
    const aliceUnits = [Unit.add("url3", "alice"), Unit.add("url4", "alice")];

    expect(Unit.getByOwner("bob")).toStrictEqual(bobUnits);
  });
  it("setRate - should set rate for specific unit", () => {
    const unit = Unit.add("url", "owner");
    const rate = unit.rate;
    Unit.setRate(unit.id, rate + 1);
    expect(Unit.getSome(unit.id).rate).toBe(rate + 1);
  });
});
