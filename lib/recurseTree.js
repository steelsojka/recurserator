import entries from './entries';
import resolvePath from './utils/resolvePath';
import isObject from 'lodash.isobject';

export default function* recurseTree(
  object, 
  filter = () => true, 
  traverseFilter = isObject,
  path = null, 
  parent = null
) {

  for (let [key, value] of entries(object)) {
    const currentPath = resolvePath(path, key, parent);

    if (filter(value, key, object, parent)) {
      yield [key, value, currentPath, parent];
    }

    if (traverseFilter(value, key, object, parent)) {
      yield* recurseTree(value, filter, currentPath, object);
    }
  }
}
