import isIterator from './utils/isIterator';
import isFunction from 'lodash.isfunction';
import isObject from 'lodash.isobject';

export default function* entries(object) {
  if (isObject(object)) {
    let iterator;

    if (isFunction(object.entries) && isIterator((iterator = object.entries()))) {
      yield* iterator;
    } else {
      for (let key of Object.keys(object)) {
        yield [key, object[key]];
      }
    }
  }
}
