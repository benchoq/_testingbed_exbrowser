// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import _ from 'lodash';

import { vscode } from "@/apps/vscode";
import {
  type CategoryInfo,
  type ParsedExampleData,
  isCategoryInfo,
  isParsedExampleData,
} from "@shared/ex-types";
import { CommandId } from "@shared/message";
import { data, ui } from './states.svelte';

export async function onAppMount() {
  ui.category = '';

  await refreshCategories();
  await refreshExampleList();
}

export async function setPack(pack: string) {
  console.log(pack);
  // await readExampleList(category);
}

export async function setCategory(category: string) {
  if (ui.category !== category) {
    ui.category = category;
    await refreshExampleList();
  }
}

export async function setKeyword(input: string) {
  if (ui.keyword !== input) {
    ui.keyword = input;
    await refreshExampleList();
  }
}

export async function updateFileInfo(info: ParsedExampleData) {
  const key = info.name;
  if (key.length === 0 || key in data.fileInfo) {
    return;
  }

  const payload = {
    imageUrl: info.imageUrl,
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

export function toggleSidePanel() {
  ui.showSidePanel = !ui.showSidePanel;
}

// helpers
async function refreshCategories() {
  const r = await vscode.post(CommandId.ExBrowserGetCategories);
  if (Array.isArray(r) && r.every(isCategoryInfo)) {
    data.categories = r;
  }
}

async function refreshExampleList() {
  const payload = {
    category: ui.category,
    keyword: ui.keyword,
  }

  const r = await vscode.post(CommandId.ExBrowserGetList, payload);
  if (Array.isArray(r) && r.every(isParsedExampleData)) {
    data.info = r;
    ui.cursor.rebuild(data.info);
  }
}
