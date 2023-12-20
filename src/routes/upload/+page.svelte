<script>
  // @ts-nocheck

  import { onMount } from "svelte";
  import getVeryfiSession from "../../../services/session.service";

  let VeryfiLens;
  let imageFile;
  let fileInput;
  let imageData;
  let image;
  let dropArea;

  const CLIENT_ID = "YOUR_CLIENT_ID";

  onMount(async () => {
    const module = await import("veryfi-lens-wasm");
    VeryfiLens = module.default;
    console.log(VeryfiLens);
    const sessionToken = await getVeryfiSession();
    VeryfiLens.initUploadWasm(sessionToken.session, CLIENT_ID);

    // Drag and Drop Events
    dropArea.addEventListener("dragover", handleDragOver);
    dropArea.addEventListener("drop", handleDrop);
  });

  const handleImageChange = (event) => {
    processFile(event.target.files[0]);
  };

  const handleAreaClick = () => {
    console.log("IMA FIRING MAH LAZER");
    fileInput.click();
  };

  const processFile = (file) => {
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

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleCrop();
    }
  };

  const handleCrop = async () => {
    const data = await VeryfiLens?.captureUploaded(imageFile);
    image = data;
    imageData = `data:image/png;base64,${data}`;
  };

  const handleFileInputClick = (event) => {
    event.stopPropagation(); // Prevent the click from bubbling up
  };
</script>

<div
  class="absolute flex flex-col justify-center items-center h-full w-full bg-[#171C3A]"
>
  <div class="absolute right-5 top-0">
    <a
      href="/"
      class="absolute top-5 right-[5%] md:right-[35%] z-[60] bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >X</a
    >
  </div>
  {#if image}
    <div class="absolute top-5 flex flex-col h-full">
      <img
        class="rounded-md bg-slate-200 shadow-md p-4 m-2 max-h-[65vh] max-w-[400px] overflow-auto"
        src={imageData}
        alt="Receipt"
      />
      <button
        class="submitButton text-white font-bold p-1 m-1 z-50 rounded-sm"
        on:click={handleCrop}>Submit</button
      >
    </div>
  {/if}
  <div
    bind:this={dropArea}
    role="button"
    aria-label="Upload image area, click or drop an image here"
    tabindex="0"
    class="absolute bottom-28 flex bg-slate-200 rounded-md shadow-md p-4 m-2 gap-1 justify-center items-center h-[70px] mt-4 border-dashed border-[2px] border-green-500"
    on:dragover={handleDragOver}
    on:drop={handleDrop}
    on:keydown={handleKeyPress}
    on:click={handleAreaClick}
  >
    <div class="drop-area p-4 m-2 text-center cursor-pointer">
      <p>Drag and drop your image here, or click to select a file</p>
      <input
        bind:this={fileInput}
        class="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
        type="file"
        accept="image/*"
        on:change={handleImageChange}
        on:click={handleFileInputClick}
      />
    </div>
  </div>
</div>
