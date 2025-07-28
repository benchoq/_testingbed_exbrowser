<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { Search } from '@lucide/svelte';

  import { ui } from './states.svelte';
  import * as viewlogic from './viewlogic.svelte';

  function onInput() {
    console.log("onInput", ui.keyword);
    // viewlogic.search(value);
  }
</script>

<div class="w-full relative">
  <Search class="absolute left-2 top-1/2 -translate-y-1/2 w-6" />
  <input
    type="text"
    bind:value={ui.keyword}
    placeholder="Search in examples..."
    class='qt-input w-full !ps-10'
    oninput={onInput}
  />
</div>
