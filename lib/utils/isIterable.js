export default function isIterable(object) {
  return Boolean(object[Symbol.iterator]);
}
