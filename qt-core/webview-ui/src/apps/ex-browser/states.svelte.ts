// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import { type ExInfo } from "@shared/ex-types";
import { type FileInfo } from './types.svelte';

export const data = $state({
  info: [] as ExInfo[],
  fileInfo: {} as Record<string, FileInfo>,

});
