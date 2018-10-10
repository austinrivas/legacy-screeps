import {assert} from "chai";
import {EnergySourceManager} from "../../../src/components/sources/energySourceManager";
import {SourceFactory} from "../../mock/source/factory.source";

describe("EnergySourceManager", () => {

  const sourceFactory = new SourceFactory();

  before(() => {
    // runs before all tests in this block
  });

  beforeEach(() => {
    // runs before each test in this block
  });

  it("can determine its priority based on energy left and time to regeneration", () => {
    const emptySource = sourceFactory
      .energy(0)
      .build();
    const mostlyEmptySource = sourceFactory
      .energy(1000)
      .ticksToRegeneration(150)
      .build();
    const halfEmptySource = sourceFactory
      .energy(1500)
      .ticksToRegeneration(150)
      .build();
    const mostlyFullSource = sourceFactory
      .energy(2500)
      .ticksToRegeneration(150)
      .build();
    const fullSource = sourceFactory
      .ticksToRegeneration(undefined)
      .build();
    const emptySouceManager = new EnergySourceManager(emptySource);
    const mostlyEmptySourceManager = new EnergySourceManager(mostlyEmptySource);
    const halfEmptySourceManager = new EnergySourceManager(halfEmptySource);
    const mostlyFullSourceManager = new EnergySourceManager(mostlyFullSource);
    const fullSourceManager = new EnergySourceManager(fullSource);
    const emptySourcePriority = emptySouceManager.sourcePriority();
    const mostlyEmptySourcePriority = mostlyEmptySourceManager.sourcePriority();
    const halfEmptySourcePriority = halfEmptySourceManager.sourcePriority();
    const mostlyFullSourcePriority = mostlyFullSourceManager.sourcePriority();
    const fullSourcePriority = fullSourceManager.sourcePriority();

    assert.isTrue(emptySourcePriority === 0);
    assert.isTrue(Math.round(mostlyEmptySourcePriority) === 7);
    assert.isTrue(halfEmptySourcePriority === 10);
    assert.isTrue(Math.round(mostlyFullSourcePriority) === 17);
    assert.isTrue(fullSourcePriority === 10);
  });
});