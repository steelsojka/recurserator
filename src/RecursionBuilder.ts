export interface RecursionBuilderState<K, V, O extends object> {
  yieldOn?(value: V, key: K, object: O): boolean;
  traverseOn?(value: V, key: K, object: O): boolean;
  readEntry?(object: O): Iterable<[ K, V ]>;
  readChild?(object: V|O): V|O;
}

const isObject = (v: any): v is object => typeof v === 'object' && v != null;

export class RecursionBuilder<K = string, V = any, O extends object = object> implements Iterable<[ K, V, string, O ]> {
  private _yieldOn: (value: V, key: K, object: O) => boolean;
  private _traverseOn: (value: V, key: K, object: O) => boolean;
  private _readEntry: (object: O) => Iterable<[ K, V ]>;
  private _readChild?: (object: V|O) => V|O;

  constructor(
    private _object?: O, 
    state: RecursionBuilderState<K, V, O> = {}
  ) {
    this._yieldOn = state.yieldOn || (() => true);
    this._traverseOn = state.traverseOn || isObject;
    this._readEntry = state.readEntry || objectEntryReader;
    this._readChild = state.readChild;
  }

  yieldOn(fn: (value: V, key: K, object: O) => boolean): RecursionBuilder<K, V, O> {
    return this.clone({ yieldOn: fn });
  }

  traverseOn(fn: (value: V, key: K, object: O) => boolean): RecursionBuilder<K, V, O> {
    return this.clone({ traverseOn: fn });
  }

  readEntry(fn: (object: O) => Iterable<[ K, V ]>): RecursionBuilder<K, V, O> {
    return this.clone({ readEntry: fn });
  }

  readChild(fn: ((object: O) => O)|string): RecursionBuilder<K, V, O> {
    return this.clone({ readChild: createChildExtractor<O>(fn) });
  }

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

      if (this._readChild) {
        child = this._readChild(value);
      }

      const nextValue = (child || value) as any;

      if (this._traverseOn(nextValue, key, object)) {
        yield* this.recurse(nextValue, path);
      }
    }
  }

  clone(state: RecursionBuilderState<K, V, O> = {}): RecursionBuilder<K, V, O> {
    return RecursionBuilder.create(this._object, {
      yieldOn: this._yieldOn,
      traverseOn: this._traverseOn,
      readEntry: this._readEntry,
      ...state
    });
  }

  * [Symbol.iterator](): IterableIterator<[ K, V, string, O]> {
    yield* this.recurse(this._object);
  }

  * values(object?: O): IterableIterator<V> {
    yield* this._extractPropAtIndex(object, 1) as IterableIterator<V>;
  }

  * keys(object?: O): IterableIterator<K> {
    yield* this._extractPropAtIndex(object, 0) as IterableIterator<K>;
  }

  * paths(object?: O): IterableIterator<string> {
    yield* this._extractPropAtIndex(object, 2) as IterableIterator<string>;
  }

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
  for (const key of Object.keys(object)) {
    yield [ key as any, object[ key ]];
  }
}
