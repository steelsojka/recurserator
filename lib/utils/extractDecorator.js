export default function extractDecorator(gen) {
  return Object.assign(gen, {
    keys: getExtractor(0, gen),
    values: getExtractor(1, gen),
    paths: getExtractor(2, gen)
  });
}

function getExtractor(index, generator) {
  return function* extractor(...args) {
    for (let results of generator(...args)) {
      yield results[index];
    }
  };
}
