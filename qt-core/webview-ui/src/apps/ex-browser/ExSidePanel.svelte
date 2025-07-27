<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { PanelLeftOpen, PanelLeftClose } from '@lucide/svelte';

  import { ui } from './states.svelte';
  import * as viewlogic from './viewlogic.svelte';
  import IconButton from '@/comps/IconButton.svelte';
</script>

<div class='w-full h-full'>
  <div class='w-full flex flex-row p-2'>
    <div class='grow'></div>
    <IconButton
      flat square
      icon={ui.sidePanel.collapsed ? PanelLeftOpen : PanelLeftClose}
      onClicked={viewlogic.toggleSidePanel}
    />
  </div>
<!--
  <div class={`p-4 pt-10 ${collapsed ? 'hidden' : 'block'}`}>
    <h2 class="font-bold mb-2">Navigation</h2>
    <ul class="space-y-2 text-sm">
      <li>📁 Project A</li>
      <li>📄 File 1</li>
      <li>⚙️ Settings</li>
    </ul>
  </div> -->
</div>
