import RecursionBuilder from './RecursionBuilder';

export default function recurseTree(
  object, 
  yieldFilter, 
  traverseFilter,
  entryExtractor
) {
  return new RecursionBuilder(object, {
    yieldFilter, traverseFilter, entryExtractor
  });
};
