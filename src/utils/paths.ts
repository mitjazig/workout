export function routerBasename(): string {
  return import.meta.env.VITE_BASE_PATH || '/';
}

export function assetPath(file: string): string {
  const base = import.meta.env.VITE_BASE_PATH || '/';
  return base.replace(/\/$/, '') + '/' + file;
}
