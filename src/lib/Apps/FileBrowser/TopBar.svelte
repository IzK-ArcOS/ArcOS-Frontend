<script lang="ts">
  import type { App } from "../../../ts/applogic/interface";
  import type { ScopedAppData } from "../../../ts/userlogic/interfaces";
  import AdressBar from "./PathCrumbs.svelte";
  import CopyButton from "./TopBar/CopyButton.svelte";
  import CreateButton from "./TopBar/CreateButton.svelte";
  import CutButton from "./TopBar/CutButton.svelte";
  import DeleteButton from "./TopBar/DeleteButton.svelte";
  import NewFolderButton from "./TopBar/NewFolderButton.svelte";
  import ParentDir from "./TopBar/ParentDir.svelte";
  import PasteButton from "./TopBar/PasteButton.svelte";
  import RenameButton from "./TopBar/RenameButton.svelte";
  import UploadFileButton from "./TopBar/UploadFileButton.svelte";
  import Views from "./TopBar/Views.svelte";

  export let appdata: ScopedAppData;
  export let app: App;
</script>

<div class="topbar">
  <ParentDir />
  <AdressBar />
  <div class="right">
    <div class="group">
      <CutButton />
      <CopyButton />
      <PasteButton />
      <div class="sep" />
      <DeleteButton />
      <RenameButton />
    </div>
    <div class="group">
      <NewFolderButton />
      <CreateButton />
      <UploadFileButton />
    </div>
    <Views bind:appdata bind:app />
  </div>
</div>
