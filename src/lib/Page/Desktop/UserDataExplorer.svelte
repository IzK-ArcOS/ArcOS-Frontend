<script lang="ts">
  import "../../../css/desktop/ude.css";
  import type { UserData } from "../../../ts/userlogic/interfaces";
  import Branch from "./UserDataExplorer/Branch.svelte";
  import Node from "./UserDataExplorer/Node.svelte";

  export let data: UserData;
</script>

{#if data}
  <div class="userdata-explorer">
    {#each Object.entries(data) as node}
      <div class="toplevel-item">
        {#if typeof node[1] == "object"}
          <Branch key={node[0]} value={node[1]} top />
        {:else}
          <Node key={node[0]} value={node[1]} />
        {/if}
      </div>
    {/each}
  </div>
{/if}
