import recurseTree from './recurseTree';
import isIterable from './utils/isIterable';
import negate from 'lodash.negate';

export default function* recurseObjects(object, filter = () => true) {
  yield* recurseTree(object, filter, negate(isIterable));
}
