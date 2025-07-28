// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

export interface ParsedExampleData {
  module: string,
  description: string,
  tags: string[],

  name: string,
  docUrl: string,
  imageUrl: string,
  isHighlighted: boolean,
  projectPath: string,

  files: string[],
  mainFileIndex: number,
  categories: string[],

  __nameLower?: string
}

export interface CategoryInfo {
  name: string,
  numExamples: number
}

// type guard functions
export function isCategoryInfo(x: unknown): x is CategoryInfo {
  if (typeof x !== 'object' || x === null) return false;

  const o = x as Record<string, unknown>;
  return (
    typeof o.name === 'string' &&
    typeof o.numExamples === 'number'
  )
}

export function isParsedExampleData(x: unknown): x is ParsedExampleData {
  if (typeof x !== 'object' || x === null) return false;

  const o = x as Record<string, unknown>;

  return (
    typeof o.module === 'string' &&
    typeof o.description === 'string' &&
    Array.isArray(o.tags) && o.tags.every(t => typeof t === 'string') &&

    typeof o.name === 'string' &&
    typeof o.docUrl === 'string' &&
    typeof o.imageUrl === 'string' &&
    typeof o.isHighlighted === 'boolean' &&
    typeof o.projectPath === 'string' &&

    Array.isArray(o.files) && o.files.every(f => typeof f === 'string') &&

    typeof o.mainFileIndex === 'number' &&

    Array.isArray(o.categories) &&
    o.categories.every(c => typeof c === 'string')
  );
}

