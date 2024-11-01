<template>
  <br>
  <div class="input-sec">
    <label for="link" class="form-label">Input URL</label>
    <input v-model="link" type="text" placeholder="Enter YouTube URL" class="form-control" >
    <br>
    <button @click="download" class="btn btn-outline-light">Submit</button>
  </div>
  <LoadingScreen :isVisible="isLoading"></LoadingScreen>
</template>

<script>
import LoadingScreen from '@/components/LoadingScreen.vue';

export default {
  components:{
    LoadingScreen
  },
  data() {
    return {
      link: null,
      isLoading: false
    };
  },
  methods: {
    async download() {
      const data = {
        youtube_url: this.link,
      };
      console.log(data);

      try {
        this.isLoading = true;
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
      finally {
        this.isLoading = false;
      }
    },
    async startTheApp() {
      try {
        this.isLoading = true;
        let response = await fetch(`http://127.0.0.1:5000/`);
        console.log(response);
        console.log('started!');
      } catch (error) {
        console.log(error);
      }
      finally {
        this.isLoading = false;
      }
    }
  },
  mounted() {
    this.startTheApp();
  }
}
</script>

<style scoped>
.input-sec {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding-left: 10%;
  padding-right: 10%;
}
</style>
