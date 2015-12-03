import isIterable from './isIterable';

export default function of(object) {
  return isIterable(object) ? object : Array.of(object);
}
