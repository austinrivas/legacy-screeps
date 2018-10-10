import {RoomPositionFactory} from "../roomPosition/factory.roomPosition";
import {ControllerMock} from "./controller.mock";

/* tslint:disable:no-reference */
/// <reference path="../../../typings/globals/screeps/index.d.ts"/>
export class ControllerFactory {

  private _level: number = 1;
  private _pos: RoomPosition;
  private _progress: number;
  private _progressTotal: number;
  private _reservation: ReservationDefinition;
  private _room: Room;
  private _safeMode: number | undefined;
  private _safeModeAvailable: number;
  private _safeModeCooldown: number | undefined;
  private _sign: SignDefinition;
  private _ticksToDowngrade: number;
  private _upgradeBlocked: number;

  public build(): Controller {

    if (!this._pos) {
      this._pos = new RoomPositionFactory()
        .build();
    }

    const controller = {
      level: this._level,
      pos: this._pos,
      progress: this._progress,
      progressTotal: this._progressTotal,
      reservation: this._reservation,
      room: this._room,
      safeMode: this._safeMode,
      safeModeAvailable: this._safeModeAvailable,
      safeModeCooldown: this._safeModeCooldown,
      sign: this._sign,
      ticksToDowngrade: this._ticksToDowngrade,
      upgradeBlocked: this._upgradeBlocked
    } as Controller;

    return new ControllerMock(controller) as Controller;
  }

  public pos(pos: RoomPosition): ControllerFactory {
    this._pos = pos;
    return this;
  }

  public room(room: Room): ControllerFactory {
    this._room = room;
    return this;
  }
}
