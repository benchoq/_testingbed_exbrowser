<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { Card } from "flowbite-svelte";
  import { onMount } from 'svelte';

  import { type ExInfo } from '@shared/ex-types';
  import * as viewlogic from './viewlogic.svelte';
  import { data } from './states.svelte';

  interface PropType {
    info: ExInfo
  }

  let {
    info
  }: PropType = $props();

  let fileInfo = $derived.by(() => { return data.fileInfo[info.title]; });
  let url = $derived.by(() => { return fileInfo?.thumbnailUrl; });
  const sizeClass = 'w-[200px] h-[200px]';

  onMount(() => {
    viewlogic.updateFileInfo(info);
  });
</script>

<Card class="border rounded p-3" color='blue'>
  {info.title}

  {#if fileInfo && fileInfo.thumbnailUrl.length !== 0}
    <img src={url} alt="thumbnail"
      class={`${sizeClass} object-contain qt-checker-4px`}
    />
  {:else}
    <div class="flex flex-col bg-amber-200">
      <div>group={info.groupDir}</div>
      <div>doc={info.docDir}</div>
      <div>image={info.image}</div>
    </div>
  {/if}
</Card>
