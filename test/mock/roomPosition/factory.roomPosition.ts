/* tslint:disable:no-reference */
/// <reference path="../../../typings/globals/screeps/index.d.ts"/>
import {RoomPositionMock} from "./roomPosition.mock";

export class RoomPositionFactory {

  private _roomName: string = "test-room";
  private _x: number = 0;
  private _y: number = 0;

  public build(): RoomPosition {
    const pos = {
      roomName: this._roomName,
      x: this._x,
      y: this._y
    } as RoomPosition;

    return new RoomPositionMock(pos) as RoomPosition;
  }

  public roomName(roomName: string): RoomPositionFactory {
    this._roomName = roomName;
    return this;
  }

  public x(x: number): RoomPositionFactory {
    this._x = x;
    return this;
  }

  public y(y: number): RoomPositionFactory {
    this._y = y;
    return this;
  }
}
