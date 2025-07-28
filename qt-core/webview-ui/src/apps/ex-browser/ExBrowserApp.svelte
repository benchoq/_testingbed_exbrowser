<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { onMount } from 'svelte';

  import '@/styles/app.css';
  import { ui } from './states.svelte';
  import * as viewlogic from './viewlogic.svelte';
  import ExHeader from './ExHeader.svelte';
  import ExSidePanel from './ExSidePanel.svelte';
  import ExCardGallery from "./ExCardGallery.svelte";
  import ExDetailsPanel from './ExDetailsPanel.svelte';

  onMount(viewlogic.onAppMount);
</script>

<div class="w-screen h-screen flex flex-row gap-0.5">
  <div class={`
    ${ui.showSidePanel ? 'w-[350px]' : ''}
  `}>
    <ExSidePanel />
  </div>

  <div class="w-full flex flex-col gap-2 pt-2 relative">
    <ExHeader />
    <div class="flex-1 overflow-x-hidden overflow-y-scroll">
      <ExCardGallery />
    </div>

    {#if ui.showDetailsPanel}
      <div class={`w-full left-0 bottom-0 absolute`}>
        <ExDetailsPanel />
      </div>
    {/if}
  </div>
</div>

  <!-- <ExDetailsPanel /> -->

