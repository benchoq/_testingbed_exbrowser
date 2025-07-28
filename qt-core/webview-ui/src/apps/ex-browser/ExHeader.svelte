<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { Keyboard, Search, X } from '@lucide/svelte';

  import * as viewlogic from './viewlogic.svelte';

  let { value = ''} = $props();
  let timer: ReturnType<typeof setTimeout>;
  let Icon = $derived.by(() => {
    return value.trim().length === 0 ? Search : X
  });

  function clear() {
    value = '';
    triggerUpdate(0);
  }

  function triggerUpdate(delay = 500) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      viewlogic.setKeyword(value)
    }, delay);
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      triggerUpdate(0);
    }
  }
</script>

<div class="w-full relative">
  <Icon
    class="absolute left-2 top-1/2 -translate-y-1/2 w-6"
    onclick={clear}
  />

  <input
    type="text"
    bind:value
    placeholder="Search in examples..."
    class='qt-input w-full !ps-10'
    oninput={() => { triggerUpdate(500); }}
    onkeydown={onKeydown}
  />
</div>
