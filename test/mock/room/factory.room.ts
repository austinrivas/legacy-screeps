import {RoomMock} from "./room.mock";

/* tslint:disable:no-reference */

/// <reference path="../../../typings/globals/screeps/index.d.ts"/>
export class RoomFactory {

  private _controller: Controller | undefined;
  private _creeps: Creep[] = [];
  private _energyAvailable: number = 0;
  private _energyCapacityAvailable: number = 0;
  private _sources: Source[] = [];
  private _spawns: StructureSpawn[] = [];
  private _memory: {[key: string]: any} = {};
  private _mode: string = "test-mode";
  private _name: string = "test-room";
  private _storage: StructureStorage | undefined;
  private _terminal: Terminal | undefined;
  private _visual: RoomVisual;

  public build(): Room {
    const room = {
      controller: this._controller,
      energyAvailable: this._energyAvailable,
      energyCapacityAvailable: this._energyCapacityAvailable,
      memory: this._memory,
      mode: this._mode,
      name: this._name,
      storage: this._storage,
      terminal: this._terminal
    } as Room;

    return new RoomMock(room, this._creeps, this._sources, this._spawns) as Room;
  }

  public controller(controller: Controller | undefined): RoomFactory {
    this._controller = controller;
    return this;
  }

  public creeps(creeps: Creep[]): RoomFactory {
    this._creeps = creeps;
    return this;
  }

  public mode(mode: string): RoomFactory {
    this._mode = mode;
    return this;
  }

  public name(name: string): RoomFactory {
    this._name = name;
    return this;
  }

  public sources(sources: Source[]): RoomFactory {
    this._sources = sources;
    return this;
  }

  public spawns(spawns: Spawn[]): RoomFactory {
    this._spawns = spawns;
    return this;
  }

  public storage(storage: StructureStorage | undefined): RoomFactory {
    this._storage = storage;
    return this;
  }

  public terminal(terminal: Terminal | undefined): RoomFactory {
    this._terminal = terminal;
    return this;
  }

  public visual(visual: RoomVisual): RoomFactory {
    this._visual = visual;
    return this;
  }
}
