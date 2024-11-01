<template>
    <div v-if="isVisible" class="loading-container">
        <div class="spinner-grow" style="width: 3rem; height: 3rem; color: white;" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        isVisible: {
            type: Boolean,
            required: true
        }
    },
    watch: {
        isVisible(newValue) {
            if (newValue) {
                document.body.style.overflow = 'hidden';  // Disable scrolling
                document.body.style.touchAction = 'none';  // Disable touch actions
            } else {
                document.body.style.overflow = '';  // Restore scrolling
                document.body.style.touchAction = '';  // Restore touch actions
            }
        }
    },
    mounted() {
        if (this.isVisible) {
            document.body.style.overflow = 'hidden';
            document.body.style.touchAction = 'none';
        }
    },
    beforeUnmount() {
        // Ensure scroll is enabled when component is destroyed
        document.body.style.overflow = '';
        document.body.style.touchAction = '';
    }
};
</script>

<style scoped>
.loading-container {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 9999;
    /* Ensure this is higher than any other component */
    pointer-events: all;
    /* Ensure it captures all interactions */
}
</style>
