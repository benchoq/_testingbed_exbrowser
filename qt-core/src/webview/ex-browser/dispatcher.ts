// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import _ from 'lodash';
import path from 'path';

import { createLogger } from 'qt-lib';
import { WebviewChannel } from '@/webview/channel';
import {
  Command,
  CommandId,
  CommandHandler,
  IsCommand,
} from '@/webview/shared/message';
import type { ExBrowserPanel } from './panel';
import * as utils from './utils';
import { QDocReader } from './qdoc-reader';
import { ExInfo } from '../shared/ex-types';

const logger = createLogger('ex-browser-dispatcher');

export class ExBrowserDispatcher {
  private readonly _handlers: Map<CommandId, CommandHandler> | undefined;
  private _comm: WebviewChannel | undefined;
  private _panel: ExBrowserPanel | undefined = undefined;

  public constructor() {
    this._handlers = new Map<CommandId, CommandHandler>([
      [CommandId.ExBrowserGetList, this.onGetList]
    ]);
  }

  public setPanel(p: ExBrowserPanel) {
    this._panel = p;
  }

  public setComm(c: WebviewChannel) {
    this._comm = c;
    console.log(this._comm);
  }

  public dispatch(cmd: unknown) {
    if (!this._panel || !IsCommand(cmd)) {
      return;
    }

    const handler = this._handlers?.get(cmd.id);
    if (!handler) {
      logger.warn(`unhandled command: id = ${cmd.id}`);
      return;
    }

    try {
      void handler(cmd);
    } catch (e) {
      logger.error(`Error while handling command '${cmd.id}': ${String(e)}`);
    }
  }

  // handlers
  private readonly onGetList = async (cmd: Command) => {
    const qtDir = 'C:/tools/Qt/Examples/Qt-6.8.1';
    const absQDocs = utils.findAllQDocsUnder(qtDir);
    const reader = new QDocReader();
    const found: ExInfo[] = [];

    absQDocs.forEach(absQDoc => {
      reader.load(absQDoc);

      // relPath = 'corelib/ipc/doc/src/localfurtuneclient.qdoc'
      // - groupDir => 'corelib'
      // - docDir => 'corelib/ipc/doc'
      const relQDoc = utils.normalizePath(path.relative(qtDir, absQDoc));
      const groupDir = relQDoc.slice(0, relQDoc.indexOf('/'));
      const docDir = relQDoc.slice(0, relQDoc.indexOf('doc/src')) + 'doc';

      const projectDir = utils.normalizePath(
        path.join(groupDir, reader.read('example')));

      found.push({
        baseDir: qtDir,
        docDir,
        projectDir,
        title: reader.read('title'),
        image: reader.read('image'),
        categories: reader.readAll('examplecategory')
      });
    })

    this._comm?.postDataReply(cmd, found);
  }
}
