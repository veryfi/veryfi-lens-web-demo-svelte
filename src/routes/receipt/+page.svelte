<script>
  // @ts-nocheck
  import { onMount } from "svelte";
  import getVeryfiSession from "../../../services/session.service";
  let image;
  let VeryfiLens;
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
    VeryfiLens.init(sessionToken.session, CLIENT_ID);
  });

  const takePhoto = () => {
    if (VeryfiLens) {
      VeryfiLens.capture(setImage, setIsEditing);
    } else {
      console.log("veryfiLens is not initialized");
    }
  };
</script>

<div class="h-full w-full">
  <a
    href="/"
    class="absolute top-5 right-[5%] md:right-[35%] z-[60] bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    >X</a
  >
  {#if !image}
    <div
      class="absolute bg-[#171C3A] flex justify-center w-full h-full overflow-hidden"
      id="veryfi-container"
    />
    <button
      class="absolute bottom-8 sm:bottom-16 left-0 right-0 ml-auto mr-auto border-4 border-white-600 hover:bg-white/50 rounded-full w-16 h-16 z-50"
      on:click={takePhoto}
    />
  {:else}
    <img
      class="absolute left-[40%] top-5 max-w-[300px]"
      src={`data:image/png;base64,${image}`}
      alt="cropped"
    />
  {/if}
</div>
