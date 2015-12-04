import get from 'lodash.get';
import isFunction from 'lodash.isfunction';

export default function isIterator(iterator) {
  return isFunction(get(iterator, 'next'));
}
