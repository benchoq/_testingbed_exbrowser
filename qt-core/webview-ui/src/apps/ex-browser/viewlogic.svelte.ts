// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import { vscode } from "@/apps/vscode";
import { isExInfo } from "@shared/ex-types";
import { CommandId } from "@shared/message";
import { data } from './states.svelte';

export async function onAppMount() {
  const r = await vscode.post(CommandId.ExBrowserGetList);

  if (Array.isArray(r) && r.every(isExInfo)) {
    data.info = r;
  }
}
