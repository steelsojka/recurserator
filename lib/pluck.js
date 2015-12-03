import recurse from './recurse';
import recurseTree from './recurseTree';
import isObject from 'lodash.isobject';
import isString from 'lodash.isstring';
import isFunction from 'lodash.isfunction';
import * as _pluck from 'lodash.pluck';

export default function* pluck(extractor, object, keys = []) {
  let iterator;

  if (!isString(extractor) && !isFunction(extractor) && isObject(extractor)) {
    keys = object;
    object = extractor;

    iterator = recurseTree(object, isObject);
  } else {
    iterator = recurse(extractor, object);
  }

  // Yield the value on the current object
  // key, value, path, parent
  yield ['', _pluck(object, keys), null, null];

  for (let [key, value, path, parent] of iterator) {
    yield [key, _pluck(value, keys), path, parent];
  }
}
