import {assert} from "chai";
import {CreepInitialMemory, CreepManagerFSM, CreepStates} from "../../../src/components/creeps/creepManagerFSM";
import {ControllerFactory} from "../../mock/controller/factory.controller";
import {CreepFactory} from "../../mock/creep/factory.creep";
import {RoomFactory} from "../../mock/room/factory.room";
import {RoomPositionFactory} from "../../mock/roomPosition/factory.roomPosition";
import {SourceFactory} from "../../mock/source/factory.source";
import {SpawnFactory} from "../../mock/spawn/factory.spawn";

describe("CreepManagerFSM", () => {

  const body = [WORK, CARRY, MOVE];
  let RoomObjects: {[key: string]: any} = {};
  let creep: Creep;
  let creepFactory: CreepFactory;
  let controller: Controller;
  let controllerFactory: ControllerFactory;
  let fsm: CreepManagerFSM;
  let outOfRangePos: RoomPosition;
  let outOfRangeRoomPositionFactory: RoomPositionFactory;
  let room: Room;
  let roomFactory: RoomFactory;
  let source: Source;
  let sourceFactory: SourceFactory;
  let spawn: Spawn;
  let spawnFactory: SpawnFactory;

  let idleCreepFactory: CreepFactory;
  let movingToEnergySourceCreepFactory: CreepFactory;
  let harvestingEnergyCreepFactory: CreepFactory;
  let movingToEnergyStorageCreepFactory: CreepFactory;
  let depositingEnergyCreepFactory: CreepFactory;
  let movingToControllerCreepFactory: CreepFactory;
  let upgradingControllerCreepFactory: CreepFactory;
  let movingToRenewCreepFactory: CreepFactory;
  let renewingCreepFactory: CreepFactory;

  let idleCreep: Creep;
  let movingToEnergySourceCreep: Creep;
  let harvestingEnergyCreep: Creep;
  let movingToEnergyStorageCreep: Creep;
  let depositingEnergyCreep: Creep;
  let movingToControllerCreep: Creep;
  let upgradingControllerCreep: Creep;
  let movingToRenewCreep: Creep;
  let renewingCreep: Creep;

  let IdleFSM: CreepManagerFSM;
  let MovingToEnergySourceFSM: CreepManagerFSM;
  let HarvestingEnergyFSM: CreepManagerFSM;
  let MovingToEnergyStorageFSM: CreepManagerFSM;
  let DepositingEnergyFSM: CreepManagerFSM;
  let MovingToControllerFSM: CreepManagerFSM;
  let UpgradingControllerFSM: CreepManagerFSM;
  let MovingToRenewFSM: CreepManagerFSM;
  let RenewingFSM: CreepManagerFSM;

  before(() => {
    // runs before all tests in this block
  });

  beforeEach(() => {
    RoomObjects = {};

    Game.getObjectById = (id: string) => {
      return RoomObjects[id];
    };

    // runs before each test in this block
    outOfRangeRoomPositionFactory = new RoomPositionFactory()
      .x(-1)
      .y(-1);
    outOfRangePos = outOfRangeRoomPositionFactory.build();

    controllerFactory = new ControllerFactory();
    controller = controllerFactory.build();

    spawnFactory = new SpawnFactory();
    spawn = spawnFactory
      .build();
    RoomObjects[spawn.id] = spawn;

    sourceFactory = new SourceFactory();
    source = sourceFactory.build();
    RoomObjects[source.id] = source;

    roomFactory = new RoomFactory()
      .controller(controller)
      .sources([source])
      .spawns([spawn]);
    room = roomFactory.build();

    spawn.room = room;
    source.room = room;

    creepFactory = new CreepFactory()
      .carrying(RESOURCE_ENERGY, 0)
      .body(body)
      .room(room);
    creep = creepFactory.build();

    fsm = new CreepManagerFSM(creep);

    idleCreepFactory = new CreepFactory()
      .body(body)
      .carrying(RESOURCE_ENERGY, 0)
      .memory({state: CreepStates.Idle})
      .room(room);
    movingToEnergySourceCreepFactory = new CreepFactory()
      .body(body)
      .carrying(RESOURCE_ENERGY, 0)
      .memory({
        energySourceId: source.id,
        state: CreepStates.MovingToEnergySource
      })
      .room(room);
    harvestingEnergyCreepFactory = new CreepFactory()
      .body(body)
      .carrying(RESOURCE_ENERGY, 0)
      .memory({
        energySourceId: source.id,
        state: CreepStates.HarvestingEnergy
      })
      .room(room);
    movingToEnergyStorageCreepFactory = new CreepFactory()
      .body(body)
      .carrying(RESOURCE_ENERGY, 50)
      .memory({
        energyStorageId: spawn.id,
        state: CreepStates.MovingToEnergyStorage
      })
      .room(room);
    depositingEnergyCreepFactory = new CreepFactory()
      .body(body)
      .carrying(RESOURCE_ENERGY, 50)
      .memory({
        energyStorageId: spawn.id,
        state: CreepStates.DepositingEnergy
      })
      .room(room);
    movingToControllerCreepFactory = new CreepFactory()
      .body(body)
      .carrying(RESOURCE_ENERGY, 50)
      .memory({state: CreepStates.MovingToController})
      .room(room);
    upgradingControllerCreepFactory = new CreepFactory()
      .body(body)
      .carrying(RESOURCE_ENERGY, 50)
      .memory({state: CreepStates.UpgradingController})
      .room(room);
    movingToRenewCreepFactory = new CreepFactory()
      .body(body)
      .carrying(RESOURCE_ENERGY, 0)
      .ticksToLive(1)
      .memory({
        renewingStructureId: spawn.id,
        state: CreepStates.MovingToRenew
      })
      .room(room);
    renewingCreepFactory = new CreepFactory()
      .body(body)
      .carrying(RESOURCE_ENERGY, 0)
      .ticksToLive(1)
      .memory({
        renewingStructureId: spawn.id,
        state: CreepStates.Renewing})
      .room(room);

    idleCreep = idleCreepFactory.build();
    movingToEnergySourceCreep = movingToEnergySourceCreepFactory.build();
    harvestingEnergyCreep = harvestingEnergyCreepFactory.build();
    movingToEnergyStorageCreep = movingToEnergyStorageCreepFactory.build();
    depositingEnergyCreep = depositingEnergyCreepFactory.build();
    movingToControllerCreep = movingToControllerCreepFactory.build();
    upgradingControllerCreep = upgradingControllerCreepFactory.build();
    movingToRenewCreep = movingToRenewCreepFactory.build();
    renewingCreep = renewingCreepFactory.build();

    IdleFSM = new CreepManagerFSM(idleCreep);
    MovingToEnergySourceFSM = new CreepManagerFSM(movingToEnergySourceCreep);
    HarvestingEnergyFSM = new CreepManagerFSM(harvestingEnergyCreep);
    MovingToEnergyStorageFSM = new CreepManagerFSM(movingToEnergyStorageCreep);
    DepositingEnergyFSM = new CreepManagerFSM(depositingEnergyCreep);
    MovingToControllerFSM = new CreepManagerFSM(movingToControllerCreep);
    UpgradingControllerFSM = new CreepManagerFSM(upgradingControllerCreep);
    MovingToRenewFSM = new CreepManagerFSM(movingToRenewCreep);
    RenewingFSM = new CreepManagerFSM(renewingCreep);
  });

  it("can find an energy source", () => {
    const foundSource = fsm.findEnergySource();

    if (foundSource) {
      assert.isTrue(foundSource.id === source.id);
    } else {
      assert.isTrue(false);
    }
  });

  it("can find a spawn", () => {
    const foundSpawn = fsm.findSpawn();

    if (foundSpawn) {
      assert.isTrue(foundSpawn.id === spawn.id);
    } else {
      assert.isTrue(false);
    }
  });

  it("can find a controller", () => {
    const foundController = fsm.findController();

    if (foundController) {
      assert.isTrue(foundController.id === controller.id);
    } else {
      assert.isTrue(false);
    }
  });

  it("can determine how much energy it is carrying", () => {
    creep = creepFactory
      .carrying(RESOURCE_ENERGY, 50)
      .build();
    fsm = new CreepManagerFSM(creep);

    assert.isTrue(fsm.carriedEnergy() === 50);
  });

  it("should initialize into whatever state is in the creep's memory", () => {
    assert.isTrue(IdleFSM.is(CreepStates.Idle));
    assert.isTrue(MovingToEnergySourceFSM.is(CreepStates.MovingToEnergySource));
    assert.isTrue(HarvestingEnergyFSM.is(CreepStates.HarvestingEnergy));
    assert.isTrue(MovingToEnergyStorageFSM.is(CreepStates.MovingToEnergyStorage));
    assert.isTrue(DepositingEnergyFSM.is(CreepStates.DepositingEnergy));
    assert.isTrue(MovingToControllerFSM.is(CreepStates.MovingToController));
    assert.isTrue(UpgradingControllerFSM.is(CreepStates.UpgradingController));
    assert.isTrue(MovingToRenewFSM.is(CreepStates.MovingToRenew));
    assert.isTrue(RenewingFSM.is(CreepStates.Renewing));
  });

  it("should throw an error when attempting an invalid transition", () => {
    try {
      IdleFSM.go(CreepStates.HarvestingEnergy);
    } catch (e) {
      assert.isDefined(e);
    }
  });

  it("should have an initial state of Idle", () => {
    assert.isTrue(creep.memory.state === CreepStates.Idle);
    assert.isTrue(idleCreep.memory.state === CreepStates.Idle);
    assert.isTrue(fsm.getCurrentState() === CreepStates.Idle);
    assert.isTrue(IdleFSM.getCurrentState() === CreepStates.Idle);
  });

  it("should have its memory reset to CreepInitialMemory whenever it transitions to Idle", () => {
    assert.isTrue(MovingToEnergySourceFSM.is(CreepStates.MovingToEnergySource));
    assert.isFalse(movingToEnergySourceCreep.memory === CreepInitialMemory);
    MovingToEnergySourceFSM.go(CreepStates.Idle);

    assert.isTrue(MovingToEnergySourceFSM.is(CreepStates.Idle));
    assert.isTrue(movingToEnergySourceCreep.memory.energySourceId === CreepInitialMemory.energySourceId);
  });

  it("can transition from Idle -> MovingToEnergySource", () => {
    assert.isTrue(IdleFSM.canGo(CreepStates.MovingToEnergySource));

    IdleFSM.go(CreepStates.MovingToEnergySource);

    assert.isTrue(IdleFSM.is(CreepStates.MovingToEnergySource));
    assert.isTrue(idleCreep.memory.state === CreepStates.MovingToEnergySource);
  });

  it("can transition from Idle -> MovingToEnergyStorage", () => {
    assert.isTrue(IdleFSM.canGo(CreepStates.MovingToEnergyStorage));

    IdleFSM.go(CreepStates.MovingToEnergyStorage);

    assert.isTrue(IdleFSM.is(CreepStates.MovingToEnergyStorage));
    assert.isTrue(idleCreep.memory.state === CreepStates.MovingToEnergyStorage);
  });

  it("can transition from Idle -> MovingToController", () => {
    assert.isTrue(IdleFSM.canGo(CreepStates.MovingToController));

    IdleFSM.go(CreepStates.MovingToController);

    assert.isTrue(IdleFSM.is(CreepStates.MovingToController));
    assert.isTrue(idleCreep.memory.state === CreepStates.MovingToController);
  });

  it("can transition from MovingToEnergySource -> Idle", () => {
    assert.isTrue(MovingToEnergySourceFSM.canGo(CreepStates.Idle));

    MovingToEnergySourceFSM.go(CreepStates.Idle);

    assert.isTrue(MovingToEnergySourceFSM.is(CreepStates.Idle));
    assert.isTrue(movingToEnergySourceCreep.memory.state === CreepStates.Idle);
  });

  it("can transition from MovingToEnergySource -> HarvestingEnergy", () => {
    assert.isTrue(MovingToEnergySourceFSM.canGo(CreepStates.Idle));

    MovingToEnergySourceFSM.go(CreepStates.HarvestingEnergy);

    assert.isTrue(MovingToEnergySourceFSM.is(CreepStates.HarvestingEnergy));
    assert.isTrue(movingToEnergySourceCreep.memory.state === CreepStates.HarvestingEnergy);
  });

  it("can transition from HarvestingEnergy -> MovingToEnergyStorage", () => {
    assert.isTrue(HarvestingEnergyFSM.canGo(CreepStates.MovingToEnergyStorage));

    HarvestingEnergyFSM.go(CreepStates.MovingToEnergyStorage);

    assert.isTrue(HarvestingEnergyFSM.is(CreepStates.MovingToEnergyStorage));
    assert.isTrue(harvestingEnergyCreep.memory.state === CreepStates.MovingToEnergyStorage);
  });

  it("can transition from MovingToEnergyStorage -> DepositingEnergy", () => {
    assert.isTrue(MovingToEnergyStorageFSM.canGo(CreepStates.DepositingEnergy));

    MovingToEnergyStorageFSM.go(CreepStates.DepositingEnergy);

    assert.isTrue(MovingToEnergyStorageFSM.is(CreepStates.DepositingEnergy));
    assert.isTrue(movingToEnergyStorageCreep.memory.state === CreepStates.DepositingEnergy);
  });

  it("can transition from MovingToEnergyStorage -> MovingToController", () => {
    assert.isTrue(MovingToEnergyStorageFSM.canGo(CreepStates.MovingToController));

    MovingToEnergyStorageFSM.go(CreepStates.MovingToController);

    assert.isTrue(MovingToEnergyStorageFSM.is(CreepStates.MovingToController));
    assert.isTrue(movingToEnergyStorageCreep.memory.state === CreepStates.MovingToController);
  });

  it("can transition from DepositingEnergy -> MovingToEnergySource", () => {
    assert.isTrue(DepositingEnergyFSM.canGo(CreepStates.MovingToEnergySource));

    DepositingEnergyFSM.go(CreepStates.MovingToEnergySource);

    assert.isTrue(DepositingEnergyFSM.is(CreepStates.MovingToEnergySource));
    assert.isTrue(depositingEnergyCreep.memory.state === CreepStates.MovingToEnergySource);
  });

  it("can transition from DepositingEnergy -> MovingToController", () => {
    assert.isTrue(DepositingEnergyFSM.canGo(CreepStates.MovingToController));

    DepositingEnergyFSM.go(CreepStates.MovingToController);

    assert.isTrue(DepositingEnergyFSM.is(CreepStates.MovingToController));
    assert.isTrue(depositingEnergyCreep.memory.state === CreepStates.MovingToController);
  });

  it("can transition from HarvestingEnergy -> MovingToController", () => {
    assert.isTrue(HarvestingEnergyFSM.canGo(CreepStates.MovingToController));

    HarvestingEnergyFSM.go(CreepStates.MovingToController);

    assert.isTrue(HarvestingEnergyFSM.is(CreepStates.MovingToController));
    assert.isTrue(harvestingEnergyCreep.memory.state === CreepStates.MovingToController);
  });

  it("can transition from MovingToController -> UpgradingController", () => {
    assert.isTrue(MovingToControllerFSM.canGo(CreepStates.UpgradingController));

    MovingToControllerFSM.go(CreepStates.UpgradingController);

    assert.isTrue(MovingToControllerFSM.is(CreepStates.UpgradingController));
    assert.isTrue(movingToControllerCreep.memory.state === CreepStates.UpgradingController);
  });

  it("can transition from MovingToController -> Idle", () => {
    assert.isTrue(MovingToControllerFSM.canGo(CreepStates.Idle));

    MovingToControllerFSM.go(CreepStates.Idle);

    assert.isTrue(MovingToControllerFSM.is(CreepStates.Idle));
    assert.isTrue(movingToControllerCreep.memory.state === CreepStates.Idle);
  });

  it("can transition from UpgradingController -> MovingToEnergySource", () => {
    assert.isTrue(UpgradingControllerFSM.canGo(CreepStates.MovingToEnergySource));

    UpgradingControllerFSM.go(CreepStates.MovingToEnergySource);

    assert.isTrue(UpgradingControllerFSM.is(CreepStates.MovingToEnergySource));
    assert.isTrue(upgradingControllerCreep.memory.state === CreepStates.MovingToEnergySource);
  });

  it("can transitino from UpgradingController -> Idle", () => {
    assert.isTrue(UpgradingControllerFSM.canGo(CreepStates.Idle));

    UpgradingControllerFSM.go(CreepStates.Idle);

    assert.isTrue(UpgradingControllerFSM.is(CreepStates.Idle));
    assert.isTrue(upgradingControllerCreep.memory.state === CreepStates.Idle);
  });

  it("can transition from any except Renewing -> MovingToRenew", () => {
    assert.isTrue(IdleFSM.canGo(CreepStates.MovingToRenew));
    assert.isTrue(MovingToEnergySourceFSM.canGo(CreepStates.MovingToRenew));
    assert.isTrue(HarvestingEnergyFSM.canGo(CreepStates.MovingToRenew));
    assert.isTrue(MovingToEnergyStorageFSM.canGo(CreepStates.MovingToRenew));
    assert.isTrue(DepositingEnergyFSM.canGo(CreepStates.MovingToRenew));
    assert.isTrue(MovingToControllerFSM.canGo(CreepStates.MovingToRenew));
    assert.isTrue(UpgradingControllerFSM.canGo(CreepStates.MovingToRenew));
    assert.isTrue(MovingToRenewFSM.canGo(CreepStates.MovingToRenew));
    assert.isFalse(RenewingFSM.canGo(CreepStates.MovingToRenew));

    IdleFSM.go(CreepStates.MovingToRenew);
    MovingToEnergySourceFSM.go(CreepStates.MovingToRenew);
    HarvestingEnergyFSM.go(CreepStates.MovingToRenew);
    MovingToEnergyStorageFSM.go(CreepStates.MovingToRenew);
    DepositingEnergyFSM.go(CreepStates.MovingToRenew);
    MovingToControllerFSM.go(CreepStates.MovingToRenew);
    UpgradingControllerFSM.go(CreepStates.MovingToRenew);
    MovingToRenewFSM.go(CreepStates.MovingToRenew);

    assert.isTrue(IdleFSM.is(CreepStates.MovingToRenew));
    assert.isTrue(MovingToEnergySourceFSM.is(CreepStates.MovingToRenew));
    assert.isTrue(HarvestingEnergyFSM.is(CreepStates.MovingToRenew));
    assert.isTrue(MovingToEnergyStorageFSM.is(CreepStates.MovingToRenew));
    assert.isTrue(DepositingEnergyFSM.is(CreepStates.MovingToRenew));
    assert.isTrue(MovingToControllerFSM.is(CreepStates.MovingToRenew));
    assert.isTrue(UpgradingControllerFSM.is(CreepStates.MovingToRenew));
    assert.isTrue(MovingToRenewFSM.is(CreepStates.MovingToRenew));

    assert.isTrue(idleCreep.memory.state === CreepStates.MovingToRenew);
    assert.isTrue(movingToEnergySourceCreep.memory.state === CreepStates.MovingToRenew);
    assert.isTrue(harvestingEnergyCreep.memory.state === CreepStates.MovingToRenew);
    assert.isTrue(movingToEnergyStorageCreep.memory.state === CreepStates.MovingToRenew);
    assert.isTrue(depositingEnergyCreep.memory.state === CreepStates.MovingToRenew);
    assert.isTrue(movingToControllerCreep.memory.state === CreepStates.MovingToRenew);
    assert.isTrue(upgradingControllerCreep.memory.state === CreepStates.MovingToRenew);
    assert.isTrue(movingToRenewCreep.memory.state === CreepStates.MovingToRenew);
  });

  it("can transition from MovingToRenew -> Renewing", () => {
    assert.isTrue(MovingToRenewFSM.canGo(CreepStates.Renewing));

    MovingToRenewFSM.go(CreepStates.Renewing);

    assert.isTrue(MovingToRenewFSM.is(CreepStates.Renewing));
    assert.isTrue(movingToRenewCreep.memory.state === CreepStates.Renewing);
    assert.isDefined(movingToRenewCreep.memory.renewingStructureId === spawn.id);
  });

  it("can transition from MovingToRenew -> Idle", () => {
    assert.isTrue(MovingToRenewFSM.canGo(CreepStates.Idle));

    MovingToRenewFSM.go(CreepStates.Idle);

    assert.isTrue(MovingToRenewFSM.is(CreepStates.Idle));
    assert.isTrue(movingToRenewCreep.memory.state === CreepStates.Idle);
    assert.isDefined(movingToRenewCreep.memory.renewingStructureId === undefined);
  });

  it("can transition from Renewing -> Idle", () => {
    assert.isTrue(RenewingFSM.canGo(CreepStates.Idle));

    RenewingFSM.go(CreepStates.Idle);

    assert.isTrue(RenewingFSM.is(CreepStates.Idle));
    assert.isTrue(renewingCreep.memory.state === CreepStates.Idle);
    assert.isDefined(renewingCreep.memory.renewingStructureId === undefined);
  });

  it("should transition Idle -> MovingToEnergySource when a source is available and it is not carrying energy", () => {
    assert.isTrue(fsm.is(CreepStates.Idle));

    fsm.run();

    assert.isTrue(fsm.is(CreepStates.MovingToEnergySource));
    assert.isDefined(creep.memory.energySourceId);
    assert.isTrue(creep.memory.energySourceId === source.id);
    assert.isTrue(creep.memory.state === CreepStates.MovingToEnergySource);
  });

  it("should transition Idle -> MovingToEnergyStorage when full and storage is available", () => {
    const loadedCreep = new CreepFactory()
      .body(body)
      .carrying(RESOURCE_ENERGY, 50)
      .room(room)
      .build();
    const loadedFSM = new CreepManagerFSM(loadedCreep);

    assert.isTrue(loadedFSM.is(CreepStates.Idle));

    loadedFSM.run();

    assert.isDefined(loadedCreep.memory.energyStorageId);
    assert.isTrue(loadedCreep.memory.energyStorageId === spawn.id);
    assert.isTrue(loadedCreep.memory.state === CreepStates.MovingToEnergyStorage);
    assert.isTrue(loadedFSM.is(CreepStates.MovingToEnergyStorage));
  });

  it("should transition Idle -> MovingToController when full and storage is full", () => {
    const loadedSpawn = new SpawnFactory()
      .energy(300)
      .build();

    const loadedRoom = new RoomFactory()
      .spawns([loadedSpawn])
      .controller(controller)
      .build();

    const loadedCreep = new CreepFactory()
      .body(body)
      .carrying(RESOURCE_ENERGY, 50)
      .room(loadedRoom)
      .build();
    const loadedFSM = new CreepManagerFSM(loadedCreep);

    assert.isTrue(loadedFSM.is(CreepStates.Idle));

    loadedFSM.run();

    assert.isTrue(loadedCreep.memory.state === CreepStates.MovingToController);
    assert.isTrue(loadedFSM.is(CreepStates.MovingToController));
  });

  it("should transition from MovingToEnergySource -> Idle when no energy source is available", () => {
    const dryRoom = new RoomFactory()
      .controller(controller)
      .sources([])
      .build();

    const dryCreep = new CreepFactory()
      .carrying(RESOURCE_ENERGY, 0)
      .memory({state: CreepStates.MovingToEnergySource, energySourceId: undefined})
      .room(dryRoom)
      .build();

    const DryFSM = new CreepManagerFSM(dryCreep);

    assert.isTrue(DryFSM.is(CreepStates.MovingToEnergySource));

    DryFSM.run();

    assert.isTrue(DryFSM.is(CreepStates.Idle));
  });

  it("should not transition from MovingToEnergySource when its source is out of range", () => {
    const outOfRangeSource = new SourceFactory()
      .id("out-of-range-source")
      .pos(outOfRangePos)
      .build();
    const outOfRangeRoom = roomFactory.sources([outOfRangeSource]).build();
    const outOfRangeCreep = movingToEnergySourceCreepFactory
      .memory({
        energySourceId: outOfRangeSource.id,
        state: CreepStates.MovingToEnergySource
      })
      .room(outOfRangeRoom)
      .build();
    const outOfRangeCreepFSM = new CreepManagerFSM(outOfRangeCreep);

    RoomObjects[outOfRangeSource.id] = outOfRangeSource;

    assert.isTrue(outOfRangeCreepFSM.is(CreepStates.MovingToEnergySource));

    outOfRangeCreepFSM.run();

    assert.isTrue(outOfRangeCreepFSM.is(CreepStates.MovingToEnergySource));
    assert.isTrue(outOfRangeCreep.memory.state === CreepStates.MovingToEnergySource);
  });

  it("should transition from MovingToEnergySource -> HarvestingEnergy when its source is in range", () => {
    assert.isTrue(MovingToEnergySourceFSM.is(CreepStates.MovingToEnergySource));
    assert.isTrue(movingToEnergySourceCreep.memory.energySourceId === source.id);

    MovingToEnergySourceFSM.run();

    assert.isTrue(MovingToEnergySourceFSM.is(CreepStates.HarvestingEnergy));
    assert.isTrue(movingToEnergySourceCreep.memory.state === CreepStates.HarvestingEnergy);
  });

  it("should not transition out of HarvestingEnergy until its carryCapacity is full", () => {
    const fullCreep = harvestingEnergyCreepFactory
      .carrying(RESOURCE_ENERGY, 50)
      .build();
    const FullFSM = new CreepManagerFSM(fullCreep);

    assert.isTrue(HarvestingEnergyFSM.is(CreepStates.HarvestingEnergy));
    assert.isTrue(FullFSM.is(CreepStates.HarvestingEnergy));

    HarvestingEnergyFSM.run();
    FullFSM.run();

    assert.isTrue(HarvestingEnergyFSM.is(CreepStates.HarvestingEnergy));
    assert.isFalse(FullFSM.is(CreepStates.HarvestingEnergy));
    assert.isUndefined(fullCreep.memory.energySourceId);
  });

  it("should transition from Harvesting -> MovingToEnergyStorage when " +
    "carrying capacity is full and the Spawn is not full", () => {
    const fullCreep = harvestingEnergyCreepFactory
      .carrying(RESOURCE_ENERGY, 50)
      .build();
    const FullFSM = new CreepManagerFSM(fullCreep);

    assert.isTrue(FullFSM.is(CreepStates.HarvestingEnergy));

    FullFSM.run();

    assert.isTrue(FullFSM.is(CreepStates.MovingToEnergyStorage));
    assert.isTrue(fullCreep.memory.energyStorageId === spawn.id);

    const energyStorage = FullFSM.getEnergyStorage();

    assert.isDefined(energyStorage);
    assert.isTrue(energyStorage && energyStorage.id === spawn.id);
  });

  it("should transition from Harvesting -> MovingToController when " +
    "carrying capacity is full and there is no energy storage available", () => {

    const noEnergyStorageRoom = new RoomFactory()
      .controller(controller)
      .sources([source])
      .build();

    const noEnergyStorageCreep = harvestingEnergyCreepFactory
      .carrying(RESOURCE_ENERGY, 50)
      .room(noEnergyStorageRoom)
      .build();
    const NoEnergyStorageFSM = new CreepManagerFSM(noEnergyStorageCreep);

    assert.isTrue(NoEnergyStorageFSM.is(CreepStates.HarvestingEnergy));

    NoEnergyStorageFSM.run();

    assert.isTrue(NoEnergyStorageFSM.is(CreepStates.MovingToController));
  });

  it("should transition from Harvesting -> MovingToController when the energy storage is full", () => {
    const fullSpawn = new SpawnFactory()
      .energy(300)
      .room(room)
      .build();

    const fullRoom = new RoomFactory()
      .controller(controller)
      .sources([source])
      .spawns([fullSpawn])
      .build();

    const fullCreep = harvestingEnergyCreepFactory
      .carrying(RESOURCE_ENERGY, 50)
      .room(fullRoom)
      .build();
    const FullFSM = new CreepManagerFSM(fullCreep);

    fullSpawn.room = fullRoom;

    assert.isTrue(FullFSM.is(CreepStates.HarvestingEnergy));

    FullFSM.run();

    assert.isTrue(FullFSM.is(CreepStates.MovingToController));
    assert.isUndefined(fullCreep.memory.energySourceId);
  });

  it("should transition from MovingToEnergyStorage -> DepositingEnergy when near energy storage", () => {
    assert.isTrue(MovingToEnergyStorageFSM.is(CreepStates.MovingToEnergyStorage));

    MovingToEnergyStorageFSM.run();

    assert.isTrue(MovingToEnergyStorageFSM.is(CreepStates.DepositingEnergy));
  });

  it("should transition from MovingToEnergyStorage -> MovingToEnergyStorage when energy storage is not near", () => {
    const farSpawn = new SpawnFactory()
      .pos(outOfRangePos)
      .room(room)
      .build();
    RoomObjects[farSpawn.id] = farSpawn;

    const farRoom = new RoomFactory()
      .controller(controller)
      .sources([source])
      .spawns([farSpawn])
      .build();

    const farCreep = movingToEnergyStorageCreepFactory
      .room(farRoom)
      .build();
    const FarFSM = new CreepManagerFSM(farCreep);

    farSpawn.room = farRoom;

    assert.isTrue(FarFSM.is(CreepStates.MovingToEnergyStorage));

    FarFSM.run();

    assert.isTrue(FarFSM.is(CreepStates.MovingToEnergyStorage));
  });

  it("should transition from MovingToEnergyStorage -> MovingToController when no energy storage is available", () => {
    const dryRoom = new RoomFactory()
      .controller(controller)
      .spawns([])
      .build();

    const dryCreep = movingToEnergyStorageCreepFactory
      .body(body)
      .memory({state: CreepStates.MovingToEnergyStorage, energyStorageId: "does-not-exist"})
      .room(dryRoom)
      .build();

    MovingToEnergyStorageFSM = new CreepManagerFSM(dryCreep);

    assert.isTrue(MovingToEnergyStorageFSM.is(CreepStates.MovingToEnergyStorage));

    MovingToEnergyStorageFSM.run();

    assert.isTrue(MovingToEnergyStorageFSM.is(CreepStates.MovingToController));
  });

  it("should transition from MovingToEnergyStorage -> MovingToController when energy storage is busy", () => {
    spawn = new SpawnFactory()
      .spawning({
        name: "test-creep",
        needTime: 100,
        remainingTime: 100
      })
      .build();

    RoomObjects[spawn.id] = spawn;

    assert.isTrue(MovingToEnergyStorageFSM.is(CreepStates.MovingToEnergyStorage));

    MovingToEnergyStorageFSM.run();

    assert.isTrue(MovingToEnergyStorageFSM.is(CreepStates.MovingToController));
  });

  it("should transition from DepostingEnergy -> MovingToEnergySource when empty", () => {
    const emptyCreep = depositingEnergyCreepFactory
      .carrying(RESOURCE_ENERGY, 0)
      .build();

    DepositingEnergyFSM = new CreepManagerFSM(emptyCreep);

    assert.isTrue(DepositingEnergyFSM.is(CreepStates.DepositingEnergy));

    DepositingEnergyFSM.run();

    assert.isTrue(DepositingEnergyFSM.is(CreepStates.MovingToEnergySource));
    assert.isUndefined(emptyCreep.memory.energyStorageId);
    assert.isDefined(emptyCreep.memory.energySourceId);
  });

  it("should transition from DepositingEnergy -> MovingToController" +
    "when energy transfer target is busy", () => {
    const busySpawn = new SpawnFactory()
      .spawning({
        name: "test-creep",
        needTime: 100,
        remainingTime: 100
      })
      .build();
    RoomObjects[busySpawn.id] = busySpawn;

    const busyRoom = new RoomFactory()
      .controller(controller)
      .sources([source])
      .spawns([busySpawn])
      .build();

    const fullCreep = depositingEnergyCreepFactory
      .room(busyRoom)
      .build();
    const BusyFSM = new CreepManagerFSM(fullCreep);

    busySpawn.room = busyRoom;

    assert.isTrue(BusyFSM.is(CreepStates.DepositingEnergy));

    BusyFSM.run();

    assert.isTrue(BusyFSM.is(CreepStates.MovingToController));
  });

  it("should transition from DepostingEnergy -> MovingToController when " +
    "storage is full but creep is not empty", () => {
    const fullSpawn = new SpawnFactory()
      .energy(300)
      .room(room)
      .build();
    RoomObjects[fullSpawn.id] = fullSpawn;

    const fullRoom = new RoomFactory()
      .controller(controller)
      .sources([source])
      .spawns([fullSpawn])
      .build();

    const fullCreep = depositingEnergyCreepFactory
      .room(fullRoom)
      .build();
    const FullFSM = new CreepManagerFSM(fullCreep);

    fullSpawn.room = fullRoom;

    assert.isTrue(FullFSM.is(CreepStates.DepositingEnergy));

    FullFSM.run();

    assert.isTrue(FullFSM.is(CreepStates.MovingToController));
    assert.isUndefined(fullCreep.memory.energyStorageId);
  });

  it("should transition from DepositingEnergy -> MovingToController when" +
    "it has energy and energy storage is not available", () => {
    const dryRoom = new RoomFactory()
      .controller(controller)
      .spawns([])
      .build();

    const dryCreep = depositingEnergyCreepFactory
      .memory({state: CreepStates.DepositingEnergy, energyStorageId: "does-not-exist"})
      .room(dryRoom)
      .build();

    const DryFSM = new CreepManagerFSM(dryCreep);

    assert.isTrue(DryFSM.is(CreepStates.DepositingEnergy));

    DryFSM.run();

    assert.isTrue(DryFSM.is(CreepStates.MovingToController));
  });

  it("should transition from MovingToController -> MovingToController when controller is not in range", () => {
    controller.pos = outOfRangePos;
    room = roomFactory
      .controller(controller)
      .build();

    movingToControllerCreep = movingToControllerCreepFactory
      .room(room)
      .build();

    MovingToControllerFSM = new CreepManagerFSM(movingToControllerCreep);

    assert.isTrue(movingToControllerCreep.upgradeController(controller) === ERR_NOT_IN_RANGE);
    assert.isTrue(MovingToControllerFSM.is(CreepStates.MovingToController));

    MovingToControllerFSM.run();

    assert.isTrue(MovingToControllerFSM.is(CreepStates.MovingToController));
  });

  it("should transition from MovingToController -> UpgradingController when it is near a controller", () => {
    assert.isTrue(MovingToControllerFSM.is(CreepStates.MovingToController));

    MovingToControllerFSM.run();

    assert.isTrue(MovingToControllerFSM.is(CreepStates.UpgradingController));
  });

  it("should transition from MovingToController -> Idle if there is no controller in the room", () => {
    const dryRoom = new RoomFactory()
      .build();
    const dryCreep = movingToControllerCreepFactory
      .room(dryRoom)
      .build();
    const DryFSM = new CreepManagerFSM(dryCreep);

    assert.isTrue(DryFSM.is(CreepStates.MovingToController));

    DryFSM.run();

    assert.isTrue(DryFSM.is(CreepStates.Idle));
  });

  it("should transition from UpgradingController -> MovingToEnergySource when" +
    "it is empty and a source is available", () => {
    upgradingControllerCreep = upgradingControllerCreepFactory
      .carrying(RESOURCE_ENERGY, 0)
      .build();

    UpgradingControllerFSM = new CreepManagerFSM(upgradingControllerCreep);

    assert.isTrue(UpgradingControllerFSM.is(CreepStates.UpgradingController));

    UpgradingControllerFSM.run();

    assert.isTrue(UpgradingControllerFSM.is(CreepStates.MovingToEnergySource));
    assert.isDefined(upgradingControllerCreep.memory.energySourceId);
  });

  it("should transition from UpgradingController -> Idle" +
    "when it is out of energy and cannot find an energy source", () => {
    const dryRoom = new RoomFactory()
      .controller(controller)
      .build();
    const dryCreep = upgradingControllerCreepFactory
      .carrying(RESOURCE_ENERGY, 0)
      .room(dryRoom)
      .build();
    const DryFSM = new CreepManagerFSM(dryCreep);

    assert.isTrue(DryFSM.is(CreepStates.UpgradingController));

    DryFSM.run();

    assert.isTrue(DryFSM.is(CreepStates.Idle));
  });

  it("should transition from UpgradingController -> Idle when it cannot find a controller", () => {
    const controllerLessRoom = new RoomFactory()
      .build();
    const controllerLessCreep = upgradingControllerCreepFactory
      .room(controllerLessRoom)
      .build();
    const ControllerLessFSM = new CreepManagerFSM(controllerLessCreep);

    assert.isTrue(ControllerLessFSM.is(CreepStates.UpgradingController));

    ControllerLessFSM.run();

    assert.isTrue(ControllerLessFSM.is(CreepStates.Idle));
  });

  it("should transition form UpgradingController -> Idle when it receives a non OK result while upgrading", () => {
    const unclaimedController = new ControllerFactory().build();

    unclaimedController.my = false;

    const unclaimedRoom = new RoomFactory()
      .controller(unclaimedController)
      .build();

    const unclaimedCreep = upgradingControllerCreepFactory
      .room(unclaimedRoom)
      .build();

    const UnclaimedFSM = new CreepManagerFSM(unclaimedCreep);

    assert.isTrue(UnclaimedFSM.is(CreepStates.UpgradingController));

    UnclaimedFSM.run();

    assert.isTrue(UnclaimedFSM.is(CreepStates.Idle));
  });

  it("should transition from any state except Renewing to MovingToRenew" +
    "when time left is below renewal threshold", () => {
    spawn.pos = outOfRangePos;
    RoomObjects[spawn.id] = spawn;

    room = roomFactory
      .spawns([spawn])
      .build();

    idleCreep = idleCreepFactory
      .room(room)
      .ticksToLive(1)
      .build();
    movingToEnergySourceCreep = movingToEnergySourceCreepFactory
      .room(room)
      .ticksToLive(1)
      .build();
    harvestingEnergyCreep = harvestingEnergyCreepFactory
      .room(room)
      .ticksToLive(1)
      .build();
    movingToEnergyStorageCreep = movingToEnergyStorageCreepFactory
      .room(room)
      .ticksToLive(1)
      .build();
    depositingEnergyCreep = depositingEnergyCreepFactory
      .room(room)
      .ticksToLive(1)
      .build();
    movingToControllerCreep = movingToControllerCreepFactory
      .room(room)
      .ticksToLive(1)
      .build();
    upgradingControllerCreep = upgradingControllerCreepFactory
      .room(room)
      .ticksToLive(1)
      .build();

    IdleFSM = new CreepManagerFSM(idleCreep);
    MovingToEnergySourceFSM = new CreepManagerFSM(movingToEnergySourceCreep);
    HarvestingEnergyFSM = new CreepManagerFSM(harvestingEnergyCreep);
    MovingToEnergyStorageFSM = new CreepManagerFSM(movingToEnergyStorageCreep);
    DepositingEnergyFSM = new CreepManagerFSM(depositingEnergyCreep);
    MovingToControllerFSM = new CreepManagerFSM(movingToControllerCreep);
    UpgradingControllerFSM = new CreepManagerFSM(upgradingControllerCreep);

    IdleFSM.run();
    MovingToEnergySourceFSM.run();
    HarvestingEnergyFSM.run();
    MovingToEnergyStorageFSM.run();
    DepositingEnergyFSM.run();
    MovingToControllerFSM.run();
    UpgradingControllerFSM.run();
    MovingToRenewFSM.run();
    RenewingFSM.run();

    assert.isTrue(IdleFSM.is(CreepStates.MovingToRenew));
    assert.isTrue(MovingToEnergySourceFSM.is(CreepStates.MovingToRenew));
    assert.isTrue(HarvestingEnergyFSM.is(CreepStates.MovingToRenew));
    assert.isTrue(MovingToEnergyStorageFSM.is(CreepStates.MovingToRenew));
    assert.isTrue(DepositingEnergyFSM.is(CreepStates.MovingToRenew));
    assert.isTrue(MovingToControllerFSM.is(CreepStates.MovingToRenew));
    assert.isTrue(UpgradingControllerFSM.is(CreepStates.MovingToRenew));
    assert.isTrue(MovingToRenewFSM.is(CreepStates.MovingToRenew));
    assert.isFalse(RenewingFSM.is(CreepStates.MovingToRenew));
  });

  it("should not transition to MovingToRenew if there is no renew location available", () => {
    room = new RoomFactory()
      .build();

    creep = idleCreepFactory
      .room(room)
      .ticksToLive(1)
      .build();

    fsm = new CreepManagerFSM(creep);

    assert.isTrue(fsm.is(CreepStates.Idle));

    fsm.run();

    assert.isFalse(fsm.is(CreepStates.MovingToRenew));
  });

  it("should not transition to MovingToRenew if the creep is in the sim room", () => {
    room.name = "sim";

    creep = idleCreepFactory
      .room(room)
      .ticksToLive(1)
      .build();

    fsm = new CreepManagerFSM(creep);

    assert.isTrue(fsm.is(CreepStates.Idle));

    fsm.run();

    assert.isFalse(fsm.is(CreepStates.MovingToRenew));
  });

  it("should transition from MovingToRenew -> Renewing when it is near a renewing structure", () => {
    assert.isTrue(MovingToRenewFSM.is(CreepStates.MovingToRenew));

    MovingToRenewFSM.run();

    assert.isTrue(MovingToRenewFSM.is(CreepStates.Renewing));
  });

  it("should transition from MovingToRenew -> Idle if there is no renewing structure", () => {
    const dryRoom = new RoomFactory()
      .controller(controller)
      .build();
    const dryCreep = movingToRenewCreepFactory
      .room(dryRoom)
      .build();
    dryCreep.memory.renewingStructureId = undefined;
    const DryFSM = new CreepManagerFSM(dryCreep);

    DryFSM.run();

    assert.isTrue(DryFSM.is(CreepStates.Idle));
    assert.isUndefined(dryCreep.memory.renewingStructureId);
  });

  it("should transition from MovingToRenew -> Idle if renew location is busy", () => {
    const busySpawn = new SpawnFactory()
      .spawning({
        name: "test-creep",
        needTime: 100,
        remainingTime: 100
      })
      .build();
    RoomObjects[busySpawn.id] = busySpawn;

    const busyRoom = new RoomFactory()
      .controller(controller)
      .sources([source])
      .spawns([busySpawn])
      .build();

    const dyingCreep = movingToRenewCreepFactory
      .room(busyRoom)
      .ticksToLive(1)
      .build();
    const BusyFSM = new CreepManagerFSM(dyingCreep);

    busySpawn.room = busyRoom;

    assert.isTrue(BusyFSM.is(CreepStates.MovingToRenew));

    BusyFSM.run();

    assert.isTrue(BusyFSM.is(CreepStates.Idle));
  });

  it("should transition from Renewing -> Renewing until it is renewed", () => {
    assert.isTrue(RenewingFSM.is(CreepStates.Renewing));

    RenewingFSM.run();

    assert.isTrue(RenewingFSM.is(CreepStates.Renewing));
  });

  it("should transition from Renewing -> Idle when it is done renewing", () => {
    const renewedCreep = renewingCreepFactory
      .ticksToLive(RenewingFSM.doneRenewThreshold)
      .build();
    const RenewedCreepFSM = new CreepManagerFSM(renewedCreep);

    assert.isTrue(RenewedCreepFSM.is(CreepStates.Renewing));

    RenewedCreepFSM.run();

    assert.isTrue(RenewedCreepFSM.is(CreepStates.Idle));
  });

  it("should transition form Renewing -> Idle when there is no renewing structure available", () => {
    const dryRoom = new RoomFactory()
      .controller(controller)
      .spawns([])
      .build();

    const dryCreep = new CreepFactory()
      .body(body)
      .memory({state: CreepStates.Renewing, renewingStructureId: undefined})
      .room(dryRoom)
      .ticksToLive(1)
      .build();

    RenewingFSM = new CreepManagerFSM(dryCreep);

    assert.isTrue(RenewingFSM.is(CreepStates.Renewing));

    RenewingFSM.run();

    assert.isTrue(RenewingFSM.is(CreepStates.Idle));
  });
});
