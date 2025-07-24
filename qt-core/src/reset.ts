// Copyright (C) 2024 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import * as vscode from 'vscode';

import { coreAPI, projectManager } from '@/extension';
import { EXTENSION_ID } from '@/constants';
import { telemetry } from 'qt-lib';

export function resetCommand() {
  return vscode.commands.registerCommand(`${EXTENSION_ID}.reset`, () => {
    telemetry.sendAction('reset');
    coreAPI?.reset();
    projectManager.reset();
    const extensions = ['qt-cpp', 'qt-qml', 'qt-ui'];
    extensions.forEach((extension) => {
      void vscode.commands.executeCommand(`${extension}.reset`);
    });
  });
}
