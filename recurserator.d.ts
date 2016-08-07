interface Ientries {
  (obj: {[key: string]: any}): Iterator<[string, any]>;
  (obj: { entries: () => Iterator<[any, any]>}): Iterator<[any, any]>;
}

interface IRecursionBuilder<U extends Object> {
  recurse<T extends Object>(obj: T|U, path?: string): Iterator<[any, any, string, T|U]>;
  yield(filter: (val: any, key: any, obj: any) => boolean): IRecursionBuilder<U>;
  traverse(filter: (val: any, key: any, obj: any) => boolean): IRecursionBuilder<U>;
  entries(extractor: (val: any, key: any, obj: any) => [any, any]): IRecursionBuilder<U>;
  extractor(extractor: any): IRecursionBuilder<U>;
  clone(state?: {[key: string]: any})
  [Symbol.iterator](): Iterator<[any, any, string, U]>;
}

interface IRecursionBuilderStatic {
  new <T extends Object>(obj: T, state: any): IRecursionBuilder<T>;
  create<T extends Object>(object: T, state?: {[key: string]: any}): IRecursionBuilder<T>;
  createExtractor<T extends Object>(target: T, name: string, index: number): void;
}

declare module "recurserator" {
  export var entries: Ientries;
  export var RecursionBuilder: IRecursionBuilderStatic;
  export default IRecursionBuilderStatic;
}

declare module "recurserator/entries" {
  export default Ientries;
}

declare module "recurserator/RecursionBuilder" {
  export default IRecursionBuilderStatic;
}
