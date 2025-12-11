<template>
  <div class="story-explorer">
    <h2>نمایش استوری‌های کسب‌وکارها</h2>
    <!-- نمایش گالری -->
    <div class="story-gallery" v-if="!showFullScreen">
      <div v-for="story in stories" :key="story.id" class="story-card" @click="openFullScreen(story)">
        <img v-if="story.type === 'image'" :src="story.url" alt="story" />
        <video v-if="story.type === 'video'" :src="story.url" muted playsinline></video>
        <div class="caption">{{ story.businessName }}</div>
      </div>
    </div>

    <!-- نمایش استوری در حالت تمام صفحه -->
    <div v-if="showFullScreen" class="fullscreen-overlay">
      <button class="close-btn" @click="closeFullScreen">×</button>
      <div class="fullscreen-story" @wheel="handleScroll">
        <img v-if="currentStory.type === 'image'" :src="currentStory.url" alt="story" />
        <video v-if="currentStory.type === 'video'" :src="currentStory.url" controls autoplay muted playsinline></video>
        <div class="caption">{{ currentStory.businessName }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      stories: [
        { id: 1, businessName: "کسب و کار اول", type: "image", url: "/images/story1.jpg" },
        { id: 2, businessName: "کسب و کار دوم", type: "video", url: "/videos/story2.mp4" },
        { id: 3, businessName: "کسب و کار سوم", type: "image", url: "/images/story3.jpg" },
        // بیشتر استوری‌ها
      ],
      showFullScreen: false,
      currentIndex: 0,
    };
  },
  computed: {
    currentStory() {
      return this.stories[this.currentIndex];
    }
  },
  methods: {
    openFullScreen(story) {
      this.currentIndex = this.stories.findIndex(s => s.id === story.id);
      this.showFullScreen = true;
    },
    closeFullScreen() {
      this.showFullScreen = false;
    },
    handleScroll(event) {
      // اسکرول به بالا استوری قبلی، اسکرول به پایین استوری بعدی
      if (event.deltaY > 0) {
        this.nextStory();
      } else {
        this.prevStory();
      }
    },
    nextStory() {
      if (this.currentIndex < this.stories.length - 1) {
        this.currentIndex++;
      }
    },
    prevStory() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
      }
    }
  }
};
</script>

<style scoped>
.story-gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
}

.story-card {
  width: 180px;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  background: white;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.story-card:hover {
  transform: scale(1.05);
}

.story-card img, .story-card video {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.caption {
  font-weight: bold;
  margin: 8px 0;
}

/* حالت تمام صفحه */
.fullscreen-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: black;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 36px;
  color: white;
  background: transparent;
  border: none;
  cursor: pointer;
  z-index: 10;
}

.fullscreen-story img, .fullscreen-story video {
  max-height: 80vh;
  max-width: 90vw;
  object-fit: contain;
}

.fullscreen-story .caption {
  margin-top: 16px;
  color: white;
  font-size: 18px;
}
</style>
