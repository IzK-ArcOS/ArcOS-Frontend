<script lang="ts">
  import "../../css/desktop/apps/AppInfo.css";
  import { AppInfoId as id } from "../../ts/applogic/apps/AppInfo";
  import { disableApp, enableApp } from "../../ts/applogic/enabling";
  import { closeWindow, openWindow } from "../../ts/applogic/events";
  import { getAppIcon } from "../../ts/applogic/icon";
  import { SystemApps } from "../../ts/applogic/imports/store";
  import type { App } from "../../ts/applogic/interface";
  import { setAppPreference } from "../../ts/applogic/pref";
  import { WindowStore, getWindow } from "../../ts/applogic/store";
  import { createOverlayableError } from "../../ts/errorlogic/overlay";
  import { UserData } from "../../ts/userlogic/interfaces";

  let data: App;
  let isEnabled = true;
  let d = "(unset)";

  function updateState() {
    if (isEnabled) enableApp($id);
    else disableApp($id);

    data = getWindow($id);

    if (!data) return;

    isEnabled = !getWindow($id).disabled;
  }

  id.subscribe(update);
  WindowStore.subscribe(update);

  function update() {
    if (!$id) return;

    data = getWindow($id);

    if (!data) return;

    isEnabled = !getWindow($id).disabled;
  }

  function resetData() {
    createOverlayableError(
      {
        title: "Warning!",
        message:
          "Resetting the application data may result in a loss of personal information related to the app. Are you sure?",
        buttons: [
          {
            caption: "Yes",
            action() {
              delete $UserData.appdata[$id];

              $UserData = $UserData;

              closeWindow($id);
            },
          },
          { caption: "Cancel", action() {}, suggested: true },
        ],
      },
      "AppInfo"
    );
  }
</script>

{#if data}
  <div class="name">
    <div>
      <img src={getAppIcon(data)} alt={data.info.name} />
    </div>
    <div>
      <p class="appname">{data.info.name}</p>
      <p class="description">
        {data.info.description}
        {#if data.parentId}
          ({data.parentId}.{data.id})
        {:else}
          ({data.id})
        {/if}
      </p>
    </div>
    <div class="actions">
      <input
        type="checkbox"
        class="switch"
        disabled={SystemApps.includes($id)}
        bind:checked={isEnabled}
        on:change={updateState}
      />
    </div>
  </div>
  <div class="properties">
    <div class="property">
      <div>Size:</div>
      <div class="value">{data.size.w || d}x{data.size.h || d}</div>
    </div>
    <div class="property">
      <div>Minimal size:</div>
      <div class="value">{data.minSize.w || d}x{data.minSize.h || d}</div>
    </div>

    <div class="property">
      <div>Maximal size:</div>
      <div class="value">{data.maxSize.w || d}x{data.maxSize.h || d}</div>
    </div>
    <hr />
    <div class="property">
      <div>Start position:</div>
      <div class="value">{data.pos.x || d}x{data.pos.y || d}</div>
    </div>
    <div class="property">
      <div>Core Application:</div>
      <div class="value">{data.core || "false"}</div>
    </div>
    <div class="property">
      <div>Window controls:</div>
      <div class="value">
        <div class="controls">
          <button class="material-icons-round" disabled={!data.controls.min}>
            minimize
          </button>
          <button class="material-icons-round" disabled={!data.controls.max}>
            crop_square
          </button>
          <button class="material-icons-round" disabled={!data.controls.cls}>
            close
          </button>
        </div>
      </div>
    </div>
    <div class="property">
      <div>Actions</div>
      <div class="value">
        <button
          on:click={() => openWindow($id)}
          disabled={data.opened || data.disabled || data.core}
        >
          Open
        </button>
        <button on:click={resetData}> Reset Data </button>
      </div>
    </div>
  </div>
{/if}
