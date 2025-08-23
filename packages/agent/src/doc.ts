function fmt(doc: string) {
  return doc
    .split('\n')
    .map((line) => line.trim())
    .join('\n');
}

export function doc(name: string, fn: any, doc: string) {
  fn.__doc__ = fmt(doc);
  fn.__name__ = name;
  return fn;
}

export function docs(env: any, path: string = '') {
  let result = '';

  for (const key in env) {
    if (key.startsWith('__doc__')) {
      continue;
    }

    const value = env[key];
    const currentPath = path ? `${path}.${key}` : key;

    if (value && typeof value === 'object' && value.__doc__) {
      result += `<module name="${currentPath}">\n`;
      result += ` ${fmt(value.__doc__ || '')}\n`;
      result += docs(value, currentPath);
      result += `</module>\n`;
    } else if (value && typeof value === 'function') {
      result += `<function name="${currentPath}">\n`;
      result += `  ${fmt(value.__doc__ || '')}\n`;
      result += `</function>\n`;
    } else {
      result += `<variable name="${currentPath}">\n`;
      result += `  ${fmt(env['__doc__' + key] || '')}\n`;
      result += `</variable>\n`;
    }
  }

  return result;
}
