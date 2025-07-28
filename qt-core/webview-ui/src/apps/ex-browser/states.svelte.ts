// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import { type ParsedExampleData } from "@shared/ex-types";
import { type FileInfo } from './types.svelte';

export const data = $state({
  info: [] as ParsedExampleData[],
  packs: ['Qt6 6.8.1', 'Qt6 6.9.0'],
  categories: ['All'] as string[],
  fileInfo: {} as Record<string, FileInfo>,
});

export const ui = $state({
  selection: {
    packIndex: 0,
    category: '',
  },

  keyword: '',

  sidePanel: {
    collapsed: false,
  },
})
