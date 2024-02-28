<script>
  // @ts-nocheck

  import { onMount } from "svelte";
  import getVeryfiSession from "../../../services/session.service";
  let VeryfiLens;
  let isStitching = false;
  let image;

  const CLIENT_ID = "YOUR_CLIENT_ID";

  const setImage = (img) => {
    image = img;
  };
  const setIsEditing = (editing) => {
    editing = editing;
  };

  onMount(async () => {
    const module = await import("veryfi-lens-wasm");
    VeryfiLens = module.default;
    console.log(VeryfiLens);
    const sessionToken = await getVeryfiSession();
    VeryfiLens.initWasmLong(sessionToken.session, CLIENT_ID);
  });

  function startStitching() {
    if (VeryfiLens) {
      VeryfiLens.startStitching();
      isStitching = true;
    } else {
      console.log("veryfiLens is not initialized");
    }
  }

  function stopStitching() {
    if (VeryfiLens) {
      VeryfiLens.captureLong(setImage, setIsEditing);
    }
  }
</script>

<div class="h-full bg-[#171C3A]">
  <a
    href="/"
    class="absolute top-5 right-[5%] md:right-[35%] z-[60] bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    >X</a
  >
  <div
    id="preview-container"
    class="absolute top-[100px] left-[10px] md:left-[40px] w-[22vw] md:w-[18vw] h-[70vh] rounded-md z-40 overflow-y-hidden border-[1px] border-solid border-green-300"
  ></div>
  {#if !image}
    <div
      id="veryfi-container"
      class="absolute flex justify-center w-full h-full overflow-hidden"
    ></div>
  {:else}
    <img
      class="absolute left-[40%] top-5 max-w-[300px]"
      src={`data:image/png;base64,${image}`}
      alt="document"
    />
  {/if}
  {#if !isStitching}
    <button
      on:click={startStitching}
      class="absolute bottom-8 sm:bottom-16 left-0 right-0 ml-auto mr-auto border-4 border-white-600 hover:bg-white/50 rounded-full w-16 h-16 z-50"
    ></button>
  {:else}
    <button
      on:click={stopStitching}
      class="absolute bottom-8 sm:bottom-16 left-0 right-0 ml-auto mr-auto border-4 border-white-600 hover:bg-white/50 rounded-full w-16 h-16 z-50"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="red"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="none"
        class="ml-[20%] w-8 h-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z"
        />
      </svg></button
    >
  {/if}
</div>
