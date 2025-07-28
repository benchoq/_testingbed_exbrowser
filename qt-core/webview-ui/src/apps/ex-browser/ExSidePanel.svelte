<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import {
    PanelLeftOpen,
    PanelLeftClose,
    Package,
    AlignLeft
  } from '@lucide/svelte';

  import { data, ui } from './states.svelte';
  import * as viewlogic from './viewlogic.svelte';
  import IconButton from '@/comps/IconButton.svelte';
  import SectionLabel from '@/comps/SectionLabel.svelte';
</script>

<div class='w-full h-full p-2'>
  {#if ui.showSidePanel}
    <div class='w-full flex flex-row'>
      <div class='grow'></div>
      <IconButton
        flat square
        icon={PanelLeftClose}
        onClicked={viewlogic.toggleSidePanel}
      />
    </div>

    <SectionLabel text='Packages' icon={Package} />
    <div class='w-full p-2 flex flex-col'>
      {#each data.packs as pack (pack)}
        <button
          class='w-full qt-item text-left !py-0.5'
          onclick={() => viewlogic.setPack(pack)}
        >
          {pack}
        </button>
      {/each}
    </div>

    <div class="h-[25px]"></div>

    <SectionLabel text='Categories' icon={AlignLeft} />
    <div class='w-full p-2 flex flex-col'>
      {#each data.categories as cat (cat)}
        <button
          class={`
            qt-item${(cat.name === ui.category) ? '-selected' : ''}
            w-full text-left flex flex-row !px-3 !py-0.5
          `}
          onclick={() => viewlogic.setCategory(cat.name)}
        >
          <div class="flex-1">{cat.name}</div>
          <div>{cat.numExamples}</div>
        </button>
      {/each}
    </div>
  {:else}
    <div class="flex flex-col items-center gap-2.5">
      <IconButton
        flat square
        tooltip="Open side panel"
        tooltipPlacement="right"
        icon={PanelLeftOpen}
        onClicked={viewlogic.toggleSidePanel}
      />

      <IconButton
        flat square
        tooltip="Packages"
        tooltipPlacement="right"
        icon={Package}
        onClicked={viewlogic.toggleSidePanel}
      />
      <IconButton
        flat square
        tooltip="Categories"
        tooltipPlacement="right"
        icon={AlignLeft}
        onClicked={viewlogic.toggleSidePanel}
      />
    </div>
  {/if}
</div>
