<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { onMount } from 'svelte';
  import { Tooltip } from 'flowbite-svelte';

  import { type ParsedExampleData } from '@shared/ex-types';
  import * as viewlogic from './viewlogic.svelte';
  import { data, ui } from './states.svelte';
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
  <div class="p-2">{info.name}</div>
  <!-- {info.description} -->

  <ExThumbnail width={160} height={120} {info} />
  <!-- <div class="flex flex-col bg-amber-200">
      <div>module={info.module}</div>
      <div>image={info.imageUrl}</div>
    </div> -->
</button>
<!--
<Tooltip
  class="qt-tooltip w-[300px]"
  placement="top"
  data-placement="top"
>
  {info.description}
</Tooltip> -->
