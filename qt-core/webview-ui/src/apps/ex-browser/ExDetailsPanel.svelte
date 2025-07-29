<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { X, ArrowRight } from '@lucide/svelte';
  import { ui } from './states.svelte';
  import IconButton from '@/comps/IconButton.svelte';
  import ExThumbnail from './ExThumbnail.svelte';

  let info = $derived(ui.cursor.currentInfo);
</script>

<div class="w-full h-[250px] qt-surface flex flex-col p-2 gap-2">
  {#if info}
    <!-- title with close button -->
    <div class="w-full flex gap-2">
      <div class="flex-1 qt-label highlight">
        {info.name}
      </div>
      <IconButton
        flat
        icon={X}
        onClicked={() => { ui.showDetailsPanel = false; }}
      />
    </div>

    <!-- contents -->
    <div class="w-full flex-1 flex flex-row items-start gap-4">
      <div class="bg-blue-500">
        <ExThumbnail
          width={200} height={150}
          info={ui.cursor.currentInfo}

          />
      </div>
      <div class="h-full flex-1 flex flex-col qt-surface p-2 gap-2 bg-blue-500/15">
        <div class="w-full flex">
          <IconButton
            icon={ArrowRight}
            text="Create a new project"
            onClicked={() => { ui.showCreateDialog=true; }}
          />
          <div class="grow"></div>
        </div>
        <div>{info.description}</div>
        <div>{info.projectPath}</div>
        <div class="grow"></div>
      </div>
    </div>
  {/if}
</div>

