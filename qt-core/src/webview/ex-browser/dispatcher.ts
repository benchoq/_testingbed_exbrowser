// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import _ from 'lodash';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as vscode from 'vscode';
import { Jimp } from 'jimp';

import { createLogger } from 'qt-lib';
import { WebviewChannel } from '@/webview/channel';
import {
  Command,
  CommandId,
  CommandHandler,
  IsCommand,
} from '@/webview/shared/message';
// import { ParsedExampleData } from '../shared/ex-types';
import type { ExBrowserPanel } from './panel';
import * as db from './db';
import * as utils from './utils';
import { parseXml as parseManifest } from './manifest-reader';
import { CategoryInfo } from '../shared/ex-types';

const logger = createLogger('ex-browser-dispatcher');

export class ExBrowserDispatcher {
  private readonly _handlers: Map<CommandId, CommandHandler> | undefined;
  private _comm: WebviewChannel | undefined;
  private _panel: ExBrowserPanel | undefined = undefined;

  public constructor() {
    this._handlers = new Map<CommandId, CommandHandler>([
      [CommandId.ExBrowserGetList, this._onGetList],
      [CommandId.ExBrowserGetCategories, this._onGetCategories],
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
  // private readonly _onGetList = async (cmd: Command) => {
  //   const category = _.get(cmd.payload, 'category', '');
  //   const result = db.collection()
  //     .chain()
  //     .find((item: ParsedExampleData) => {
  //       console.log(item.categories);
  //       return category === '' || item.categories.includes(category)
  //     }
  //     )
  //     .data();

  //   this._comm?.postDataReply(cmd, result);
  // }
  private readonly _onGetList = async (cmd: Command) => {
    const keyword = _.get(cmd.payload, 'keyword', '').trim();
    const category = _.get(cmd.payload, 'category', '').trim();

    // constitue filters
    const filters: Record<string, unknown>[] = [];
    if ((category.length !== 0) && (category.toLowerCase() !== 'all')) {
      filters.push({ categories: { $contains: category } });
    }

    if (keyword.length !== 0) {
      filters.push({ __nameLower: { $contains: keyword.toLowerCase() } });
    }

    // query
    console.time('query');
    console.timeLog("query", "before query");

    const result = (filters.length === 0)
      ? db.collection().find()
      : db.collection().find({ $and: filters })

    console.timeLog("query", "after query");

    this._comm?.postDataReply(cmd, result);
  }

  private readonly _onGetCategories = async (cmd: Command) => {
    const all: CategoryInfo[] = Array
    .from(db.categoryInfo)
    .map(([k, v]) => ({ name: k, numExamples: v }));
    all.sort((a, b) => a.name.localeCompare(b.name));

    const total = {
      name: "All",
      numExamples: db.numAllExamples
    }

    this._comm?.postDataReply(cmd, [total, ...all]);
  }

  private readonly _onGetFileInfo = async (cmd: Command) => {
    const baseDir = 'C:/tools/Qt/Docs/Qt-6.8.1';
    const imageUrl = _.get(cmd.payload, 'imageUrl', '');
    const size = _.get(cmd.payload, 'size', 64) as number;

    const imageUri = vscode.Uri.parse(imageUrl);
    const fsPath = path.join(baseDir, imageUri.path);
    const info = await createFileInfo(fsPath, size);

    this._comm?.postDataReply(cmd, info);
  };

  private _initDb() {
    const baseDir = 'C:/tools/Qt/Docs/Qt-6.8.1';
    const manifests = utils.findAllUnder(baseDir, 'examples-manifest.xml');

    db.clear();

    manifests.forEach(manifest => {
      const all = parseManifest(manifest);
      db.insert(all);
      all.forEach(ex => db.appendCategory(ex.categories));
    })

    // const all = manifests.reduce(
    //   (acc: ParsedExampleData[], m) => acc.concat(parseXml(m)),
    //   []
    // )

    // console.log(all);

    // const qdocsAbs = utils.findAllQDocsUnder(baseDir);
    // const qdocReader = new QDocReader();

    // qdocsAbs.forEach(qdocAbs => {
    //   // baseDir => .../Qt-6.8.9
    //   // qdocAbs = '.../Qt-6.8.9/corelib/ipc/doc/src/localfurtuneclient.qdoc'
    //   // qdocRel = '            corelib/ipc/doc/src/localfurtuneclient.qdoc'
    //   // groupDir => 'corelib'
    //   // docDir => 'corelib/ipc/doc'
    //   // projectDir => 'corelib/<qdoc:example>'

    //   qdocReader.load(qdocAbs);

    //   const qdocRel = utils.normalizePath(path.relative(baseDir, qdocAbs));
    //   const groupDir = qdocRel.slice(0, qdocRel.indexOf('/'));
    //   const docDirIndex = qdocRel.indexOf('doc/');
    //   if (docDirIndex === -1) {
    //     console.log("invalid doc dir, relQDoc =", qdocRel);
    //     return;
    //   }

    //   const docDir = qdocRel.slice(0, docDirIndex) + 'doc';
    //   const projectDir = `${groupDir}/${qdocReader.projectDir()}`;

    //   db.insert({
    //     baseDir: baseDir,
    //     groupDir,
    //     docDir,
    //     projectDir,
    //     title: qdocReader.title(),
    //     image: qdocReader.image(),
    //     categories: qdocReader.categories()
    //   });
    // })
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
