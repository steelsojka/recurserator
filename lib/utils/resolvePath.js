export default function resolvePath(path, key, parent) {
  return path ? Array.isArray(parent) ? `${path}[${key}]` : `${path}.${key}` : key;
}
