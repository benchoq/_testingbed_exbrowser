// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import _ from 'lodash';

import { vscode } from "@/apps/vscode";
import { isExInfo, type ExInfo } from "@shared/ex-types";
import { CommandId } from "@shared/message";
import { data } from './states.svelte';

export async function onAppMount() {
  const r = await vscode.post(CommandId.ExBrowserGetList);

  if (Array.isArray(r) && r.every(isExInfo)) {
    data.info = r;
  }
}


export async function updateFileInfo(info: ExInfo) {
  const key = info.title;
  if (key.length === 0 || key in data.fileInfo) {
    return;
  }

  const payload = {
    baseDir: info.baseDir,
    docDir: info.docDir,
    image: info.image,
    size: 200
  }

  const reply = await vscode.post(CommandId.ExBrowserGetFileInfo, payload);

  let thumbnailUrl = '';
  const exists = _.get(reply, 'exists', false) as boolean;
  const thumbnail = _.get(reply, 'thumbnail', []) as Array<number>;

  if (exists && thumbnail && thumbnail.length !== 0) {
    const byteArray = new Uint8Array(thumbnail);
    const blob = new Blob([byteArray], { type: 'image/png' });
    thumbnailUrl = URL.createObjectURL(blob);
  }

  data.fileInfo = {
    ...data.fileInfo,
    [key]: { exists, thumbnailUrl }
  }
}

