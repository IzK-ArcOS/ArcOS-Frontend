<script lang="ts">
  import type { MessagingPage } from "../../../../ts/messaging/paging/interface";
  import { messagingPage } from "../../../../ts/messaging/paging/store";

  export let data: MessagingPage;

  function switchTo() {
    $messagingPage = data;
  }
</script>

<button
  class="material-icons-round"
  class:active={$messagingPage && data.name == $messagingPage.name}
  title={data.name}
  on:click={switchTo}
>
  {data.icon}
</button>
