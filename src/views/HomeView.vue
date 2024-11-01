<template>
  <div>
    <label for="link">Input URL:</label>
    <input v-model="link" type="text" placeholder="Enter YouTube URL">
    <button @click="download">Submit</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      link: null,
    };
  },
  methods: {
    async download() {
      const data = {
        youtube_url: this.link,
      };
      console.log(data);

      try {
        let response = await fetch(`http://127.0.0.1:5000/download_audio`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          console.log(response.headers);

          // Create a blob from the response
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);

          // Get the title from the response headers
          const title = response.headers.get("X-Title"); // This should retrieve the title

          // Log the title to see if it is retrieved correctly
          console.log("Retrieved title:", title);

          // Use the title for the download filename or fallback
          const filename = title ? `${title}.mp3` : "downloaded_audio.mp3";

          // Create a link element to trigger the download
          const a = document.createElement('a');
          a.href = url;
          a.download = filename; // Use the title from the server or fallback
          document.body.appendChild(a);
          a.click();
          a.remove(); // Clean up

          // Revoke the object URL after downloading
          window.URL.revokeObjectURL(url);

        } else {
          const errorData = await response.json();
          console.error("Download failed:", errorData);
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    },
    async startTheApp() {
      let response = await fetch(`http://127.0.0.1:5000/`);
      console.log(response);
      console.log('started!');
    }
  },
  mounted() {
    this.startTheApp();
  }
}
</script>

<style scoped></style>
