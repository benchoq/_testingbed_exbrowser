<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { onMount } from 'svelte';

  import '@/styles/app.css';
  import * as viewlogic from './viewlogic.svelte';
  import { data } from './states.svelte';
  import ExCard from "./ExCard.svelte";

  onMount(viewlogic.onAppMount);
</script>

<div class="
  grid grid-cols-[repeat(auto-fill,200px)]
  gap-4 p-4
">
  {#each data.info as info, index (index)}
    <ExCard {info} />
  {/each}
</div>

