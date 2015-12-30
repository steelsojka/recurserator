import recurseTree from './recurseTree';
import isIterable from './utils/isIterable';
import or from './utils/or';
import isObject from 'lodash.isobject';
import 'babel-polyfill';

export default function* recurseIterables(object, filter = () => true) {
  yield* recurseTree(object, filter, or(isIterable, isObject));
}

Object.assign(recurseIterables, {
  keys: getExtractor(0, recurseIterables),
  values: getExtractor(1, recurseIterables),
  paths: getExtractor(2, recurseIterables)
});
