import of from './utils/of';
import isObject from 'lodash.isobject';
import RecursionBuilder from './RecursionBuilder';

/**
 * Recurse a data structure call the extractor function to get the next recursive iteration object.
 *
 * @param {Function|String} extractor A function or string passed to `_.callback`.
 *   Used to extract the child of element
 * @param {Array<Object>|Object} items An item or list of items to iterate over
 * @returns {Iterartor} An iterator
 * @example
 *
 * let items = [{
 *   child: {}
 * }];
 *
 * for (let item of recurseExtract('child', items)) {
 *   console.log(item); //=> {}, {}
 * }
 */
export default function recurseExtract(extractor, items) {
  return RecursionBuilder.create(of(items))
    .extractor(extractor)
    .traverse(isObject);
}
