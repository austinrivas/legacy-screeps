import {mockUse} from "../mockHelpers";

export class RoomMock {
  public readonly prototype: Room;
  public controller: Controller | undefined;
  public creeps: Creep[];
  public energyAvailable: number;
  public energyCapacityAvailable: number;
  public find: (type: number, opts?: { filter: object | Function | string; }) => Creep[] | Source[] | StructureSpawn[];
  public memory: {[key: string]: any};
  public mode: string;
  public name: string;
  public sources: Source[];
  public spawns: StructureSpawn[];
  public storage: StructureStorage | undefined;
  public terminal: Terminal | undefined;
  public visual: RoomVisual;

  constructor(room: Room, creeps: Creep[], sources: Source[], spawns: Spawn[]) {
    _.merge(this, room);
    this.find = this._find(creeps, sources, spawns);
  }

  public createConstructionSite(pos: RoomPosition | { pos: RoomPosition; }, structureType: string): number {
    mockUse(pos);
    mockUse(structureType);
    return OK;
  }

  public createFlag(pos: RoomPosition | { pos: RoomPosition; },
                    name?: string, color?: number, secondaryColor?: number): number {
    mockUse(name);
    mockUse(color);
    mockUse(secondaryColor);
    mockUse(pos);
    return OK;
  }

  public findExitTo(room: string | Room): number {
    mockUse(room);
    return ERR_NO_PATH;
  }

  public findPath(fromPos: RoomPosition, toPos: RoomPosition, opts?: FindPathOpts): PathStep[] {
    mockUse(fromPos);
    mockUse(toPos);
    mockUse(opts);
    return [];
  }

  public getPositionAt(x: number, y: number): RoomPosition | null {
    mockUse(x);
    mockUse(y);
    return null;
  }

  public lookAt(target: RoomPosition | { pos: RoomPosition; }): LookAtResult[] {
    mockUse(target);
    return [];
  }

  public lookAtArea(top: number, left: number, bottom: number,
                    right: number, asArray?: boolean): LookAtResultMatrix | LookAtResultWithPos[] {
    mockUse(top);
    mockUse(left);
    mockUse(bottom);
    mockUse(right);
    mockUse(asArray);
    return {};
  }

  public lookForAt<T>(type: string, target: RoomPosition | { pos: RoomPosition; }): T[] {
    mockUse(type);
    mockUse(target);
    return [];
  }

  public lookForAtArea(type: string, top: number, left: number,
                       bottom: number, right: number, asArray?: boolean): LookAtResultMatrix | LookAtResultWithPos[] {
    mockUse(type);
    mockUse(top);
    mockUse(left);
    mockUse(bottom);
    mockUse(right);
    mockUse(asArray);
    return [];
  }

  private _find(creeps: Creep[], sources: Source[], spawns: StructureSpawn[]):
  (type: number, opts?: { filter: Object | Function | string; }) => Creep[] | Source[] | StructureSpawn[] {
    return (type: number, opts?: { filter: object | Function | string; }): Creep[] | Source[] | StructureSpawn[] => {
      mockUse(opts);
      if (type === FIND_MY_CREEPS) {
        return creeps;
      } else if (type === FIND_SOURCES_ACTIVE) {
        return sources;
      } else if (FIND_MY_SPAWNS) {
        return spawns;
      } else  {
        return [];
      }
    };
  }
}
