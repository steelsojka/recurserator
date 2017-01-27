type TraverseFilter<T, U> = (value: U, key: string, object: T) => boolean;
type YieldFilter<T, U> = (value: U, key: string, object: T) => boolean;
type EntryExtractor<T, U> = (object: T) => [string, U];
type ChildExtractor<T, U> = string|[string, string]|{[key: string]: any}|((object: T) => U);

type RecursionState<T, U> = {
	traverseFilter: TraverseFilter<T, U>;
	yieldFilter: YieldFilter<T, U>;
	childExtractor: any;
	entryExtractor: EntryExtractor<T, U>;
};

type RecursionResult<T, U> = [string, U, string, T];

interface Entries {
	<T, U, K>(object: T): Iterable<[K, U]>;
	<T, U>(object: T): Iterable<[any, U]>;
	<T>(object: T): Iterable<[any, any]>;

	<T, U, K>(object: { entries: () => [K, U]}): Iterable<[K, U]>;
	<T, U>(object: { entries: () => [any, U]}): Iterable<[any, U]>;
	(object: { entries: () => [any, any] }): Iterable<[any, any]>;
}

interface RecurseTree { 
	<T, U>(object: T, yieldFilter?: YieldFilter<T, U>, traverseFilter?: TraverseFilter<T, U>, entryExtractor?: EntryExtractor<T, U>): RecursionBuilder<T, U>;
	<T>(object: T, yieldFilter?: YieldFilter<T, any>, traverseFilter?: TraverseFilter<T, any>, entryExtractor?: EntryExtractor<T, any>): RecursionBuilder<T, any>;
}

interface RecurseExtract {
	<T, U>(extractor: ChildExtractor<T, U>, items: T|T[]): RecursionBuilder<T, U>;
	<T>(extractor: ChildExtractor<T, any>, items: T|T[]): RecursionBuilder<T, any>;
	(extractor: ChildExtractor<any, any>, items: any|any[]): RecursionBuilder<any, any>;
}

interface RecursionBuilderStatic {
	new (): RecursionBuilder<any, any>;
	new <T>(object?: T, state?: RecursionState<T, any>): RecursionBuilder<T, any>;
	new <T, U>(object?: T, state?: RecursionState<T, U>): RecursionBuilder<T, U>;

	create(): RecursionBuilder<any, any>;
	create<T>(object?: T, state?: RecursionState<T, any>): RecursionBuilder<T, any>;
	create<T, U>(object?: T, state?: RecursionState<T, U>): RecursionBuilder<T, U>;

	createExtractor(target: any, name: string, index: number): void;
}

interface RecursionBuilder<T, U> implements Iterable {
	[Symbol.iterator](): IterableIterator<RecursionResult<T, U>>;
	recurse(): IterableIterator<RecursionResult<T, U>>;
	recurse<R>(object: R, path?: string): IterableIterator<RecursionResult<R, U>>;
	recurse<R, W>(object: R, path?: string): IterableIterator<RecursionResult<R, W>>;

	yield(filter: YieldFilter<T, U>): RecursionBuilder<T, U>;
	traverse(filter: TraverseFilter<T, U>): RecursionBuilder<T, U>;
	entries(filter: EntryExtractor<T, U>): RecursionBuilder<T, U>;
	extractor(filter: ChildExtractor<T, U>): RecursionBuilder<T, U>;
	clone(newState?: RecursionState<T, U>): RecursionBuilder<T, U>;
	
	values<T, U>(object?: T): IterableIterator<U>;
	keys<T, U>(object?: T): IterableIterator<U>;
	paths<T, U>(object?: T): IterableIterator<U>;
	parents<T, U>(object?: T): IterableIterator<U>;
}

declare module "recurserator" {
	export const recurseTree: RecurseTree;
	export const recurseExtract: RecurseExtract;
	export const entries: Entries;
	export const RecursionBuilder: RecursionBuilderStatic;
	export default RecursionBuilderStatic;
}

declare module "recuserator/RecursionBuilder" {
	export default RecursionBuilderStatic;
}

declare module "recuserator/recurseTree" {
	export default RecurseTree;
}

declare module "recuserator/recurseExtract" {
	export default RecurseExtract;
}

declare module "recuserator/utils/entries" {
	export default Entries;
}