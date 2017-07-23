import { RecursionResult } from './RecursionResult';

export interface RecursionBuilderState<K, V, O extends object> {
  yieldOn?(value: V, key: K, object: O): boolean;
  traverseOn?(value: V, key: K, object: O): boolean;
  readEntry?(object: O): Iterable<[ K, V ]>;
  readNext?(object: V|O): V|O;
}

export type ExtractedProperty<K, V, O extends object> = K | V | O | string | RecursionBuilder<K, V, O>;

const isObject = (v: any): v is object => typeof v === 'object' && v != null;

/**
 * Creates an iterable for recursively accessing an object heirarchy.
 * @export
 * @class RecursionBuilder
 * @implements {Iterable<[ K, V, string, O ]>}
 * @template K The type of the key.
 * @template V The type of the value.
 * @template O The type of the data object.
 */
export class RecursionBuilder<K = string, V = any, O extends object = object> implements Iterable<RecursionResult<K, V, O>> {
  private _yieldOn: (value: V, key: K, object: O) => boolean;
  private _traverseOn: (value: V, key: K, object: O) => boolean;
  private _readEntry: (object: O) => Iterable<[ K, V ]>;
  private _readNext?: (object: V|O) => V|O;

  /**
   * Creates an instance of RecursionBuilder.
   * @param {O} [_object] 
   * @param {RecursionBuilderState<K, V, O>} [state={}] 
   */
  constructor(
    private _object?: O, 
    state: RecursionBuilderState<K, V, O> = {}
  ) {
    this._yieldOn = state.yieldOn || (() => true);
    this._traverseOn = state.traverseOn || isObject;
    this._readEntry = state.readEntry || objectEntryReader;
    this._readNext = state.readNext;
  }

  /**
   * Sets the yield filter and returns a new RecursionBuilder. Determines whether
   * to yield the value.
   * @param {(value: V, key: K, object: O) => boolean} fn 
   * @returns {RecursionBuilder<K, V, O>} 
   */
  yieldOn(fn: (value: V, key: K, object: O) => boolean): RecursionBuilder<K, V, O> {
    return this.clone({ yieldOn: fn });
  }

  /**
   * Sets the traverse filter and returns a new RecursionBuilder. Determines whether
   * to traverse the value given.
   * @param {(value: V, key: K, object: O) => boolean} fn 
   * @returns {RecursionBuilder<K, V, O>} 
   */
  traverseOn(fn: (value: V, key: K, object: O) => boolean): RecursionBuilder<K, V, O> {
    return this.clone({ traverseOn: fn });
  }

  /**
   * Sets the read entry function and returns a new RecursionBuilder. This function
   * generates the key/value pairs of each key.
   * @param {(object: O) => Iterable<[ K, V ]>} fn 
   * @returns {RecursionBuilder<K, V, O>} 
   */
  readEntry(fn: (object: O) => Iterable<[ K, V ]>): RecursionBuilder<K, V, O> {
    return this.clone({ readEntry: fn });
  }

  /**
   * Sets the read next function and returns a new RecursionBuilder. This function
   * determines what value to read next. Useful for iterarting recursive arrays. 
   * 
   * @param {(((object: O) => O)|string)} fn 
   * @returns {RecursionBuilder<K, V, O>} 
   */
  readNext(fn: ((object: O) => O)|string): RecursionBuilder<K, V, O> {
    return this.clone({ readNext: createChildExtractor<O>(fn) });
  }

  /**
   * Recurses the data object using the configured recursion algorithm.
   * @param {O} [object] 
   * @param {string} [_path] 
   * @returns {IterableIterator<[ K, V, string, O ]>} 
   */
  * recurse(object?: O): IterableIterator<RecursionResult<K, V, O>> {
    if (!object) {
      return;
    }

    yield* this._recurse(object);
  }

  /**
   * Clones this recursion builder instance.
   * @param {RecursionBuilderState<K, V, O>} [state={}] 
   * @returns {RecursionBuilder<K, V, O>} 
   */
  clone(state: RecursionBuilderState<K, V, O> = {}): RecursionBuilder<K, V, O> {
    return RecursionBuilder.create(this._object, {
      yieldOn: this._yieldOn,
      traverseOn: this._traverseOn,
      readEntry: this._readEntry,
      readNext: this._readNext,
      ...state
    });
  }

  * [Symbol.iterator](): IterableIterator<RecursionResult<K, V, O>> {
    yield* this.recurse(this._object);
  }

  /**
   * Iterates and returns only value results.
   * @param {O} [object] 
   * @returns {IterableIterator<V>} 
   */
  * values(object?: O): IterableIterator<V> {
    yield* this.extract<V>('value', object);
  }

  /**
   * Iterates and returns only keys.
   * @param {O} [object] 
   * @returns {IterableIterator<K>} 
   */
  * keys(object?: O): IterableIterator<K> {
    yield* this.extract<K>('key', object);
  }

  /**
   * Iterates and returns only paths.
   * @param {O} [object] 
   * @returns {IterableIterator<string>} 
   */
  * paths(object?: O): IterableIterator<string> {
    yield* this.extract<string>('path', object);
  }

  /**
   * Iterates and returns only parent objects.
   * @param {O} [object] 
   * @returns {IterableIterator<string>} 
   */
  * parents(object?: O): IterableIterator<O> {
    yield* this.extract<O>('parent', object);
  }

  * extract<T extends ExtractedProperty<K, V, O>>(key: keyof RecursionResult<K, V, O>, object?: O): IterableIterator<T> {
    for (const results of this.recurse(object || this._object)) {
      yield results[key] as T;
    }
  }

  /**
   * Recurses the data object using the configured recursion algorithm.
   * @param {O} [object] 
   * @param {string} [_path] 
   * @returns {IterableIterator<[ K, V, string, O ]>} 
   */
  private * _recurse(object: O, _path?: string, lastResult?: RecursionResult<K, V, O>): IterableIterator<RecursionResult<K, V, O>> {
    for (const [ key, value ] of this._readEntry(object)) {
      const path = resolvePath(_path, key, object);
      let nextValue: any = value;
      let result: RecursionResult<K, V, O> | undefined = lastResult ? lastResult : undefined;

      if (this._yieldOn(value, key, object as O)) {
        result = new RecursionResult<K, V, O>(
          value as V, 
          key, 
          path,
          object as O,
          lastResult ? lastResult : null
        );

        yield result;
      }

      if (this._readNext) {
        nextValue = this._readNext(value);
      }

      if (this._traverseOn(nextValue, key, object)) {
        yield* this._recurse(nextValue, path, result);
      }
    }
  }

  static create<K, V, O extends object>(object?: O, state?: RecursionBuilderState<K, V, O>): RecursionBuilder<K, V, O> {
    return new RecursionBuilder(object, state);
  }
}

function createChildExtractor<O>(fn: Function|string): (value: O) => O {
  return (value: any) => {
    return typeof fn === 'string' ? isObject(value) ? (value as any)[fn] : undefined : fn(value);
  };
}

function resolvePath<K, O extends object>(path: string|undefined, key: K, value: O): string {
  return path ? Array.isArray(value) ? `${path}[${key}]` : `${path}.${key}` : key.toString();
}

function* objectEntryReader<K, V, O>(object: O & { [key: string]: any }): Iterable<[ K, V ]> {
  if (typeof object.entries === 'function') {
    yield* object.entries();
  } else {
    for (const key of Object.keys(object)) {
      yield [ key as any, object[ key ]];
    }
  }
}
