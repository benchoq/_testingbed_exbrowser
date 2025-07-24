
import * as fs from 'fs';
import * as path from 'path';
// import { QDocReader } from './qdoc';
// import { ExInfo } from '@/webview/shared/ex-types';

// function isCMakeProjectFolder(dir: string): boolean {
//   if (!fs.existsSync(dir)) {
//     return false;
//   }

//   const cmakeFile = path.join(dir, "CMakeLists.txt");
//   return fs.existsSync(cmakeFile);
// }

// function findExamplesIn(dir: string): ExInfo[] {
//   const found: ExInfo[] = [];
//   const docSrc = path.join(dir, 'doc', 'src')
//   const docSrcEntries = fs.readdirSync(docSrc, { withFileTypes: true });

//   for (const e of docSrcEntries) {
//     if (e.isFile() && e.name.endsWith('.qdoc')) {
//       const qdoc = new QDocReader(path.join(docSrc, e.name));

//       found.push({
//         rootDir: path.join(dir, qdoc.read('example')),
//         title: qdoc.read('title'),
//         image: qdoc.read('image'),
//         categories: qdoc.readAll('examplecategory')
//       });
//     }
//   }

//   return found;
// }

// export function findAllExamplesRecursively(root: string): ExInfo[] {
//   const result: ExInfo[] = [];

//   function walk(currentPath: string) {
//     const entries = fs.readdirSync(currentPath, { withFileTypes: true });
//     for (const entry of entries) {
//       if (!entry.isDirectory()) {
//         continue;
//       }

//       const entryPath = path.join(currentPath, entry.name);
//       const docSrcPath = path.join(currentPath, entry.name, 'doc', 'src')
//       if (fs.existsSync(docSrcPath)) {
//         result.push(...findExamplesIn(entryPath));
//       } else {
//         // console.log("entering...", entryPath);
//         walk(entryPath);
//       }
//     }
//   }

//   walk(root);
//   return result;
// }

export function findAllQDocsUnder(startingDir: string): string[] {
  const absPaths: string[] = [];

  function walk(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const e of entries) {
      const absPath = path.join(dir, e.name);
      if (e.isDirectory()) {
        walk(absPath);
        continue;
      }

      if (path.extname(e.name) === '.qdoc') {
        absPaths.push(absPath);
      }
    }
  }

  walk(startingDir);
  return absPaths;
}

export function normalizePath(p: string) {
  return p.replace(/\\/g, '/');
}
