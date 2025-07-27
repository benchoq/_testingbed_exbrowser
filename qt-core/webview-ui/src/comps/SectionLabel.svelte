<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import { P } from 'flowbite-svelte';
  import { ChevronRight } from '@lucide/svelte';

  let { text, icon = ChevronRight, class: className = '' } = $props();
  const IconComp = $derived(icon);
</script>

<div class={`flex flex-row w-full mb-1 ${className} *:self-center gap-0.5`}>
  <IconComp class="qt-label highlight" size="sm" />
  <P class="qt-label highlight">{text}</P>
</div>
