<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only
-->

<script lang="ts">
  import {
    Table,
    TableHead, TableHeadCell,
    TableBody, TableBodyCell, TableBodyRow,
  } from "flowbite-svelte";
  import { onMount } from 'svelte';

  import '@/styles/app.css';
  import * as viewlogic from './viewlogic.svelte';
  import { data } from './states.svelte';

  onMount(viewlogic.onAppMount);
</script>

<!--
<div class="w-full h-full qt-surface-bright overflow-y-auto">
{#each data.info as info, index (index)}
  <button class="w-full qt-item text-left">
    {index} : {info.title} ({info.categories})
  </button>
{/each}
</div>
-->

<Table class="w-full h-full overflow-y-auto">
  <TableHead>
    <TableHeadCell>docDir</TableHeadCell>
    <TableHeadCell>projectDir</TableHeadCell>
    <TableHeadCell>title</TableHeadCell>
    <TableHeadCell>image</TableHeadCell>
    <TableHeadCell>categories</TableHeadCell>
  </TableHead>
  {#each data.info as info, index (index)}
    <TableBodyRow>
      <TableBodyCell>{info.docDir}</TableBodyCell>
      <TableBodyCell>{info.projectDir}</TableBodyCell>
      <TableBodyCell>{info.title}</TableBodyCell>
      <TableBodyCell>{info.image}</TableBodyCell>
      <TableBodyCell>{info.categories}</TableBodyCell>
    </TableBodyRow>
{/each}
</Table>
