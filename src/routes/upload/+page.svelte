<script>
// @ts-nocheck

  import { onMount } from 'svelte';
  import getVeryfiSession  from "../../../services/session.service";
  
  let VeryfiLens
  let imageFile
  let imageData
  let image

  const CLIENT_ID = "YOUR_CLIENT_ID"

  onMount(async () => {
    const module = await import('veryfi-lens-wasm');
        VeryfiLens = module.default;
        console.log(VeryfiLens)
        const sessionToken = await getVeryfiSession()
        VeryfiLens.initUploadWasm(sessionToken.session, CLIENT_ID)
  });

  const handleImageChange = (event) => {
    console.log("Handling");
    const file = event.target.files[0];
    if (file) {
      imageFile = file;
      const reader = new FileReader();
      reader.onload = async (e) => {
        imageData = e.target.result;
        const finalImage = imageData.split(",")[1];
        image = finalImage;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCrop = async () => {
    const data = await VeryfiLens?.captureUploaded(imageFile);
    image = data;
    imageData = `data:image/png;base64,${data}`
  };
</script>

<div class="absolute flex flex-col justify-center items-center h-full w-full bg-[#171C3A]">
  <div class="absolute right-5 top-0">
    <a href="/" class="absolute top-5 right-[5%] md:right-[35%] z-[60] bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">X</a>
  </div>
  {#if image}
  <div class="absolute top-5 flex flex-col h-full ">
    <img class="rounded-md bg-slate-200 shadow-md p-4 m-2 max-h-[65vh] max-w-[400px] overflow-auto" src={imageData} alt="Receipt" />
    <button class="submitButton text-white font-bold p-1 m-1 z-50 rounded-sm" on:click={handleCrop}>Submit</button>
  </div>
  {/if}
  <div class="absolute bottom-28 flex bg-slate-200 rounded-md shadow-md p-4 m-2 gap-1 justify-center items-center h-[70px] mt-4">
    <input class="file:bg-[#00FA6C] file:hover:bg-green-500 file:rounded-sm file:border-0 file:p-2 file:mr-5 file:cursor-pointer cursor-pointer text-black"
      type="file" accept="image/*" on:change={handleImageChange} />
  </div>
</div>
