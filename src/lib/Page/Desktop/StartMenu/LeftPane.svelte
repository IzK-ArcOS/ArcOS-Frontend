<script lang="ts">
  import { writable } from "svelte/store";
  import { isPopulatable } from "../../../../ts/applogic/checks";
  import type {
    CompiledAppGroup,
    CompiledAppGroupStore,
  } from "../../../../ts/applogic/groups/interface";
  import { getAppGroups } from "../../../../ts/applogic/groups/main";
  import { WindowStore, getWindow } from "../../../../ts/applogic/store";
  import sleep from "../../../../ts/sleep";
  import AppListItem from "./AppListItem.svelte";
  import Group from "./LeftPane/Group.svelte";
  import { UserData } from "../../../../ts/userlogic/interfaces";

  let groups = writable<CompiledAppGroupStore>({});
  let rest: string[] = [];

  WindowStore.subscribe(async () => {
    $groups = {};

    await sleep(0);

    const getter = getAppGroups();

    $groups = getter.groups;
    rest = getter.rest;
  });
</script>

<div class="left" data-contextmenu="startmenu-applist">
  {#if !$UserData.sh.start.noGroups}
    {#each Object.values($groups) as entry}
      <Group group={entry} />
    {/each}
    {#each rest as window}
      {#if isPopulatable(getWindow(window))}
        <AppListItem app={getWindow(window)} />
      {/if}
    {/each}
  {:else}
    {#each $WindowStore as window}
      {#if isPopulatable(window)}
        <AppListItem app={window} />
      {/if}
    {/each}
  {/if}
</div>
