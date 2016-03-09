import isFunction from 'lodash/isFunction';
import isObject from 'lodash/isObject';

export default function isIterator(iterator) {
  return isObject(iterator) && isFunction(iterator.next);
}
