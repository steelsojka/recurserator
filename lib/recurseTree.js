import entries from './entries';
import resolvePath from './utils/resolvePath';
import isPlainObject from 'lodash.isplainobject';
import extractDecorator from './utils/extractDecorator';
import or from './utils/or';

export default extractDecorator(function* recurseTree(
  object, 
  filter = () => true, 
  // Default will only traverse into POJOs and Arrays.
  traverseFilter = or(isPlainObject, Array.isArray),
  path = null, 
  parent = null
) {

  for (let [key, value] of entries(object)) {
    const currentPath = resolvePath(path, key, parent);

    if (filter(value, key, object, parent)) {
      yield [key, value, currentPath, parent];
    }

    if (traverseFilter(value, key, object, parent)) {
      yield* recurseTree(value, filter, traverseFilter, currentPath, object);
    }
  }
});
