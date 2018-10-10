let dummyCounter = 0;

export function mockUse(param: any): void {
  if (param) {
    dummyCounter++;
  }
}
