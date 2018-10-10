export class EnergySourceManager {
  private _source: Source;

  constructor(source: Source) {
    this._source = source;
  }

  /**
   * Returns a numerical priority for an energySource based on energy available and regenerate time
   *
   * @returns {number}
   */
  public sourcePriority(): number {
    let priority;
    if (this._source.ticksToRegeneration === undefined) {
      priority = 10;
    } else if (this._source.energy === 0) {
      priority = 0;
    } else {
      priority = this._source.energy / this._source.ticksToRegeneration;
    }
    if (priority > 0 && this._source.ticksToRegeneration < 150) {
      priority = priority * (1 + (150 - this._source.ticksToRegeneration) / 250);
      if (this._source.ticksToRegeneration < 70) {
        priority = priority + (70 - this._source.ticksToRegeneration) / 10;
      }
    }
    return priority;
  }
}
