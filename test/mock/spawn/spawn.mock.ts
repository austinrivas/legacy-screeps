import {OwnedStructureMock} from "../ancestors/ownedStructure.mock";
import {mockUse} from "../mockHelpers";

export class SpawnMock extends OwnedStructureMock {
  public readonly prototype: Spawn;
  public energy: number;
  public energyCapacity: number;
  public id: string;
  public memory: { [key: string]: any };
  public name: string;
  public pos: RoomPosition;
  public spawning: {
    name: string,
    needTime: number,
    remainingTime: number
  } | null;

  constructor(spawn: Spawn) {
    super(spawn);
  }

  public canCreateCreep(body: string[], name?: string): number {
    mockUse(body);
    mockUse(name);
    return OK;
  }

  public createCreep(body: string[], name?: string, memory?: any): number | string {
    mockUse(body);
    mockUse(name);
    mockUse(memory);
    return OK;
  }

  public destroy(): number {
    return OK;
  }

  public isActive(): boolean {
    return true;
  }

  public notifyWhenAttacked(enabled: boolean): number {
    mockUse(enabled);
    return OK;
  }

  public recycleCreep(target: Creep): number {
    mockUse(target);
    return OK;
  }

  public renewCreep(target: Creep): number {
    if (this.spawning) {
      return ERR_BUSY;
    } else {
      if (this.pos.isNearTo(target.pos.x, target.pos.y)) {
        return OK;
      } else {
        return ERR_NOT_IN_RANGE;
      }
    }
  }

  public transferEnergy(target: Creep, amount?: number): number {
    mockUse(target);
    mockUse(amount);
    return OK;
  }
}
