export class SourceMock {
  public readonly prototype: Source;
  public energy: number;
  public energyCapacity: number;
  public id: string;
  public pos: RoomPosition;
  public ticksToRegeneration: number | undefined;

  constructor(source: Source) {
    _.merge(this, source);
  }
}
