// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import Loki from 'lokijs';

const db = new Loki('inmem.db');
const Examples = db.addCollection('examples');

export let numAllExamples = 0;
export const categoryInfo = new Map<string, number>();

export function collection() {
  return Examples;
}

export function insert<T>(data: T | T[]) {
  Examples.insert(data);
}

export function appendCategory(categories: string[]) {
  categories.forEach(cat => {
    categoryInfo.set(cat, (categoryInfo.get(cat) ?? 0) + 1);
  });

  numAllExamples += 1;
}
