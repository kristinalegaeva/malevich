export function assetUrl(path) {
  const encodedPath = path.split('/').map(encodeURIComponent).join('/');
  return `${import.meta.env.BASE_URL}${encodedPath}`;
}
