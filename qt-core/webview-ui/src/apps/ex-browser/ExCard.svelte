<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { onMount } from 'svelte';

  import { type ParsedExampleData } from '@shared/ex-types';
  import * as viewlogic from './viewlogic.svelte';
  import { data } from './states.svelte';

  let {
    info
  }: {
    info: ParsedExampleData
  } = $props();

  let fileInfo = $derived.by(() => { return data.fileInfo[info.name]; });
  let url = $derived.by(() => { return fileInfo?.thumbnailUrl; });
  const sizeClass = 'w-[200px] h-[150px]';

  onMount(() => {
    viewlogic.updateFileInfo(info);
  });
</script>

<div class="qt-surface qt-border-radius flex flex-col">
  <div class="p-2">{info.name}</div>
  <!-- {info.description} -->

  {#if fileInfo && fileInfo.thumbnailUrl.length !== 0}
    <div class={`relative w-[200px] h-[150px] overflow-hidden`}>
      <img
        src={url}
        alt={info.imageUrl}
        class="absolute inset-0 w-full h-full object-contain bg-orange-300" />
    </div>
  {:else}
    <div class="flex flex-col bg-amber-200">
      <div>module={info.module}</div>
      <div>image={info.imageUrl}</div>
    </div>
  {/if}
</div>
