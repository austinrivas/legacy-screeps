import {assert} from "chai";
import {RoomManager} from "../../src/components/roomManager";
import {CreepFactory} from "../mock/creep/factory.creep";
import {RoomFactory} from "../mock/room/factory.room";

describe("RoomManager", () => {

  const creepFactory = new CreepFactory();

  const creep = creepFactory.build();

  const creeps = [creep, creep, creep];

  const roomFactory = new RoomFactory();

  const emptyRoom = roomFactory
    .build();

  const occupiedRoom = roomFactory
    .creeps(creeps)
    .build();

  before(() => {
    // runs before all tests in this block
  });

  beforeEach(() => {
    // runs before each test in this block
  });

  it("can count all creeps in a room", () => {
    const emptyRoomManager = new RoomManager(emptyRoom);
    const occupiedRoomManager = new RoomManager(occupiedRoom);

    emptyRoomManager.run();
    occupiedRoomManager.run();

    assert.isTrue(emptyRoomManager.creepCount() === 0);
    assert.isTrue(occupiedRoomManager.creepCount() === creeps.length);
  });

  it("can remove creeps from memory that no longer exist", () => {
    const nonExistentCreep = new CreepFactory()
      .id("does-not-exist")
      .build();

    Memory.creeps[nonExistentCreep.id] = nonExistentCreep.memory;

    const outOfSyncRoom = roomFactory
      .creeps(creeps)
      .build();

    const outOfSyncRoomFSM = new RoomManager(outOfSyncRoom);

    assert.isUndefined(Game.creeps[nonExistentCreep.id]);
    assert.isDefined(Memory.creeps[nonExistentCreep.id]);

    outOfSyncRoomFSM.run();

    assert.isUndefined(Game.creeps[nonExistentCreep.id]);
    assert.isUndefined(Memory.creeps[nonExistentCreep.id]);
  });

  it("can build creeps whenever creep population falls below min threshold", () => {
    assert.isTrue(false);
  });

  it("should build a lightweight creep when creep population is 0", () => {
    assert.isTrue(false);
  });

  it("should build a lightweight creep while room energy capacity is less than threshold", () => {
    assert.isTrue(false);
  });

  // it("should determine ideal path from sources to energy storage on initial tick", () => {
  //   assert.isTrue(false);
  // });
  //
  // it("should determine ideal path from sources to energy storage every 100 ticks", () => {
  //   assert.isTrue(false);
  // });
  //
  // it("should determine ideal path from sources to controller on initial tick", () => {
  //   assert.isTrue(false);
  // });
  //
  // it("should determine ideal path from sources to controller every 1000 ticks", () => {
  //   assert.isTrue(false);
  // });
  //
  // it("should determine ideal path from energy storage to controller on initial tick", () => {
  //   assert.isTrue(false);
  // });
  //
  // it("should determine ideal path from energy storage to controller every 100 ticks", () => {
  //   assert.isTrue(false);
  // });
  //
  // it("should identify harvesting stations on initial tick", () => {
  //   assert.isTrue(false);
  // });
  //
  // it("should identify controller upgrade stations on initial tick", () => {
  //   assert.isTrue(false);
  // });
  //
  // it("should index structures by type every 100 ticks", () => {
  //   assert.isTrue(false);
  // });
  //
  // it("should schedule construction of aux energy container when it is available", () => {
  //   assert.isTrue(false);
  // });
  //
  // it("should schedule construction of energy storage when it is available", () => {
  //   assert.isTrue(false);
  // });
  //
  // it("should schedule construction of roads when it is available", () => {
  //   assert.isTrue(false);
  // });
  //
  // it("should schedule construction of defense towers when it is available", () => {
  //   assert.isTrue(false);
  // });
});
