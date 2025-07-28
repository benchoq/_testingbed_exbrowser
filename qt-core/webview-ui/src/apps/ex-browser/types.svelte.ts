// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import { type ParsedExampleData } from "@shared/ex-types";

export interface FileInfo {
  exists: boolean,
  thumbnailUrl: string
}

export class CursorManager {
  private _info: ParsedExampleData[] = [];
  private _currentIndex = $state(-1);

  public currentIndex = $derived(this._currentIndex);
  public currentInfo = $derived(this._info[this._currentIndex]);

  public rebuild(info: ParsedExampleData[]) {
    this._info = info;
    if (info.length === 0) {
      this._currentIndex = -1;
    } else {
      this._currentIndex = 0;
    }
  }

  public setCurrentIndex(index: number) {
    if (this._currentIndex !== index) {
      this._currentIndex = index;
    }
  }
}
