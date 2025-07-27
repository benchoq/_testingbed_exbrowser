<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { onMount } from 'svelte';

  import '@/styles/app.css';
  import { ui } from './states.svelte';
  import * as viewlogic from './viewlogic.svelte';
  import ExGallery from "./ExGallery.svelte";
  import ExSidePanel from './ExSidePanel.svelte';

  onMount(viewlogic.onAppMount);
</script>

<div class="w-screen h-screen flex flex-row bg-blue-300">
  <div class={`
    qt-surface
    ${ui.sidePanel.collapsed ? 'w-[70px]' : 'w-[250px]'}
    transition-all duration-150 ease-in-out
  `}>
    <ExSidePanel />
  </div>

  <div class="flex-1 overflow-x-hidden overflow-y-scroll">
    <ExGallery />
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
