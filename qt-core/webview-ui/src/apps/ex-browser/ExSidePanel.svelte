<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { PanelLeftOpen, PanelLeftClose } from '@lucide/svelte';

  import { data, ui } from './states.svelte';
  import * as viewlogic from './viewlogic.svelte';
  import IconButton from '@/comps/IconButton.svelte';
  import SectionLabel from '@/comps/SectionLabel.svelte';
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

  {#if !ui.sidePanel.collapsed}
    <SectionLabel text='Categories' />

    <div class='w-full p-2 flex flex-col'>
      {#each data.categories as category (category)}
        <button
          class='w-full qt-item text-left !py-0.5'
          onclick={() => viewlogic.setCategory(category)}
        >
          {category}
        </button>
      {/each}
    </div>

  {/if}
</div>
