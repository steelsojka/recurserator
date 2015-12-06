export default function getExtractor(index, generator) {
  return function* extractor(...args) {
    for (let results of generator(...args)) {
      yield results[index];
    }
  };
}
