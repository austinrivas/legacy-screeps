import {RoomPositionFactory} from "../roomPosition/factory.roomPosition";
import {SpawnMock} from "./spawn.mock";

/* tslint:disable:no-reference */
/// <reference path="../../../typings/globals/screeps/index.d.ts"/>
export class SpawnFactory {

  private _energy: number = 0;
  private _energyCapacity: number = 300;
  private _id: string = "spawn-1";
  private _memory: { [key: string]: any } = {};
  private _name: string = "test-spawn";
  private _pos: RoomPosition;
  private _room: Room;
  private _spawning: {
    name: string,
    needTime: number,
    remainingTime: number
  } | null = null;

  public build(): Spawn {

    if (!this._pos) {
      this._pos = new RoomPositionFactory()
        .build();
    }

    const spawn = {
      energy: this._energy,
      energyCapacity: this._energyCapacity,
      id: this._id,
      memory: this._memory,
      name: this._name,
      pos: this._pos,
      room: this._room,
      spawning: this._spawning,
    } as Spawn;

    return new SpawnMock(spawn) as Spawn;
  }

  public energy(energy: number): SpawnFactory {
    this._energy = energy;
    return this;
  }

  public energyCapacity(energyCapacity: number): SpawnFactory {
    this._energyCapacity = energyCapacity;
    return this;
  }

  public id(id: string): SpawnFactory {
    this._id = id;
    return this;
  }

  public memory(memory: { [key: string]: any }): SpawnFactory {
    this._memory = memory;
    return this;
  }

  public name(name: string): SpawnFactory {
    this._name = name;
    return this;
  }

  public pos(pos: RoomPosition): SpawnFactory {
    this._pos = pos;
    return this;
  }

  public room(room: Room): SpawnFactory {
    this._room = room;
    return this;
  }

  public spawning(spawning: {
    name: string,
    needTime: number,
    remainingTime: number
  }): SpawnFactory {
    this._spawning = spawning;
    return this;
  }
}
