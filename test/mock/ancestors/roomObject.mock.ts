export class RoomObjectMock {
  public readonly prototype: RoomObject;
  /**
   * An object representing the position of this object in the room.
   */
  public pos: RoomPosition;
  /**
   * The link to the Room object. May be undefined in case if an object is a
   * flag or a construction site and is placed in a room that is not visible
   * to you.
   */
  public room: Room | undefined;

  constructor(obj: RoomObject) {
    _.merge(this, obj);
  }
}
