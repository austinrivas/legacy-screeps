import {StructureMock} from "./structure.mock";

export class OwnedStructureMock extends StructureMock {
  public readonly prototype: OwnedStructure;
  public my: boolean = true;
  public owner: Owner;
  public room: Room;

  constructor(owned: OwnedStructure) {
    super(owned);
  }
}
