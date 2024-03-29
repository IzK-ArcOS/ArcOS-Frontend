import { get } from "svelte/store";
import { apiCall, ConnectedServer } from "../api/main";
import { Log } from "../console";
import { LogLevel } from "../console/interface";
import { loginUsername } from "../login/main";
import { UserData, UserName, UserToken } from "../userlogic/interfaces";
import { generateCredToken } from "./cred";
import { fromBase64 } from "../base64";

export async function loginUsingCreds(
  token: string
): Promise<UserData | false> {
  Log(
    "ts/api/getter.ts: loginUsingCreds",
    `Authenticating using <token>`,
    LogLevel.info
  );

  let [name, password] = fromBase64(token).split(":");

  const server = get(ConnectedServer);

  loginUsername.set(name);

  let req = await apiCall(get(ConnectedServer), "auth", {}, null, {
    username: name,
    password,
  });

  if (!req.valid) return false;

  UserToken.set(req.data.token);
  UserName.set(name);

  req = await apiCall(server, `user/properties`, {}, get(UserToken), null);

  if (!req.valid) return false;

  return req;
}

export async function rememberedLogin() {
  Log(
    "ts/api/getter.ts: rememberedLogin",
    `Attempting login using arcos-remembered-token`,
    LogLevel.warn
  );

  const token = localStorage.getItem("arcos-remembered-token");

  if (!token) {
    localStorage.removeItem("arcos-remembered-token");
    return false;
  }

  const [username, password] = fromBase64(token).split(":");

  const userdata = await loginUsingCreds(
    generateCredToken({ username, password })
  );

  if (!userdata) {
    localStorage.removeItem("arcos-remembered-token");
    UserName.set(null);
    UserData.set(null);
    return false;
  }

  UserData.set(userdata);
  UserName.set(username);

  return true;
}
