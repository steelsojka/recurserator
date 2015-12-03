export default function* entries(object) {
  for (let key of Object.keys(object)) {
    yield [key, object[key]];
  }
}
