<script lang="ts">
  import { onMount } from "svelte";
  import { getUserPfp } from "../../../../../../ts/api/pfp";
  import type { PartiallyExtendedMessage } from "../../../../../../ts/messaging/interface";
  import {
    selectedMessageId,
    threadMessageId,
  } from "../../../../../../ts/messaging/main";
  import { filterPartial } from "../../../../../../ts/messaging/partial";
  import sleep from "../../../../../../ts/sleep";
  import { hideOverlay } from "../../../../../../ts/window/overlay";
  import ProfilePicture from "../../../../../ProfilePicture.svelte";
  import Branch from "../Branch.svelte";

  export let item: PartiallyExtendedMessage;

  let pfp = "";

  onMount(async () => {
    pfp = await getUserPfp(item.sender);
  });

  async function openThis() {
    $selectedMessageId = item.id;

    hideOverlay("thread", "MessagingApp");

    await sleep(1000);

    threadMessageId.set(null);
  }
</script>

{#if item}
  <button class="item" on:click={openThis}>
    <ProfilePicture src={pfp} height={32} />
    <div class="context">
      <p class="name">{item.sender}</p>
      <p class="partial">
        {filterPartial(item.partialBody)}{item.partialBody.length > 29
          ? "..."
          : ""}
      </p>
    </div>
    <div class="id">{item.id}</div>
  </button>
  {#if item.replies}
    <Branch items={item.replies} />
  {/if}
{/if}
