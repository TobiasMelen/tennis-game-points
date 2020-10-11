export const assertThisWillNeverHappen = (impossibleValue: never) => {
  throw new Error(
    `A value that should never exist had value: ${impossibleValue}`
  );
};
