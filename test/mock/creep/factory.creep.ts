import * as _ from "lodash";
import {CreepInitialMemory, CreepMemory} from "../../../src/components/creeps/creepManagerFSM";
import {RoomPositionFactory} from "../roomPosition/factory.roomPosition";
import {CreepMock} from "./creep.mock";

export class CreepFactory {
  private _body: BodyPartDefinition[];
  private _carry: StoreDefinition;
  private _carryCapacity: number;
  private _fatigue: number;
  private _hits: number;
  private _hitsMax: number;
  private _id: string;
  private _memory: CreepMemory = CreepInitialMemory;
  private _my: boolean;
  private _name: string = "test-creep";
  private _owner: Owner;
  private _pos: RoomPosition;
  private _room: Room;
  private _spawning: boolean;
  private _saying: string;
  private _ticksToLive: number;
  private _transferTarget: string = "spawn";
  private _x: number = 0;
  private _y: number = 0;

  public build(): Creep {

    this._memory.room = this._room ? this._room.name : "test-room";

    if (!this._carryCapacity && _.isArray(this._body)) {
      this._carryCapacity = _.filter(this._body, (p: any) => p === CARRY).length * CARRY_CAPACITY;
    }

    this._pos = new RoomPositionFactory()
      .x(this._x)
      .y(this._y)
      .roomName(this._memory.room)
      .build();

    const creep = {
      body: this._body,
      carry: this._carry,
      carryCapacity: this._carryCapacity,
      fatigue: this._fatigue,
      hits: this._hits,
      hitsMax: this._hitsMax,
      id: this._id,
      memory: this._memory,
      my: this._my,
      name: this._name,
      owner: this._owner,
      pos: this._pos,
      room: this._room,
      saying: this._saying,
      spawning: this._spawning,
      ticksToLive: this._ticksToLive
    } as Creep;

    return new CreepMock(creep, this._transferTarget) as Creep;
  }

  public body(body: any): CreepFactory {
    this._body = body;
    return this;
  }

  public carrying(type: StoreDefinition | string, amount?: number): CreepFactory {
    if (!amount) {
      this._carry = type as StoreDefinition;
    } else if (typeof type === "string") {
      const c: any = {};
      c[type] = amount;
      this._carry = c as StoreDefinition;
    }
    return this;
  }

  public carryCapacity(capactiy: number): CreepFactory {
    this._carryCapacity = capactiy;
    return this;
  }

  public fatigue(fatigue: number): CreepFactory {
    this._fatigue = fatigue;
    return this;
  }

  public hits(hits: number): CreepFactory {
    this._hits = hits;
    return this;
  }

  public hitsMax(hitsMax: number): CreepFactory {
    this._hitsMax = hitsMax;
    return this;
  }

  public id(id: string): CreepFactory {
    this._id = id;
    return this;
  }

  public memory(memory: { [key: string]: any }): CreepFactory {
    this._memory = _.defaults(memory, this._memory);
    return this;
  }

  public my(my: boolean): CreepFactory {
    this._my = my;
    return this;
  }

  public name(name: string): CreepFactory {
    this._name = name;
    return this;
  }

  public owner(owner: Owner): CreepFactory {
    this._owner = owner;
    return this;
  }

  public pos(x: number, y: number): CreepFactory {
    this._x = x;
    this._y = y;
    return this;
  }

  public room(room: Room): CreepFactory {
    this._room = room;
    return this;
  }

  public spawning(spawning: boolean): CreepFactory {
    this._spawning = spawning;
    return this;
  }

  public saying(saying: string): CreepFactory {
    this._saying = saying;
    return this;
  }

  public ticksToLive(ticksToLive: number): CreepFactory {
    this._ticksToLive = ticksToLive;
    return this;
  }

  public transferTarget(type: string): CreepFactory {
    this._transferTarget = type;
    return this;
  }
}
