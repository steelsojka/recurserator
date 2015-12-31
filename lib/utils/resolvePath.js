export default function resolvePath(path, key, value) {
  return path ? Array.isArray(value) ? `${path}[${key}]` : `${path}.${key}` : key;
}
