<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { Card } from "flowbite-svelte";
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
  const sizeClass = 'w-[200px] h-[200px]';

  onMount(() => {
    viewlogic.updateFileInfo(info);
  });
</script>

<Card class="border rounded p-3" color='blue'>
  "{info.name}"
  {info.description}

  {#if fileInfo && fileInfo.thumbnailUrl.length !== 0}
    <img src={url} alt="thumbnail"
      class={`${sizeClass} object-contain qt-checker-4px`}
    />
  {:else}
    <div class="flex flex-col bg-amber-200">
      <div>module={info.module}</div>
      <div>image={info.imageUrl}</div>
    </div>
  {/if}
</Card>
