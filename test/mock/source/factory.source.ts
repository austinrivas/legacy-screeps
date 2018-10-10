import {RoomPositionFactory} from "../roomPosition/factory.roomPosition";
import {SourceMock} from "./source.mock";

/* tslint:disable:no-reference */
/// <reference path="../../../typings/globals/screeps/index.d.ts"/>
export class SourceFactory {

  private _energy: number = 3000;
  private _energyCapacity: number = 3000;
  private _id: string = "test-id";
  private _room: Room;
  private _pos: RoomPosition;
  private _ticksToRegeneration: number | undefined = 300;

  public build(): Source {

    if (!this._pos) {
      const roomName = this._room ? this._room.name : "test-room";
      this._pos = new RoomPositionFactory()
        .roomName(roomName)
        .build();
    }

    const source = {
      energy: this._energy,
      energyCapacity: this._energyCapacity,
      id: this._id,
      pos: this._pos,
      room: this._room,
      ticksToRegeneration: this._ticksToRegeneration,
    } as Source;

    return new SourceMock(source) as Source;
  }

  public energy(energy: number): SourceFactory {
    this._energy = energy;
    return this;
  }

  public energyCapacity(energyCapacity: number): SourceFactory {
    this._energyCapacity = energyCapacity;
    return this;
  }

  public id(id: string): SourceFactory {
    this._id = id;
    return this;
  }

  public pos(pos: RoomPosition): SourceFactory {
    this._pos = pos;
    return this;
  }

  public room(room: Room): SourceFactory {
    this._room = room;
    return this;
  }

  public ticksToRegeneration(ticksToRegeneration: number | undefined): SourceFactory {
    this._ticksToRegeneration = ticksToRegeneration;
    return this;
  }
}
