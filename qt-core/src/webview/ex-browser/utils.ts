
import * as fs from 'fs';
import * as path from 'path';

export function findAllUnder(startingDir: string, name: string): string[] {
  const found: string[] = [];

  function walk(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const e of entries) {
      const absPath = path.join(dir, e.name);
      if (e.isDirectory()) {
        walk(absPath);
        continue;
      }

      if (e.name === name) {
        found.push(absPath);
      }
    }
  }

  walk(startingDir);
  return found;
}

export function normalizePath(p: string) {
  return p.replace(/\\/g, '/');
}
