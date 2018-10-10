import {TypeState} from "typestate";
import * as Config from "../../config/config";
import {EnergySourceManager} from "../sources/energySourceManager";

export enum CreepStates {
  Idle,
  MovingToEnergySource,
  HarvestingEnergy,
  MovingToEnergyStorage,
  DepositingEnergy,
  MovingToController,
  UpgradingController,
  MovingToRenew,
  Renewing
}

export interface CreepMemory {
  _move: {
    dest: RoomPosition,
    time: number,
    path: string | undefined,
    room: string
  } | undefined;
  energySourceId: string | undefined;
  energyStorageId: string | undefined;
  renewingStructureId: string | undefined;
  room: string | undefined;
  state: CreepStates;
}

export const CreepInitialMemory = {
  _move: undefined,
  energySourceId: undefined,
  energyStorageId: undefined,
  renewingStructureId: undefined,
  room: undefined,
  state: CreepStates.Idle
};

export class CreepManagerFSM {
  public renewThreshold: number = Config.DEFAULT_MIN_LIFE_BEFORE_NEEDS_REFILL;
  public doneRenewThreshold: number = Config.DONE_RENEW_LIFE;

  private _creep: Creep;
  private _fsm: TypeState.FiniteStateMachine<CreepStates>;
  private _memory: CreepMemory = CreepInitialMemory;

  constructor(creep: Creep) {
    this._creep = creep;
    this._initializeMemory();
    this._initializeFSM();
  }

  public canGo(state: CreepStates): boolean {
    return this._fsm.canGo(state);
  }

  public carriedEnergy(): number {
    return _.sum(this._creep.carry);
  }

  public carryCapacity(): number {
    return this._creep.carryCapacity;
  }

  public checkForRenew() {
    if (this.needsRenew() &&
      this._creep.room.name !== "sim" &&
      !this.is(CreepStates.MovingToRenew) &&
      this.canGo(CreepStates.MovingToRenew)) {
      this.goToMovingToRenew();
    }
  }

  public DepositEnergy() {
    const carriedEnergy = this.carriedEnergy();
    if (carriedEnergy > 0) {
      const energyStorage = this.getEnergyStorage();
      if (energyStorage) {
        const result = this._creep.transfer(energyStorage, RESOURCE_ENERGY);
        if (result === ERR_FULL || result === ERR_BUSY) {
          this._setEnergyStorageId(undefined);
          this.goToMovingToController();
        }
      } else {
        this._setEnergyStorageId(undefined);
        this.goToMovingToController();
      }
    } else {
      this._setEnergyStorageId(undefined);
      this.goToMovingToEnergySource();
    }
  }

  public getCurrentState(): CreepStates {
    return this._fsm.currentState;
  }

  public go(state: CreepStates): void {
    return this._fsm.go(state);
  }

  public goToDepositingEnergy(storage: Spawn): boolean {
    this._setEnergyStorageId(storage.id);
    this._fsm.go(CreepStates.DepositingEnergy);
    return true;
  }

  public goToHarvestingEnergy(source: Source): boolean {
    this._setEnergySourceId(source.id);
    this._fsm.go(CreepStates.HarvestingEnergy);
    return true;
  }

  public goToIdle(): boolean {
    this._fsm.go(CreepStates.Idle);
    return true;
  }

  public goToMovingToController(): boolean {
    this.go(CreepStates.MovingToController);
    return true;
  }

  public goToMovingToEnergySource(): boolean {
    const source = this.findEnergySource();
    if (source) {
      this._setEnergySourceId(source.id);
      this.go(CreepStates.MovingToEnergySource);
      return true;
    } else {
      return this.goToIdle();
    }
  }

  public goToMovingToEnergyStorage(): boolean {
    const storage = this.findEnergyStorage();
    if (storage && storage.energy < storage.energyCapacity) {
      this._setEnergyStorageId(storage.id);
      this.go(CreepStates.MovingToEnergyStorage);
      return true;
    } else {
      return this.goToMovingToController();
    }
  }

  public goToMovingToRenew(): boolean {
    const renewingStructure = this.findRenewingStructure();
    if (renewingStructure) {
      this._setRenewingStructureId(renewingStructure.id);
      this.go(CreepStates.MovingToRenew);
      return true;
    } else {
      return false;
    }
  }

  public goToRenewing(renewingStructure: Spawn): boolean {
    this._setRenewingStructureId(renewingStructure.id);
    this.go(CreepStates.Renewing);
    return true;
  }

  public goToUpgradingController(): boolean {
    this.go(CreepStates.UpgradingController);
    return true;
  }

  public HarvestingEnergy() {
    const energySource = this.getEnergySource();
    const carriedEnergy = this.carriedEnergy();
    const carryCapacity = this.carryCapacity();
    if (energySource && carriedEnergy < carryCapacity) {
      this._creep.harvest(energySource);
    } else {
      this._setEnergySourceId(undefined);
      this.goToMovingToEnergyStorage();
    }
  }

  public Idle() {
    const carriedEnergy = this.carriedEnergy();
    const carryCapacity = this.carryCapacity();
    if (carriedEnergy < carryCapacity) {
      return this.goToMovingToEnergySource();
    } else if (carriedEnergy === carryCapacity) {
      return this.goToMovingToEnergyStorage();
    }
  }

  public is(state: CreepStates): boolean {
    return this._fsm.is(state);
  }

  public findController(): Controller | undefined {
    return this._creep.room.controller;
  }

  public findEnergySource(): Source | undefined {
    const energySources = this._creep.room.find<Source>(FIND_SOURCES_ACTIVE);

    return _.sortBy(energySources, (source) => {
      const sourceManager = new EnergySourceManager(source);
      return sourceManager.sourcePriority();
    })[energySources.length - 1];
  }

  public findEnergyStorage(): Spawn | undefined {
    return this.findSpawn();
  }

  public findRenewingStructure(): Spawn | undefined {
    return this.findSpawn();
  }

  public findSpawn(): Spawn | undefined {
    return this._creep.room.find<Spawn>(FIND_MY_SPAWNS)[0];
  }

  public getController(): Controller | undefined {
    return this._creep.room.controller;
  }

  public getEnergySource(): Source | null {
    const id = this._getEnergySourceId();
    return Game.getObjectById<Source>(id);
  }

  public getEnergyStorage(): Spawn | null {
    const id = this._getEnergyStorageId();
    return Game.getObjectById<Spawn>(id);
  }

  public getRenewingStructure(): Spawn | null {
    const id = this._getRenewingStructureId();
    return Game.getObjectById<Spawn>(id);
  }

  public MovingToController() {
    const controller = this.getController();
    if (controller) {
      const result = this._creep.upgradeController(controller);
      if (result === OK) {
        this.goToUpgradingController();
      } else if (result === ERR_NOT_IN_RANGE) {
        this._creep.moveTo(controller);
      }
    } else {
      this.goToIdle();
    }
  }

  public MovingToEnergySource() {
    const energySource = this.getEnergySource();
    if (energySource) {
      const result = this._creep.harvest(energySource);
      if (result === OK) {
        this.goToHarvestingEnergy(energySource);
      } else if (result === ERR_NOT_IN_RANGE) {
        this._creep.moveTo(energySource.pos);
      }
    } else {
      this.goToIdle();
    }
  }

  public MovingToEnergyStorage() {
    const energyStorage = this.getEnergyStorage();
    if (energyStorage) {
      const result = this._creep.transfer(energyStorage, RESOURCE_ENERGY);
      if (result === ERR_NOT_IN_RANGE) {
        this._creep.moveTo(energyStorage.pos);
      } else if (result === OK) {
        this.goToDepositingEnergy(energyStorage);
      } else {
        this.goToMovingToController();
      }
    } else {
      this._setEnergyStorageId(undefined);
      this.goToMovingToController();
    }
  }

  public MovingToRenew() {
    const renewingStructure = this.getRenewingStructure();
    if (renewingStructure) {
      this._creep.transfer(renewingStructure, RESOURCE_ENERGY);
      const result = renewingStructure.renewCreep(this._creep);
      if (result === ERR_NOT_IN_RANGE) {
        this._creep.moveTo(renewingStructure);
      } else if (result === OK) {
        this.goToRenewing(renewingStructure);
      } else {
        this.goToIdle();
      }
    } else {
      this.goToIdle();
    }
  }

  public needsRenew(): boolean {
    return (this._creep.room.name !== "sim" && this._creep.ticksToLive < this.renewThreshold);
  }

  public run(): void {
    this.checkForRenew();

    switch (this.getCurrentState()) {
      case CreepStates.Idle:
        this.Idle();
        break;
      case CreepStates.MovingToEnergySource:
        this.MovingToEnergySource();
        break;
      case CreepStates.HarvestingEnergy:
        this.HarvestingEnergy();
        break;
      case CreepStates.MovingToEnergyStorage:
        this.MovingToEnergyStorage();
        break;
      case CreepStates.DepositingEnergy:
        this.DepositEnergy();
        break;
      case CreepStates.MovingToController:
        this.MovingToController();
        break;
      case CreepStates.UpgradingController:
        this.UpgradingController();
        break;
      case CreepStates.MovingToRenew:
        this.MovingToRenew();
        break;
      case CreepStates.Renewing:
        this.Renewing();
        break;
    }
  }

  public Renewing() {
    const renewingStructure = this.getRenewingStructure();
    if (renewingStructure) {
      this._creep.transfer(renewingStructure, RESOURCE_ENERGY);
      renewingStructure.renewCreep(this._creep);
      if (this._creep.ticksToLive >= this.doneRenewThreshold) {
        this.goToIdle();
      }
    } else {
      this.goToIdle();
    }
  }

  public UpgradingController() {
    const controller = this.getController();
    if (controller) {
      const carriedEnergy = this.carriedEnergy();
      if (carriedEnergy > 0) {
        const result = this._creep.upgradeController(controller);
        if (result !== OK) {
          this.goToIdle();
        }
      } else {
        this.goToMovingToEnergySource();
      }
    } else {
      this.goToIdle();
    }
  }

  private _initializeMemory() {
    this._memory = this._creep.memory = _.defaults(this._creep.memory, CreepInitialMemory);
  }

  private _initializeFSM() {
    this._fsm = new TypeState.FiniteStateMachine<CreepStates>(this._getStateMemory());

    this._intoIdleTransitions();

    this._intoMovingToEnergySourceTranstions();

    this._intoHarvestingEnergyTransitions();

    this._intoMovingToEnergyStorageTransitions();

    this._intoDepositingEnergyTransitions();

    this._intoMovingToControllerTransitions();

    this._intoUpgradingControllerTransitions();

    this._intoMovingToRenewTransitions();

    this._intoRenewingTransitions();
  }

  private _intoDepositingEnergyTransitions() {
    this._fsm.on(CreepStates.DepositingEnergy, () => {
      this._setStateMemory(CreepStates.DepositingEnergy);
    });
    this._fsm.from(CreepStates.MovingToEnergyStorage).to(CreepStates.DepositingEnergy);
  }

  private _intoHarvestingEnergyTransitions() {
    this._fsm.on(CreepStates.HarvestingEnergy, () => {
      this._setStateMemory(CreepStates.HarvestingEnergy);
    });
    this._fsm.from(CreepStates.MovingToEnergySource).to(CreepStates.HarvestingEnergy);
  }

  private _intoIdleTransitions() {
    this._fsm.on(CreepStates.Idle, () => {
      const memory = _.defaults<CreepMemory>({state: CreepStates.Idle}, CreepInitialMemory);
      this._setCreepMemory(memory);
    });
    this._fsm.from(CreepStates.MovingToEnergySource).to(CreepStates.Idle);
    this._fsm.from(CreepStates.MovingToController).to(CreepStates.Idle);
    this._fsm.from(CreepStates.UpgradingController).to(CreepStates.Idle);
    this._fsm.from(CreepStates.MovingToRenew).to(CreepStates.Idle);
    this._fsm.from(CreepStates.Renewing).to(CreepStates.Idle);
  }

  private _intoMovingToControllerTransitions() {
    this._fsm.on(CreepStates.MovingToController, () => {
      this._setStateMemory(CreepStates.MovingToController);
    });
    this._fsm.from(CreepStates.MovingToEnergyStorage).to(CreepStates.MovingToController);
    this._fsm.from(CreepStates.HarvestingEnergy).to(CreepStates.MovingToController);
    this._fsm.from(CreepStates.DepositingEnergy).to(CreepStates.MovingToController);
    this._fsm.from(CreepStates.Idle).to(CreepStates.MovingToController);
  }

  private _intoMovingToEnergyStorageTransitions() {
    this._fsm.on(CreepStates.MovingToEnergyStorage, () => {
      this._setStateMemory(CreepStates.MovingToEnergyStorage);
    });
    this._fsm.from(CreepStates.HarvestingEnergy).to(CreepStates.MovingToEnergyStorage);
    this._fsm.from(CreepStates.Idle).to(CreepStates.MovingToEnergyStorage);
  }

  private _intoMovingToEnergySourceTranstions() {
    this._fsm.on(CreepStates.MovingToEnergySource, () => {
      this._setStateMemory(CreepStates.MovingToEnergySource);
    });
    this._fsm.from(CreepStates.DepositingEnergy).to(CreepStates.MovingToEnergySource);
    this._fsm.from(CreepStates.Idle).to(CreepStates.MovingToEnergySource);
    this._fsm.from(CreepStates.UpgradingController).to(CreepStates.MovingToEnergySource);
    this._fsm.from(CreepStates.Idle).to(CreepStates.MovingToEnergySource);
  }

  private _intoMovingToRenewTransitions() {
    this._fsm.on(CreepStates.MovingToRenew, () => {
      this._setStateMemory(CreepStates.MovingToRenew);
    });
    this._fsm.from(CreepStates.DepositingEnergy).to(CreepStates.MovingToRenew);
    this._fsm.from(CreepStates.HarvestingEnergy).to(CreepStates.MovingToRenew);
    this._fsm.from(CreepStates.Idle).to(CreepStates.MovingToRenew);
    this._fsm.from(CreepStates.MovingToController).to(CreepStates.MovingToRenew);
    this._fsm.from(CreepStates.MovingToEnergyStorage).to(CreepStates.MovingToRenew);
    this._fsm.from(CreepStates.MovingToEnergySource).to(CreepStates.MovingToRenew);
    this._fsm.from(CreepStates.UpgradingController).to(CreepStates.MovingToRenew);
  }

  private _intoRenewingTransitions() {
    this._fsm.on(CreepStates.Renewing, () => {
      this._setStateMemory(CreepStates.Renewing);
    });
    this._fsm.from(CreepStates.MovingToRenew).to(CreepStates.Renewing);
  }

  private _intoUpgradingControllerTransitions() {
    this._fsm.on(CreepStates.UpgradingController, () => {
      this._setStateMemory(CreepStates.UpgradingController);
    });
    this._fsm.from(CreepStates.MovingToController).to(CreepStates.UpgradingController);
  }

  private _getEnergySourceId(): string | undefined {
    return this._memory.energySourceId;
  }

  private _getEnergyStorageId(): string | undefined {
    return this._memory.energyStorageId;
  }

  private _getRenewingStructureId(): string | undefined {
    return this._memory.renewingStructureId;
  }

  private _getStateMemory(): CreepStates {
    return this._memory.state;
  }

  private _setEnergySourceId(id: string | undefined) {
    this._memory.energySourceId = id;
    this._setCreepMemory(this._memory);
  }

  private _setEnergyStorageId(id: string | undefined) {
    this._memory.energyStorageId = id;
    this._setCreepMemory(this._memory);
  }

  private _setRenewingStructureId(id: string | undefined) {
    this._memory.renewingStructureId = id;
    this._setCreepMemory(this._memory);
  }

  private _setStateMemory(state: CreepStates) {
    this._memory.state = state;
    this._setCreepMemory(this._memory);
  }

  private _setCreepMemory(memory: CreepMemory) {
    this._creep.memory = memory;
  }
}
