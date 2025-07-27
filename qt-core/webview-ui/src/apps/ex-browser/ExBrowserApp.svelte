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
  import ExGallery from "./ExGallery.svelte";
  import ExSidePanel from './ExSidePanel.svelte';

  onMount(viewlogic.onAppMount);
</script>

<div class="w-screen h-screen flex flex-row">
  <div class={`
    ${ui.sidePanel.collapsed ? 'w-[70px]' : 'w-[300px]'}
  `}>
    <ExSidePanel />
  </div>

  <div class="w-full flex flex-col m-2 gap-2">
    <ExHeader />
    <div class="flex-1 overflow-x-hidden overflow-y-scroll">
      <ExGallery />
    </div>
  </div>
</div>

<!--
<Drawer
  bind:hidden
  class="w-full h-[200px]"
  placement="bottom"
  backdrop={false}
  transitionParams={{duration: 200}}
>
  <div class="bg-amber-400 h-200"></div>
</Drawer>
 -->
