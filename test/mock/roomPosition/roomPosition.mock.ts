import {mockUse} from "../mockHelpers";

export class RoomPositionMock {
  public readonly prototype: RoomPosition;
  public roomName: string;
  public x: number;
  public y: number;

  constructor(pos: RoomPosition) {
    _.merge(this, pos);
  }

  public createConstructionSite(structureType: string): number {
    mockUse(structureType);
    return OK;
  }

  public createFlag(name?: string, color?: number, secondaryColor?: number): number {
    mockUse(name);
    mockUse(color);
    mockUse(secondaryColor);
    return OK;
  }

  public findClosestByPath<T>(objects: T[] | RoomPosition[],
                              opts?: FindPathOpts & { filter?: any | string; algorithm?: string; }): T {
    mockUse(objects);
    mockUse(opts);
    return {} as T;
  }

  public findClosestByRange<T>(objects: T[] | RoomPosition[], opts?: { filter: any | string; }): T {
    mockUse(objects);
    mockUse(opts);
    return {} as T;
  }

  public findInRange<T>(objects: T[] | RoomPosition[], range: number, opts?: { filter?: any | string; }): T[] {
    mockUse(objects);
    mockUse(range);
    mockUse(opts);
    return [];
  }

  public findPathTo(target: RoomPosition | { pos: RoomPosition; }, opts?: FindPathOpts): PathStep[] {
    mockUse(target);
    mockUse(opts);
    return [];
  }

  public getDirectionTo(target: RoomPosition | { pos: RoomPosition; }): number {
    mockUse(target);
    return OK;
  }

  public getRangeTo(target: RoomPosition | { pos: RoomPosition; }): number {
    mockUse(target);
    return OK;
  }

  public inRangeTo(target: RoomPosition | { pos: RoomPosition; }, range: number): boolean {
    mockUse(target);
    mockUse(range);
    return true;
  }

  public isEqualTo(target: RoomPosition | { pos: RoomPosition; }): boolean {
    mockUse(target);
    return true;
  }

  public isNearTo(x: number, y: number): boolean {
    return x === this.x && y === this.y;
  }

  public look(): LookAtResult[] {
    return [];
  }

  public lookFor<T>(type: string): T[] {
    mockUse(type);
    return [];
  }
}
