<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { type ParsedExampleData } from '@shared/ex-types';
  import { ui } from './states.svelte';
  import ExThumbnail from './ExThumbnail.svelte';

  let {
    info,
    index = -1
  }: {
    info: ParsedExampleData;
    index: number;
  } = $props();

  let selected = $derived(index >= 0 && index === ui.cursor.currentIndex);

  function select() {
    console.log(index);
    ui.cursor.setCurrentIndex(index);
    ui.showDetailsPanel = true;
  }
</script>

<button
  class={`
    qt-surface qt-border-radius flex flex-col text-left
    ${selected ? 'bg-blue-500' : ''}
  `}
  onclick={select}
>
  <div class="p-2">{info.name} ({info.tags})</div>
  <ExThumbnail width={160} height={120} {info} />
</button>
