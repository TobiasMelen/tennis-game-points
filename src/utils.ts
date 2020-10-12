export const assertThisWillNeverHappen = (impossibleValue: never) => {
  throw new Error(
    `A value that should never exist had value: ${impossibleValue}`
  );
};

export const typedKeys = Object.keys as <T>(object: T) => (keyof T)[];

/** Kind of shallow compare, but discards exess props from right, so not really. */
export const sourcePropEquals = <T>(source: T, compare: T) =>
  typedKeys(source).every((key) => source[key] === compare[key]);
