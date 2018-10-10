import {mockUse} from "../mockHelpers";
import {RoomObjectMock} from "./roomObject.mock";

export class StructureMock extends RoomObjectMock {
  public readonly prototype: Structure;
  /**
   * The current amount of hit points of the structure.
   */
  public readonly hits: number;
  /**
   * The total amount of hit points of the structure.
   */
  public hitsMax: number;
  /**
   * One of the STRUCTURE_* constants.
   */
  public structureType: string;

  constructor(structure: Structure) {
    super(structure);
  }
  /**
   * Destroy this structure immediately.
   */
  public destroy(): number {
    return OK;
  }
  /**
   * Check whether this structure can be used. If the room controller level is not enough,
   * then this method will return false, and the structure will be highlighted with red in the game.
   */
  public isActive(): boolean {
    return true;
  }
  /**
   * Toggle auto notification when the structure is under attack.
   * The notification will be sent to your account email. Turned on by default.
   * @param enabled Whether to enable notification or disable.
   */
  public notifyWhenAttacked(enabled: boolean): number {
    mockUse(enabled);
    return OK;
  }
}
