export function assetUrl(path) {
  const encodedPath = encodeURI(path).replaceAll('?', '%3F').replaceAll('#', '%23');
  return `${import.meta.env.BASE_URL}${encodedPath}`;
}
