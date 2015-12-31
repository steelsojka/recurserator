import entries from './entries';
import resolvePath from './utils/resolvePath';
import isPlainObject from 'lodash.isplainobject';
import or from './utils/or';
import getExtractor from './utils/getExtractor';

export default function* recurseTree(
  object, 
  yieldFilter = () => true, 
  // Default will only traverse into POJOs and Arrays.
  traverseFilter = or(isPlainObject, Array.isArray),
  entryExtractor = entries,
  path = null
) {

  for (let [key, value] of entryExtractor(object)) {
    const currentPath = resolvePath(path, key, object);

    if (yieldFilter(value, key, object)) {
      yield [key, value, currentPath, object];
    }

    if (traverseFilter(value, key, object)) {
      yield* recurseTree(value, yieldFilter, traverseFilter, entryExtractor, currentPath);
    }
  }
};

Object.assign(recurseTree, {
  keys: getExtractor(0, recurseTree),
  values: getExtractor(1, recurseTree),
  paths: getExtractor(2, recurseTree)
});
