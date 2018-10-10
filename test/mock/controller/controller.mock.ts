import {OwnedStructureMock} from "../ancestors/ownedStructure.mock";

export class ControllerMock extends OwnedStructureMock {
  public readonly prototype: Controller;
  public level: number;
  public pos: RoomPosition;
  public progress: number;
  public progressTotal: number;
  public reservation: ReservationDefinition;
  public room: Room;
  public safeMode: number | undefined;
  public safeModeAvailable: number;
  public safeModeCooldown: number | undefined;
  public sign: SignDefinition;
  public ticksToDowngrade: number;
  public upgradeBlocked: number;

  constructor(controller: Controller) {
    super(controller);
  }

  public activateSafeMode(): number {
    return OK;
  }

  public unclaim(): number {
    return OK;
  }
}
