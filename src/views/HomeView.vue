<template>
  <label for="link">input url</label>
  <input v-model="link" type="text">
  <button @click="download">submit</button>
</template>

<script>
export default {
  data() {
    return {
      link: null
    }
  },
  methods: {
    async download() {
      const data = {
        youtube_url: this.link
      };
      try {
        let response = await fetch(`https://yt-audio-backend-fskt.onrender.com/download_audio`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        console.log(response);

      } catch (error) {
        console.log(error);

      }
    },
    async startTheApp() {
      let response = await fetch(`https://yt-audio-backend-fskt.onrender.com/`);
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
