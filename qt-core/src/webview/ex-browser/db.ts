// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import Loki from 'lokijs';

const db = new Loki('inmem.db');
const Examples = db.addCollection('examples');

export function collection() {
  return Examples;
}

export function insert<T>(data: T | T[]) {
  Examples.insert(data);
}
