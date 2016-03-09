import isIterator from './utils/isIterator';
import isFunction from 'lodash/isFunction';
import isObject from 'lodash/isObject';

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
