import recurseTree from './recurseTree';
import isIterable from './utils/isIterable';
import or from './utils/or';
import isObject from 'lodash.isobject';

export default function* recurseIterables(object, filter = () => true) {
  yield* recurseTree(object, filter, or(isIterable, isObject));
}
