export interface RecursionBuilderState<K, V, O extends object> {
  yieldOn?(value: V, key: K, object: O): boolean;
  traverseOn?(value: V, key: K, object: O): boolean;
  readEntry?(object: O): Iterable<[ K, V ]>;
  readNext?(object: V|O): V|O;
}

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
export class RecursionBuilder<K = string, V = any, O extends object = object> implements Iterable<[ K, V, string, O ]> {
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
  * recurse(object?: O, _path?: string): IterableIterator<[ K, V, string, O ]> {
    if (!object) {
      return;
    }

    for (const [ key, value ] of this._readEntry(object)) {
      const path = resolvePath(_path, key, object);
      let child;

      if (this._yieldOn(value, key, object as O)) {
        yield [ key, value as V, path, object as O];
      }

      if (this._readNext) {
        child = this._readNext(value);
      }

      const nextValue = (child || value) as any;

      if (this._traverseOn(nextValue, key, object)) {
        yield* this.recurse(nextValue, path);
      }
    }
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

  * [Symbol.iterator](): IterableIterator<[ K, V, string, O]> {
    yield* this.recurse(this._object);
  }

  /**
   * Iterates and returns only value results.
   * @param {O} [object] 
   * @returns {IterableIterator<V>} 
   */
  * values(object?: O): IterableIterator<V> {
    yield* this._extractPropAtIndex(object, 1) as IterableIterator<V>;
  }

  /**
   * Iterates and returns only keys.
   * @param {O} [object] 
   * @returns {IterableIterator<K>} 
   */
  * keys(object?: O): IterableIterator<K> {
    yield* this._extractPropAtIndex(object, 0) as IterableIterator<K>;
  }

  /**
   * Iterates and returns only paths.
   * @param {O} [object] 
   * @returns {IterableIterator<string>} 
   */
  * paths(object?: O): IterableIterator<string> {
    yield* this._extractPropAtIndex(object, 2) as IterableIterator<string>;
  }

  /**
   * Iterates and returns only parent objects.
   * @param {O} [object] 
   * @returns {IterableIterator<string>} 
   */
  * parents(object?: O): IterableIterator<O> {
    yield* this._extractPropAtIndex(object, 3) as IterableIterator<O>;
  }

  private * _extractPropAtIndex(object: O|undefined, index: number): IterableIterator<K|V|O|string> {
    for (const results of this.recurse(object || this._object)) {
      yield results[index];
    }
  }

  static create<K, V, O extends object>(object?: O, state?: RecursionBuilderState<K, V, O>): RecursionBuilder<K, V, O> {
    return new RecursionBuilder(object, state);
  }
}

function createChildExtractor<O>(fn: Function|string): (value: O) => O {
  return (value: any) => {
    return typeof fn === 'string' ? value[fn] : fn(value);
  };
}

function resolvePath<K, O extends object>(path: string|undefined, key: K, value: O): string {
  return path ? Array.isArray(value) ? `${path}[${key}]` : `${path}.${key}` : key.toString();
}

function* objectEntryReader<K, V>(object: { [ key: string ]: any }): IterableIterator<[ K, V ]> {
  if (typeof object.entries === 'function') {
    yield* object.entries();
  } else {
    for (const key of Object.keys(object)) {
      yield [ key as any, object[ key ]];
    }
  }
}
