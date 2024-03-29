import { get, writable } from "svelte/store";
import { apiCall, ConnectedServer } from "../api/main";
import { Log } from "../console";
import { restart } from "../desktop/power";
import { CurrentState } from "../state/main";
import { commitUserdata } from "./commit";
import { AllUsers, UserData, UserToken } from "./interfaces";
import { LogLevel } from "../console/interface";
import { UserCache } from "./cache";

export const committingUserData = writable<boolean>(false);

export async function getUsers(): Promise<AllUsers> {
  const cache = UserCache.get();

  if (cache && Object.entries(cache).length) return cache;

  const server = get(ConnectedServer);

  if (!server) return {};

  const users = await apiCall(server, "users/get", {}, null, null);

  let obj = {};

  const arr = users.data as any[];

  for (let i = 0; i < arr.length; i++) {
    obj[arr[i].username] = arr[i];
  }

  UserCache.set(obj);

  return obj as AllUsers;
}

export async function deleteUser() {
  Log("userlogic/main.ts: deleteUsers", `Delete users`);

  const server = get(ConnectedServer);
  const token = get(UserToken);

  if (!server) return;

  await apiCall(server, "user/delete", {}, token);

  localStorage.removeItem("arcos-remembered-token");

  if (CurrentState.name == "Desktop") restart();
}

export async function setUserdata(data: UserData): Promise<boolean> {
  const server = get(ConnectedServer);

  if (!server) return false;

  const req = await apiCall(
    server,
    "user/properties/update",
    {},
    get(UserToken),
    null,
    JSON.stringify(data)
  );

  if (req.valid) {
    Log(
      "userlogic/main.ts: setUserdata",
      `Userdata committed to API`,
      LogLevel.info
    );
  }

  return;
}

UserData.subscribe(commitUserdata);
