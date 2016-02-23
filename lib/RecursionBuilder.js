import entries from './entries';
import resolvePath from './utils/resolvePath';
import isPlainObject from 'lodash.isplainobject';
import defaults from 'lodash.defaults';
import or from './utils/or';
import callback from 'lodash.callback';

export default class RecursionBuilder {
  constructor(object = {}, state = {}) {
    Object.assign(this, state);

    this.object = object;

    defaults(this, {
      yieldFilter: () => true, 
      // Default will only traverse into POJOs and Arrays.
      traverseFilter: or(isPlainObject, Array.isArray),
      entryExtractor: entries
    });

    RecursionBuilder.createExtractor(this, 'keys', 0);
    RecursionBuilder.createExtractor(this, 'values', 1);
    RecursionBuilder.createExtractor(this, 'paths', 2);
    RecursionBuilder.createExtractor(this, 'parents', 3);
  }

  * [Symbol.iterator]() {
    yield* this.recurse(this.object);
  }

  * recurse(object, path) {
    for (let [key, value] of this.entryExtractor(object)) {
      let currentPath = resolvePath(path, key, object);

      if (this.yieldFilter(value, key, object)) {
        yield [key, value, currentPath, object];
      }

      if (this._extractor) {
        value = this._extractor(value);
      }

      if (this.traverseFilter(value, key, object)) {
        yield* this.recurse(value, currentPath);
      }
    }
  }

  yield(filter) {
    this.yieldFilter = filter;

    return this;
  }

  traverse(filter) {
    this.traverseFilter = filter;

    return this;
  }

  entries(extractor) {
    this.entryExtractor = extractor;

    return this;
  }

  extractor(extractor) {
    this._extractor = callback(extractor);

    return this;
  }

  static create(object, state) {
    return new RecursionBuilder(object, state);
  }

  static createExtractor(target, name, index) {
    Object.defineProperty(target, name, {
      enumerable: false,
      writable: true,
      configurable: true,
      value: function* extractor(...args) {
        for (let results of this[Symbol.iterator](...args)) {
          yield results[index];
        }
      }
    });
  }
}
