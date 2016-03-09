import entries from './entries';
import resolvePath from './utils/resolvePath';
import isPlainObject from 'lodash/isPlainObject';
import defaults from 'lodash/defaults';
import or from './utils/or';
import iteratee from 'lodash/iteratee';
import isObject from 'lodash/isObject';

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

      if (this.childExtractor) {
        value = this.childExtractor(value);
      }

      if (this.traverseFilter(value, key, object)) {
        yield* this.recurse(value, currentPath);
      }
    }
  }

  yield(filter) {
    return this.clone({ yieldFilter: filter });
  }

  traverse(filter) {
    return this.clone({ traverseFilter: filter });
  }

  entries(extractor) {
    return this.clone({ entryExtractor: extractor });
  }

  extractor(extractor) {
    return this.clone({ childExtractor: iteratee(extractor) })
  }

  clone(newState = {}) {
    return new RecursionBuilder(this.object, Object.assign({}, this, newState));
  }

  static create(object, state) {
    return new RecursionBuilder(object, state);
  }

  static createExtractor(target, name, index) {
    Object.defineProperty(target, name, {
      enumerable: false,
      writable: true,
      configurable: true,
      value: function* extractor(object) {
        for (let results of this.recurse(isObject(object) ? object : this.object)) {
          yield results[index];
        }
      }
    });
  }
}
