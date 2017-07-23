/**
 * The result yielded during a recursive loop.
 * @export
 * @class RecursionResult
 * @template K 
 * @template V 
 * @template O 
 */
export class RecursionResult<K, V, O extends object> {
  constructor(
    private _value: V,
    private _key: K,
    private _path: string,
    private _parent: O | null,
    private _previous: RecursionResult<K, V, O> | null
  ) {}

  /**
   * The value yielded.
   * @readonly
   * @type {V}
   */
  get value(): V {
    return this._value;
  }

  /**
   * The key used to access the value yielded
   * @readonly
   * @type {K}
   */
  get key(): K {
    return this._key;
  }

  /**
   * The path string used to access the yielded value from the root data object.
   * @readonly
   * @type {string}
   */
  get path(): string {
    return this._path;
  }

  /**
   * The parent object of the value yielded.
   * @readonly
   * @type {(O | null)}
   */
  get parent(): O | null {
    return this._parent;
  }

  /**
   * The previous yielded result. This may or may not be the parent value.
   * @readonly
   * @type {(RecursionResult<K, V, O> | null)}
   */
  get previous(): RecursionResult<K, V, O> | null {
    return this._previous;
  }
}
