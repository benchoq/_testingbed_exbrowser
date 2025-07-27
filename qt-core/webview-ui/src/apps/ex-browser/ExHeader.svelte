<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { Input } from 'flowbite-svelte';
  import { Search } from '@lucide/svelte';

  import { data } from "./states.svelte";

  let { value = '' } = $props();
</script>

<div class="w-full relative">
  <Search class="absolute left-2 top-1/2 -translate-y-1/2 w-6" />
  <input
    type="text"
    placeholder="Search in examples..."
    class='qt-input w-full !ps-10'
    bind:value
  />
</div>
