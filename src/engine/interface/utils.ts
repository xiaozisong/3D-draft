export type ArrayToTuple<T extends readonly string[]> = [...T];


export type ArrayToUnion<T extends readonly string[]> = T[number];


export type PickMultiple<T, K extends Array<keyof T>> = Pick<T, K[number]>;