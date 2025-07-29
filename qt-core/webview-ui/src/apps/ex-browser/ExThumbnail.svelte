<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { onMount } from 'svelte';

  import { type ParsedExampleData } from '@shared/ex-types';
  import * as viewlogic from './viewlogic.svelte';
  import { data, ui } from './states.svelte';

  let {
    info,
    width = 160,
    height = 120
  }: {
    info: ParsedExampleData;
    width: number;
    height: number;
  } = $props();

  let fileInfo = $derived.by(() => {
    return data.fileInfo[info.name];
  });
  let url = $derived.by(() => {
    return fileInfo?.thumbnailUrl;
  });
  let sizeClass = $derived(`w-[${width}px] h-[${height}px]`);

  onMount(() => {
    viewlogic.updateFileInfo(info);
  });

  // function useVisible(
  //   node: HTMLElement,
  //   callback: () => void
  // ): { destroy(): void } | void {
  //   const observer = new IntersectionObserver(([entry]) => {
  //     if (entry.isIntersecting) {
  //       callback();
  //       observer.disconnect();
  //     }
  //   });

  //   observer.observe(node);

  //   return {
  //     destroy() {
  //       observer.disconnect();
  //     }
  //   };
  // }

  function onVisible() {
    // viewlogic.updateFileInfo(info);
  }
// use:useVisible={onVisible}
</script>

<div
  class={`relative ${sizeClass} overflow-hidden`}
>
  {#if fileInfo && fileInfo.thumbnailUrl.length !== 0}
    <img
      src={url}
      alt={info.imageUrl}
      class="absolute bottom-0 left-1/2 -translate-x-1/2 object-contain"
    />
  {/if}
</div>
