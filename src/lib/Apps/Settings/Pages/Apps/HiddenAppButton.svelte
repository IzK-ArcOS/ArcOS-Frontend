<script lang="ts">
  import { AppInfoId } from "../../../../../ts/applogic/apps/AppInfo";
  import { closeWindow, openWindow } from "../../../../../ts/applogic/events";
  import { getAppIcon } from "../../../../../ts/applogic/icon";
  import type { App } from "../../../../../ts/applogic/interface";
  import { ArcOSVersion } from "../../../../../ts/env/main";

  export let app: App;

  function manage() {
    closeWindow("AppInfo");
    setTimeout(() => {
      AppInfoId.set(app.id);
      openWindow("AppInfo");
    }, 300);
  }
</script>

<button class="appbutton" class:disabled={app.disabled} on:click={manage}>
  <img src={getAppIcon(app)} alt={app.info.name} class="icon" />
  <div class="info">
    <p class="title">
      {#if app.parentId}
        {app.parentId}.{app.id}
      {:else}
        {app.id}
      {/if}
    </p>
    <p class="description">{app.info.name} (hidden)</p>
  </div>
</button>
