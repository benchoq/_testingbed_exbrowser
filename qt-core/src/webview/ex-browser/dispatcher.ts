// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import _ from 'lodash';
import * as fs from 'fs/promises';
import * as path from 'path';
import { Jimp } from 'jimp';

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
import * as db from './db';

const logger = createLogger('ex-browser-dispatcher');

export class ExBrowserDispatcher {
  private readonly _handlers: Map<CommandId, CommandHandler> | undefined;
  private _comm: WebviewChannel | undefined;
  private _panel: ExBrowserPanel | undefined = undefined;

  public constructor() {
    this._handlers = new Map<CommandId, CommandHandler>([
      [CommandId.ExBrowserGetList, this._onGetList],
      [CommandId.ExBrowserGetFileInfo, this._onGetFileInfo],
    ]);

    this._initDb();
  }

  public setPanel(p: ExBrowserPanel) {
    this._panel = p;
  }

  public setComm(c: WebviewChannel) {
    this._comm = c;
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
  private readonly _onGetList = async (cmd: Command) => {
    const result = db.collection()
      .chain()
      // .find({ docDir: { $regex: /^widget/ } })
      .data();

    this._comm?.postDataReply(cmd, result);
  }

  private readonly _onGetFileInfo = async (cmd: Command) => {
    const baseDir = _.get(cmd.payload, 'baseDir', '');
    const docDir = _.get(cmd.payload, 'docDir', '');
    const image = _.get(cmd.payload, 'image', '');
    const size = _.get(cmd.payload, 'size', 64) as number;

    const fsPath = path.join(baseDir, docDir, 'images/', image);
    const info = await createFileInfo(fsPath, size);

    this._comm?.postDataReply(cmd, info);
  };

  private _initDb() {
    const baseDir = 'C:/tools/Qt/Examples/Qt-6.8.1';
    const qdocsAbs = utils.findAllQDocsUnder(baseDir);
    const qdocReader = new QDocReader();

    qdocsAbs.forEach(qdocAbs => {
      // baseDir => .../Qt-6.8.9
      // qdocAbs = '.../Qt-6.8.9/corelib/ipc/doc/src/localfurtuneclient.qdoc'
      // qdocRel = '            corelib/ipc/doc/src/localfurtuneclient.qdoc'
      // groupDir => 'corelib'
      // docDir => 'corelib/ipc/doc'
      // projectDir => 'corelib/<qdoc:example>'

      qdocReader.load(qdocAbs);

      const qdocRel = utils.normalizePath(path.relative(baseDir, qdocAbs));
      const groupDir = qdocRel.slice(0, qdocRel.indexOf('/'));
      const docDirIndex = qdocRel.indexOf('doc/');
      if (docDirIndex === -1) {
        console.log("invalid doc dir, relQDoc =", qdocRel);
        return;
      }

      const docDir = qdocRel.slice(0, docDirIndex) + 'doc';
      const projectDir = `${groupDir}/${qdocReader.projectDir()}`;

      db.insert({
        baseDir: baseDir,
        groupDir,
        docDir,
        projectDir,
        title: qdocReader.title(),
        image: qdocReader.image(),
        categories: qdocReader.categories()
      });
    })
  }
}

// helpers
async function createFileInfo(absPath: string, thumbnailSize: number) {
  let exists = false;
  let thumbnail: number[] | undefined;

  try {
    if (await fileExists(absPath)) {
      exists = true;

      const image = await Jimp.read(absPath);
      const resized = image.resize({
        w: thumbnailSize,
      });

      const buffer = await resized.getBuffer('image/png');
      thumbnail = Array.from(new Uint8Array(buffer));
    }
  } catch {
    // do nothing on purpose
  }

  return { exists, ...(thumbnail && { thumbnail }) };
}

async function fileExists(fsPath: string) {
  try {
    const s = await fs.stat(fsPath);
    return s.isFile();
  } catch {
    return false;
  }
}
