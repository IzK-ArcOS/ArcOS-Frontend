import { get } from "svelte/store";
import searchIcon from "../../../assets/arcfind.svg";
import fileIcon from "../../../assets/mimetypes/text-plain.svg";
import { openUserFile, openWithDialog } from "../../api/fs/open/main";
import type { PartialArcFile } from "../../api/interface";
import { ConnectedServer, apiCall } from "../../api/main";
import { fbState } from "../../applogic/apps/FileBrowser/main";
import { WindowStore } from "../../applogic/store";
import { deleteNotification, makeNotification } from "../../notiflogic/main";
import { UserToken } from "../../userlogic/interfaces";
import type { SearchItem } from "../interface";

let FILE_CACHE: SearchItem[] = [];
let FILES_FAILED = false;

export async function compileSearchableFiles() {
  if (FILE_CACHE.length && FILE_CACHE[0]) return FILE_CACHE;

  const server = get(ConnectedServer);

  if (!server) return [];

  const result: SearchItem[] = [];
  const req = FILES_FAILED
    ? { data: [] }
    : await apiCall(server, "fs/tree", {}, get(UserToken));
  const files = req.data ? (req.data as PartialArcFile[]) : [];

  if (!files.length) FILES_FAILED = true;

  for (let i = 0; i < files.length; i++) {
    result.push({
      caption: files[i].filename,
      action: async () => {
        const notif = makeNotification({
          title: "Loading file",
          message: `Loading file ${files[i].scopedPath} from the ArcAPI. This can take a while, depending on your internet connection and the size of the file.`,
          buttons: [],
          image: searchIcon,
        });

        const scope = files[i].scopedPath;

        if (scope.startsWith("./"))
          files[i].scopedPath = scope.replace("./", "");

        const file = await openUserFile(files[i]);

        deleteNotification(notif);

        WindowStore.set(get(WindowStore));

        if (file == true) return;

        openWithDialog({ ...file, anymime: true });
      },
      description: files[i].scopedPath.replace(`/${files[i].filename}`, ""),
      image: fileIcon,
    });
  }

  FILE_CACHE = result;

  return result;
}

fbState.subscribe(() => {
  FILE_CACHE = [];
});
