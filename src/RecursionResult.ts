export class RecursionResult<K, V, O extends object> {
  constructor(
    private _value: V,
    private _key: K,
    private _path: string,
    private _parent: O | null,
    private _previous: RecursionResult<K, V, O> | null
  ) {}

  get value(): V {
    return this._value;
  }

  get key(): K {
    return this._key;
  }

  get path(): string {
    return this._path;
  }

  get parent(): O | null {
    return this._parent;
  }

  get previous(): RecursionResult<K, V, O> | null {
    return this._previous;
  }
}
