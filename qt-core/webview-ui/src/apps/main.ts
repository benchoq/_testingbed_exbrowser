// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import { mount } from 'svelte';
// import NewItem from './new-item/NewItemApp.svelte';
import ExBrowserApp from './ex-browser/ExBrowserApp.svelte';

// const name = document.body.dataset.app;
// const appType =  (name === 'ex-browser') ? ExBrowserApp : NewItem;

const app = mount(ExBrowserApp, {
  target: document.getElementById('app')!
});

export default app;
