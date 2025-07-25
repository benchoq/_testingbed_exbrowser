// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

export interface ExInfo {
  baseDir: string;
  groupDir: string;
  docDir: string;
  projectDir: string;
  title: string;
  image: string;
  categories: string[];
}

// type guard functions
export function isExInfo(obj: unknown): obj is ExInfo {
  if (typeof obj !== 'object' || obj === null) return false;

  const o = obj as Record<string, unknown>;

  return (
    typeof o.baseDir === 'string' &&
    typeof o.groupDir === 'string' &&
    typeof o.docDir === 'string' &&
    typeof o.projectDir === 'string' &&
    typeof o.title === 'string' &&
    typeof o.image === 'string' &&
    Array.isArray(o.categories) &&
    o.categories.every(c => typeof c === 'string')
  );
}
