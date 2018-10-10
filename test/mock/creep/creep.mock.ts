import {CreepMemory} from "../../../src/components/creeps/creepManagerFSM";
import {mockUse} from "../mockHelpers";

export class CreepMock {
  public readonly prototype: Creep;
  public body: BodyPartDefinition[];
  public carry: StoreDefinition;
  public carryCapacity: number;
  public fatigue: number;
  public hits: number;
  public hitsMax: number;
  public id: string;
  public memory: CreepMemory;
  public my: boolean;
  public name: string;
  public owner: Owner;
  public pos: RoomPosition;
  public room: Room;
  public spawning: boolean;
  public saying: string;
  public ticksToLive: number;
  public transfer: ((target: Creep | Structure, resourceType: string, amount?: number) => number) | undefined;

  constructor(creep: Creep, transferTarget: string) {
    _.merge(this, creep);
    this.transfer = this._transfer.bind(this)(transferTarget);
  }

  public attack(target: Creep | Structure): number {
    mockUse(target);
    return OK;
  }

  public attackController(target: Controller): number {
    mockUse(target);
    return OK;
  }

  public build(target: ConstructionSite): number {
    mockUse(target);
    return OK;
  }

  public cancelOrder(methodName: string): number {
    mockUse(methodName);
    return OK;
  }

  public claimController(target: Controller): number {
    mockUse(target);
    return OK;
  }

  public dismantle(target: Structure): number {
    mockUse(target);
    return OK;
  }

  public drop(resourceType: string, amount?: number): number {
    mockUse(resourceType);
    mockUse(amount);
    return OK;
  }

  public generateSafeMode(target: Controller): number {
    mockUse(target);
    return OK;
  }

  public getActiveBodyparts(type: string): number {
    mockUse(type);
    return OK;
  }

  public harvest(target: Source | Mineral): number {
    if (this.pos.isNearTo(target.pos.x, target.pos.y)) {
      return OK;
    } else {
      return ERR_NOT_IN_RANGE;
    }
  }

  public heal(target: Creep): number {
    mockUse(target);
    return OK;
  }

  public move(direction: number): number {
    mockUse(direction);
    return OK;
  }

  public moveByPath(path: PathStep[] | RoomPosition[] | string): number {
    mockUse(path);
    return OK;
  }

  public moveTo(target: RoomPosition | { pos: RoomPosition; }, opts?: MoveToOpts): number {
    mockUse(target);
    mockUse(opts);
    return OK;
  }

  public notifyWhenAttacked(enabled: boolean): number {
    mockUse(enabled);
    return OK;
  }

  public pickup(target: Resource): number {
    mockUse(target);
    return OK;
  }

  public rangedAttack(target: Creep | Structure): number {
    mockUse(target);
    return OK;
  }

  public rangedHeal(target: Creep): number {
    mockUse(target);
    return OK;
  }

  public rangedMassAttack(): number {
    return OK;
  }

  public repair(target: Structure): number {
    mockUse(target);
    return OK;
  }

  public reserveController(target: Controller): number {
    mockUse(target);
    return OK;
  }

  public say(message: string, toPublic?: boolean): number {
    mockUse(message);
    mockUse(toPublic);
    return OK;
  }

  public signController(target: Controller, text: string): number {
    mockUse(target);
    mockUse(text);
    return OK;
  }

  public suicide(): number {
    return OK;
  }

  public upgradeController(target: Controller): number {
    if (target.my) {
      if (this.pos.isNearTo(target.pos.x, target.pos.y)) {
        return OK;
      } else {
        return ERR_NOT_IN_RANGE;
      }
    } else {
      return ERR_NOT_OWNER;
    }
  }

  public withdraw(target: Structure, resourceType: string, amount?: number): number {
    mockUse(target);
    mockUse(resourceType);
    mockUse(amount);
    return OK;
  }

  private _transfer(type: string):
    ((target: Creep | Structure, resourceType: string, amount?: number) => number) | undefined {
    const self = this;

    if (type === "creep") {
      return (target: Creep, resourceType: string, amount?: number): number => {
        mockUse(amount);
        if (self.pos.isNearTo(target.pos.x, target.pos.y)) {
          if (resourceType === RESOURCE_ENERGY) {
            if (target.carry && target.carry.energy && target.carry.energy < target.carryCapacity) {
              return OK;
            } else {
              return ERR_FULL;
            }
          } else {
            return ERR_INVALID_ARGS;
          }
        } else {
          return ERR_NOT_IN_RANGE;
        }
      };
    } else if (type === "spawn") {
      return (target: Spawn, resourceType: string, amount?: number): number => {
        mockUse(amount);
        if (self.pos.isNearTo(target.pos.x, target.pos.y)) {
          if (target.spawning) {
            return ERR_BUSY;
          } else {
            if (resourceType === RESOURCE_ENERGY) {
              if (target.energy < target.energyCapacity) {
                return OK;
              } else {
                return ERR_FULL;
              }
            } else {
              return ERR_INVALID_ARGS;
            }
          }
        } else {
          return ERR_NOT_IN_RANGE;
        }
      };
    }
  }
}
