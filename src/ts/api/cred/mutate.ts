import { get } from "svelte/store";
import { Log } from "../../console";
import { LogLevel } from "../../console/interface";
import { UserName, UserToken } from "../../userlogic/interfaces";
import { ConnectedServer, apiCall } from "../main";
import { fromBase64, toBase64 } from "../../base64";

export async function changeUsername(old: string, newName: string) {
  Log(
    "ts/api/cred.ts: changeUsername",
    `Attempting to change the username for user ${old}`,
    LogLevel.info
  );

  if (get(UserName) != old) {
    Log(
      "ts/api/cred.ts: changeUsername",
      `Username change failed: the old username does not match the current user`,
      LogLevel.error
    );

    return false;
  }

  const req = await apiCall(
    get(ConnectedServer),
    "user/rename",
    { newname: toBase64(newName) },
    get(UserToken)
  );

  const isValid = req.statusCode == 200;

  UserName.set(newName);

  if (!isValid) {
    Log(
      "ts/api/cred.ts: changeUsername",
      `Username change failed: the API did not permit the username change`,
      LogLevel.error
    );

    return false;
  }

  const remembed = localStorage.getItem("arcos-remembered-token");

  if (!remembed) {
    Log(
      "ts/api/cred.ts: changeUsername",
      `Could not update remembered token: it doesn't exist`,
      LogLevel.warn
    );

    return false;
  }

  const rememberedUsername = fromBase64(remembed).split(":")[0];

  if (rememberedUsername != old) {
    Log(
      "ts/api/cred.ts: changeUsername",
      `Could not update remembered token: the token's `,
      LogLevel.warn
    );

    return false;
  }

  localStorage.setItem(
    "arcos-remembered-token",
    toBase64(`${newName}:${fromBase64(remembed).split(":")[1]}`)
  );

  return isValid;
}

export async function changePassword(
  username: string,
  old: string,
  newPswd: string,
  confirmPswd: string
) {
  Log(
    "ts/api/cred.ts: changePassword",
    `Attempting to change password for user ${username}`,
    LogLevel.info
  );

  if (newPswd != confirmPswd) return false;

  const req = await apiCall(
    get(ConnectedServer),
    "user/changepswd",
    { new: toBase64(newPswd) },
    null,
    { username, password: old }
  );

  const isValid = req.statusCode == 200;

  const remembed = localStorage.getItem("arcos-remembered-token");

  if (!remembed || !isValid) {
    Log(
      "ts/api/cred.ts: changePassword",
      `Password change failed: not valid or no remembered token`,
      LogLevel.error
    );

    return isValid;
  }

  const rememberedUsername = fromBase64(remembed).split(":")[0];

  if (rememberedUsername != username) {
    Log(
      "ts/api/cred.ts: changePassword",
      `Password change failed: the username does not match the current user`,
      LogLevel.error
    );

    return isValid;
  }

  localStorage.setItem(
    "arcos-remembered-token",
    toBase64(`${username}:${newPswd}`)
  );

  return isValid;
}
