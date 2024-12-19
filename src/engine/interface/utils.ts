export type ArrayToTuple<T extends readonly string[]> = [...T];


export type ArrayToUnion<T extends readonly string[]> = T[number];


export type PickMultiple<T, K extends Array<keyof T>> = Pick<T, K[number]>;

// 接收string值，得出string类型
export type StringToType<T extends string> = T extends 'number' ? number : 
  T extends 'string' ? string :
  T extends 'boolean' ? boolean:
  unknown;

type TypeMap = {
  number: number;
  string: string;
  boolean: boolean;
}

// 运行时通过字符串获取类型
export function getTypeByString<T extends keyof TypeMap>(type: T): TypeMap[T] {
  if (type === 'number') {
    return 0 as TypeMap[T];
  } else if (type === 'string') {
    return '' as TypeMap[T];
  } else if (type === 'boolean') {
    return false as TypeMap[T];
  }
  throw new Error('Unsupported type');
}