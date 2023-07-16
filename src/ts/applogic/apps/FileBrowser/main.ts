import { get, writable } from "svelte/store";
import warning from "../../../../assets/apps/error.svg";
import { getDirectory } from "../../../api/fs/directory";
import {
  defaultDirectory,
  PartialUserDir,
  UserDirectory,
  PartialArcFile,
  ArcFile,
} from "../../../api/interface";
import { Log } from "../../../console";
import { createOverlayableError } from "../../../errorlogic/overlay";
import { hideOverlay, showOverlay } from "../../../window/overlay";
import trash from "../../../../assets/apps/logger/clear.svg";
import { LogLevel } from "../../../console/interface";
import { deleteItem } from "../../../api/fs/delete";
import { ArcSoundBus } from "../../../sound/main";

export let FileBrowserCurrentDir = writable<string>("./");
export let FileBrowserDirContents = writable<UserDirectory>(defaultDirectory);
export let FileBrowserSelectedFilename = writable<string>(null);
export let FileBrowserOpeningFile = writable<PartialArcFile>(null);
export let FileBrowserDeletingFilename = writable<string>(null);
export let FileBrowserUploadFile = writable<ArcFile>(null);
export let FileBrowserOpenCancelled = writable<boolean>(false);
export let FileBrowserRefreshing = writable<boolean>(false);
export let FileBrowserUploadProgress = writable<number>(0);
export let FileBrowserCuttingFilename = writable<PartialUserDir>(null);
export let FileBrowserCopyingFilename = writable<PartialUserDir>(null);

FileBrowserOpenCancelled.subscribe((v) => {
  if (!v) return;

  createOverlayableError(
    {
      title: "Open cancelled",
      message: "The opening procedure was cancelled by the user.",
      buttons: [{ caption: "OK", action() {} }],
      image: warning,
    },
    "FileManager"
  );

  FileBrowserOpenCancelled.set(false);
});

class FileBrowserClass {
  public async refresh(clearFirst = true) {
    Log(
      "FileBrowser: refresh",
      "Refreshing current directory contents",
      LogLevel.info
    );

    FileBrowserRefreshing.set(true);

    if (clearFirst) {
      FileBrowserDirContents.set(defaultDirectory);
      FileBrowserSelectedFilename.set(null);
    }

    const cd = get(FileBrowserCurrentDir);

    const req = await getDirectory(cd);

    FileBrowserDirContents.set(req || { ...defaultDirectory, scopedPath: cd });

    FileBrowserRefreshing.set(false);
  }

  public async goToDirectory(path: string) {
    Log("FileBrowser: goToDirectory", `Navigating to "${path}"`, LogLevel.info);

    FileBrowserSelectedFilename.set(null);

    FileBrowserCurrentDir.set(path);

    ArcSoundBus.playSound("arcos.click");

    await this.refresh();
  }

  public async deleteItem(name: string, path: string) {
    FileBrowserDeletingFilename.set(name);

    showOverlay("deletingItem", "FileManager");

    const valid = await deleteItem(path);

    if (!valid)
      createOverlayableError(
        {
          title: "Unable to delete item",
          message:
            "ArcAPI was not able to delete the item from the file system. A permission error may have occured. Please try again later.",
          buttons: [{ caption: "OK", action() {} }],
          image: trash,
        },
        "FileManager"
      );

    FileBrowserSelectedFilename.set(null);

    fbClass.refresh();

    setTimeout(() => {
      hideOverlay("deletingItem", "FileManager");
    }, 100);
  }
}

export const fbClass = new FileBrowserClass();
