<script lang="ts">
  import "../../../../css/desktop/apps/filebrowser/overlays/deletingfile.css";
  import { fbState } from "../../../../ts/applogic/apps/FileBrowser/main";
  import { TrashIcon } from "../../../../ts/icon/general";
  import Spinner from "../../../Spinner.svelte";
</script>

<div class="deletingfile-wrapper">
  <div class="icon"><img src={TrashIcon} alt="" /></div>
  <div class="caption">
    Deleting {$fbState.deletingFilename}...
  </div>
  <div class="spin"><Spinner height={30} /></div>
</div>
