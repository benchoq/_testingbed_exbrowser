// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import * as vscode from 'vscode';

// import { createLogger } from 'qt-lib';
import { WebviewChannel } from '@/webview/channel';
import { ExBrowserDispatcher } from './dispatcher';
import * as texts from '@/texts';
import {
  createWebviewHtml,
  createWebviewOptions,
  basicWebviewAppConfig
} from '@/webview/utils';

// const logger = createLogger('example-browser-panel');

// definitions for webview-panel
const PanelColumn = vscode.ViewColumn.One;
const PanelViewType = 'ViewTypeWizard';

export class ExBrowserPanel {
  public static instance: ExBrowserPanel | undefined;
  private readonly _comm: WebviewChannel;
  private readonly _panel: vscode.WebviewPanel;
  private readonly _disposables: vscode.Disposable[] = [];
  private readonly _dispatcher = new ExBrowserDispatcher();

  private constructor(
    panel: vscode.WebviewPanel,
    context: vscode.ExtensionContext
  ) {
    const config = {
      app: 'ex-browser',
      title: texts.newItem.tabText,
      context,
      ...basicWebviewAppConfig
    };

    panel.webview.html = createWebviewHtml(panel.webview, config);
    panel.webview.options = createWebviewOptions(config);

    this._comm = new WebviewChannel(panel.webview);
    this._panel = panel;
    this._dispatcher.setPanel(this);
    this._dispatcher.setComm(this._comm);

    this._disposables = [
      panel.onDidDispose(this.dispose.bind(this)),
      this._comm,
      this._comm.onDidReceiveMessage((m) => {
        this._dispatcher.dispatch(m);
      })
    ];
  }

  public dispose() {
    ExBrowserPanel.instance = undefined;

    while (this._disposables.length) {
      const item = this._disposables.pop();
      if (item) {
        item.dispose();
      }
    }
  }

  public close() {
    this._panel.dispose();
  }

  public static render(context: vscode.ExtensionContext) {
    if (!ExBrowserPanel.instance) {
      const panel = vscode.window.createWebviewPanel(
        PanelViewType,
        texts.newItem.tabText,
        PanelColumn
      );

      ExBrowserPanel.instance = new ExBrowserPanel(panel, context);
    }

    ExBrowserPanel.instance._panel.reveal(PanelColumn);
  }
}
