import isIterable from './utils/isIterable';
import of from './utils/of';
import callback from 'lodash.callback';

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
 * for (let item of recurse('child', items)) {
 *   console.log(item); //=> {}, {}
 * }
 */
export default function* recurse(extractor, items) {
  items = of(items);

  for (let item of items) {
    yield item;

    let children = callback(extractor)(item);

    if (isIterable(children)) {
      yield* recurse(extractor, children);
    }
  }
}
