<script lang="ts">
  import { onMount } from "svelte";
  import { generateCredToken } from "../../../../../../ts/api/cred";
  import { loginUsingCreds } from "../../../../../../ts/api/getter";
  import { getUserPfp } from "../../../../../../ts/api/pfp";
  import {
    applyLoginState,
    loginUsername,
  } from "../../../../../../ts/login/main";
  import { applyState } from "../../../../../../ts/state/main";
  import {
    UserData,
    UserName,
  } from "../../../../../../ts/userlogic/interfaces";
  import { toBase64 } from "../../../../../../ts/base64";

  export let authenticating: boolean;

  let password: string;
  export let wrongpswd = false;
  export let pfp = "";

  onMount(async () => {
    pfp = await getUserPfp($loginUsername);
  });

  function submit(e: Event) {
    e.preventDefault();

    serverLogin();

    return false;
  }

  async function serverLogin() {
    authenticating = true;

    const userdata = await loginUsingCreds(
      generateCredToken({ username: $loginUsername, password })
    );

    if (!userdata) {
      authenticating = false;
      wrongpswd = true;
      return;
    }

    localStorage.setItem(
      "arcos-remembered-token",
      toBase64(`${$loginUsername}:${password}`)
    );

    UserData.set(userdata);
    UserName.set($loginUsername);

    applyState("desktop");
  }
</script>

<form on:submit={submit}>
  <!-- svelte-ignore a11y-autofocus -->
  <input
    autofocus
    bind:value={password}
    type="password"
    placeholder="Password"
    on:input={() => (wrongpswd = false)}
    class:wrongpswd
  />
</form>
<button
  class="material-icons-round"
  on:click={serverLogin}
  disabled={!password}
>
  arrow_forward_ios
</button>
