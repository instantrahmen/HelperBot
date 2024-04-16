export const buildRoute = (path: string, params: Record<string, string>) => {
  // TODO: clean up using map, reduce, or filter instead of for loop
  const query = { ...params };

  let interpolatedPath = path;
  for (const [param, value] of Object.entries(params)) {
    const replaced = interpolatedPath.replace(`[${param}]`, value);
    if (replaced !== interpolatedPath) {
      interpolatedPath = replaced;
      delete query[param];
    }
  }

  const search = new URLSearchParams(query).toString();
  return `${interpolatedPath}${search ? `?${search}` : ''}`;
};
