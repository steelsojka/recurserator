import isFunction from 'lodash.isfunction';
import isObject from 'lodash.isobject';

export default function isIterator(iterator) {
  return isObject(iterator) && isFunction(iterator.next);
}
