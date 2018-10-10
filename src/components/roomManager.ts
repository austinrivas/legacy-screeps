import {CreepManagerFSM} from "./creeps/creepManagerFSM";

export class RoomManager {

  private _creeps: Creep[];
  private _creepCount: number;
  private _room: Room;
  private _spawns: Spawn[];

  constructor(room: Room) {
    this._room = room;
    this._creeps = room.find<Creep>(FIND_MY_CREEPS);
    this._creepCount = _.size(this._creeps);
    this._spawns = room.find<Spawn>(FIND_MY_SPAWNS);
  }

  public creepCount(): number {
    return this._room.find<Creep>(FIND_MY_CREEPS).length;
  }

  /**
   * Initialization scripts for CreepManager module.
   */
  public run(): void {

    this.buildMissingCreeps(this._room, this._creeps);

    _.each(this._creeps, (creep: Creep) => {
      if (this._room.name !== "test-room") {
        const fsm = new CreepManagerFSM(creep);
        fsm.run();
      }
    });

    this.cleanupCreepMemory();
  }

  /**
   * Clears any non-existing creep memory.
   *
   */
  private cleanupCreepMemory(): void {
    for (const name in Memory.creeps) {
      if (!Game.creeps[name]) {
        delete Memory.creeps[name];
      }
    }
  }

  /**
   * Creates a new creep if we still have enough space.
   *
   * @param {Room} room
   * @param {Creep[]} creeps
   */
  private buildMissingCreeps(room: Room, creeps: Creep[]): void {
    let bodyParts: string[];

    if (creeps.length < 10) {
      if (creeps.length < 1 || room.energyCapacityAvailable <= 800) {
        bodyParts = [WORK, WORK, CARRY, MOVE];
      } else if (room.energyCapacityAvailable > 800) {
        bodyParts = [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
      }

      _.each(this._spawns, (spawn: Spawn) => {
        this.spawnCreep(spawn, bodyParts);
      });
    }
  }

  /**
   * Spawns a new creep.
   *
   * @param {Spawn} spawn
   * @param {string[]} bodyParts
   * @param {string} role
   * @returns
   */
  private spawnCreep(spawn: Spawn, bodyParts: string[]) {
    const uuid: number = Memory.uuid;
    let status: number | string = spawn.canCreateCreep(bodyParts, undefined);

    const properties: { [key: string]: any } = {
      room: spawn.room.name
    };

    status = _.isString(status) ? OK : status;
    if (status === OK) {
      Memory.uuid = uuid + 1;
      const creepName: string = spawn.room.name + " - " + uuid;

      status = spawn.createCreep(bodyParts, creepName, properties);

      return _.isString(status) ? OK : status;
    } else {
      return status;
    }
  }
}
