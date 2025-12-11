<template>
  <div>
    <!-- لیست استوری‌های اصلی -->
    <div class="business-stories-container">
      <div class="business-stories" ref="storiesContainer">
        <div
          class="story"
          :class="{ 
            'story-seen': isStorySeen(business.id), 
            'story-new': !isStorySeen(business.id) 
          }"
          v-for="(business, index) in businesses"
          :key="business.id"
          @click="openStory(index)"
        >
          <img :src="business.logo" alt="Logo" class="story-image" />
          <div class="story-name">{{ business.name }}</div>
        </div>
      </div>
      
      <!-- دکمه‌های ناوبری اسکرول -->
      <button 
        v-if="showScrollButtons" 
        class="scroll-button scroll-left" 
        @click="scrollStories(-1)"
        :disabled="scrollPosition <= 0"
      >
        ›
      </button>
      <button 
        v-if="showScrollButtons" 
        class="scroll-button scroll-right" 
        @click="scrollStories(1)"
        :disabled="scrollPosition >= maxScrollPosition"
      >
        ‹
      </button>
    </div>

    <!-- مود فول‌اسکرین برای نمایش استوری‌ها -->
    <div v-if="showFullScreen" class="full-screen-story">
      <!-- نوار پیشرفت -->
      <div class="progress-bars">
        <div 
          v-for="(business, index) in businesses" 
          :key="business.id"
          class="progress-bar-container"
        >
          <div 
            class="progress-fill"
            :class="{ 'completed': index < currentIndex }"
            :style="{ 
              width: index === currentIndex ? progress + '%' : 
                     (index < currentIndex ? '100%' : '0%') 
            }"
          ></div>
        </div>
      </div>
      
      <div class="close-button" @click="closeStory">✕</div>
      <div class="control-button" @click="togglePause">
        {{ isPaused ? '▶' : '⏸' }}
      </div>
      
      <!-- ناحیه‌های کلیک برای رفتن به استوری بعدی/قبلی -->
      <div class="click-area left" @click="prevStory"></div>
      <div class="click-area right" @click="nextStory"></div>
      
      <div 
        class="story-container" 
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
        @mousedown="onMouseDown"
        @mousemove="onMouseMove"
        @mouseup="onMouseEnd"
        @mouseleave="onMouseEnd"
      >
        <div
          class="full-story"
          v-for="business in businesses"
          :key="business.id"
        >
          <!-- تصویر یا ویدیوی استوری -->
          <img 
            v-if="business.type === 'image'" 
            :src="business.media" 
            class="story-media"
          />
          <video 
            v-else-if="business.type === 'video'" 
            :src="business.media" 
            autoplay
            muted
            class="story-media"
            @ended="onVideoEnded"
          ></video>
          
          <!-- هدر استوری -->
          <div class="story-header">
            <img :src="business.logo" class="header-logo" />
            <div class="header-info">
              <div class="business-name">{{ business.name }}</div>
              <div class="story-time">{{ formatTime(business.timestamp) }}</div>
            </div>
          </div>
          
          <!-- CTA Button -->
          <div v-if="business.cta" class="story-cta">
            <button class="cta-button">{{ business.cta }}</button>
          </div>
          
          <!-- دکمه‌های تعامل -->
          <div class="reaction-buttons">
            <button class="reaction-button" @click="likeStory(business.id)">❤️</button>
            <button class="reaction-button" @click="sendMessage(business.id)">💬</button>
            <button class="reaction-button" @click="shareStory(business.id)">↗️</button>
          </div>
          
          <!-- تعداد بازدیدها -->
          <div class="view-count">
            👁️ {{ business.views }} بازدید
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BusinessStories",
  data() {
    return {
      businesses: [
        {
          id: 1,
          name: "کافه کتاب",
          logo: "https://picsum.photos/100/100?random=1",
          type: "image",
          media: "https://picsum.photos/800/1400?random=10",
          duration: 5000,
          cta: "مشاهده منو",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          views: 124,
          seen: false
        },
        {
          id: 2,
          name: "فروشگاه پوشاک", 
          logo: "https://picsum.photos/100/100?random=2",
          type: "video",
          media: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
          duration: 7000,
          cta: "خرید آنلاین",
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          views: 89,
          seen: false
        },
        {
          id: 3,
          name: "رستوران ایتالیایی",
          logo: "https://picsum.photos/100/100?random=3",
          type: "image",
          media: "https://picsum.photos/800/1400?random=20",
          duration: 5000,
          cta: "رزرو میز",
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          views: 210,
          seen: false
        },
        {
          id: 4,
          name: "سالن ورزشی",
          logo: "https://picsum.photos/100/100?random=4",
          type: "image",
          media: "https://picsum.photos/800/1400?random=30",
          duration: 5000,
          cta: "عضویت رایگان",
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          views: 156,
          seen: false
        },
        {
          id: 5,
          name: "آتلیه عکاسی",
          logo: "https://picsum.photos/100/100?random=5",
          type: "image",
          media: "https://picsum.photos/800/1400?random=40",
          duration: 5000,
          cta: "رزرو جلسه",
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
          views: 98,
          seen: false
        },
        {
          id: 6,
          name: "کافی شاپ مدرن",
          logo: "https://picsum.photos/100/100?random=6",
          type: "video",
          media: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          duration: 6000,
          cta: "سفارش آنلاین",
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
          views: 167,
          seen: false
        },
        {
          id: 7,
          name: "بوتیک لباس",
          logo: "https://picsum.photos/100/100?random=7",
          type: "image",
          media: "https://picsum.photos/800/1400?random=50",
          duration: 5000,
          cta: "تخفیف ویژه",
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
          views: 203,
          seen: false
        },
        {
          id: 8,
          name: "سالن زیبایی",
          logo: "https://picsum.photos/100/100?random=8",
          type: "image",
          media: "https://picsum.photos/800/1400?random=60",
          duration: 5000,
          cta: "نوبت دهی",
          timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000),
          views: 145,
          seen: false
        },
        {
          id: 9,
          name: "فروشگاه موبایل",
          logo: "https://picsum.photos/100/100?random=9",
          type: "video",
          media: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          duration: 8000,
          cta: "مشاهده محصولات",
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
          views: 278,
          seen: false
        },
        {
          id: 10,
          name: "رستوران سنتی",
          logo: "https://picsum.photos/100/100?random=10",
          type: "image",
          media: "https://picsum.photos/800/1400?random=70",
          duration: 5000,
          cta: "منوی روز",
          timestamp: new Date(Date.now() - 9 * 60 * 60 * 1000),
          views: 189,
          seen: false
        },
        {
          id: 11,
          name: "کلینیک دندانپزشکی",
          logo: "https://picsum.photos/100/100?random=11",
          type: "image",
          media: "https://picsum.photos/800/1400?random=80",
          duration: 5000,
          cta: "نوبت مشاوره",
          timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000),
          views: 132,
          seen: false
        },
        {
          id: 12,
          name: "فروشگاه کتاب",
          logo: "https://picsum.photos/100/100?random=12",
          type: "video",
          media: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
          duration: 7500,
          cta: "تخفیف کتاب",
          timestamp: new Date(Date.now() - 11 * 60 * 60 * 1000),
          views: 95,
          seen: false
        }
      ],
      showFullScreen: false,
      currentIndex: 0,
      progress: 0,
      isPaused: false,
      seenStories: [],
      
      // متغیرهای مربوط به swipe
      touchStartX: 0,
      touchEndX: 0,
      isSwiping: false,
      swipeDistance: 0,
      
      // تایمرها
      timer: null,
      progressInterval: null,
      
      // متغیرهای اسکرول
      scrollPosition: 0,
      maxScrollPosition: 0,
      containerWidth: 0,
      showScrollButtons: false
    };
  },
  computed: {
    currentStory() {
      return this.businesses[this.currentIndex];
    }
  },
  methods: {
    openStory(index) {
      this.currentIndex = index;
      this.showFullScreen = true;
      
      // افزایش تعداد بازدید
      if (!this.businesses[index].seen) {
        this.businesses[index].views += 1;
        this.businesses[index].seen = true;
        if (!this.seenStories.includes(this.businesses[index].id)) {
          this.seenStories.push(this.businesses[index].id);
        }
      }
      
      this.startTimer();
    },
    
    closeStory() {
      this.showFullScreen = false;
      this.clearTimer();
      this.progress = 0;
      this.isPaused = false;
    },
    
    nextStory() {
      if (this.currentIndex < this.businesses.length - 1) {
        this.currentIndex++;
        
        // افزایش تعداد بازدید
        if (!this.businesses[this.currentIndex].seen) {
          this.businesses[this.currentIndex].views += 1;
          this.businesses[this.currentIndex].seen = true;
          if (!this.seenStories.includes(this.businesses[this.currentIndex].id)) {
            this.seenStories.push(this.businesses[this.currentIndex].id);
          }
        }
        
        this.startTimer();
      } else {
        this.closeStory();
      }
    },
    
    prevStory() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
        this.startTimer();
      }
    },
    
    startTimer() {
      this.clearTimer();
      if (this.isPaused) return;
      
      this.progress = 0;
      
      const duration = this.currentStory.type === 'video' ? 
        (this.currentStory.duration || 7000) : 
        (this.currentStory.duration || 5000);
      
      // تایمر اصلی برای تغییر استوری
      this.timer = setTimeout(() => {
        this.nextStory();
      }, duration);
      
      // اینتروال برای پیشرفت نوار
      this.progressInterval = setInterval(() => {
        if (!this.isPaused) {
          this.progress += (100 / duration) * 50;
          if (this.progress >= 100) {
            clearInterval(this.progressInterval);
          }
        }
      }, 50);
    },
    
    clearTimer() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      if (this.progressInterval) {
        clearInterval(this.progressInterval);
        this.progressInterval = null;
      }
    },
    
    togglePause() {
      this.isPaused = !this.isPaused;
      if (this.isPaused) {
        this.clearTimer();
      } else {
        this.startTimer();
      }
    },
    
    onVideoEnded() {
      // اگر ویدیو تمام شد، به استوری بعدی برو
      this.nextStory();
    },
    
    // متدهای مربوط به swipe
    onTouchStart(e) {
      this.touchStartX = e.touches[0].clientX;
      this.isSwiping = true;
      this.clearTimer();
    },
    
    onTouchMove(e) {
      if (!this.isSwiping) return;
      this.touchEndX = e.touches[0].clientX;
      this.swipeDistance = this.touchStartX - this.touchEndX;
    },
    
    onTouchEnd() {
      if (!this.isSwiping) return;
      
      if (Math.abs(this.swipeDistance) > 50) {
        if (this.swipeDistance > 0) {
          this.nextStory();
        } else {
          this.prevStory();
        }
      } else {
        this.startTimer();
      }
      
      this.isSwiping = false;
      this.swipeDistance = 0;
    },
    
    // متدهای mouse events برای دسکتاپ
    onMouseDown(e) {
      this.touchStartX = e.clientX;
      this.isSwiping = true;
      this.clearTimer();
    },
    
    onMouseMove(e) {
      if (!this.isSwiping) return;
      this.touchEndX = e.clientX;
      this.swipeDistance = this.touchStartX - this.touchEndX;
    },
    
    onMouseEnd() {
      this.onTouchEnd();
    },
    
    // متدهای تعامل با استوری
    likeStory(id) {
      console.log(`لایک کردید استوری با ID: ${id}`);
      // پیاده‌سازی منطق لایک
    },
    
    sendMessage(id) {
      console.log(`ارسال پیام برای استوری با ID: ${id}`);
      // پیاده‌سازی منطق ارسال پیام
    },
    
    shareStory(id) {
      console.log(`اشتراک‌گذاری استوری با ID: ${id}`);
      // پیاده‌سازی منطق اشتراک‌گذاری
    },
    
    // utility methods
    formatTime(timestamp) {
      const now = new Date();
      const diff = now - timestamp;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      
      if (hours < 1) {
        const minutes = Math.floor(diff / (1000 * 60));
        return `${minutes} دقیقه پیش`;
      } else if (hours < 24) {
        return `${hours} ساعت پیش`;
      } else {
        const days = Math.floor(hours / 24);
        return `${days} روز پیش`;
      }
    },
    
    isStorySeen(id) {
      return this.seenStories.includes(id);
    },
    
    // متدهای اسکرول
    scrollStories(direction) {
      const scrollAmount = 300; // مقدار اسکرول در هر کلیک
      const newPosition = this.scrollPosition + (direction * scrollAmount);
      
      // محدود کردن اسکرول به بازه مجاز
      this.scrollPosition = Math.max(0, Math.min(newPosition, this.maxScrollPosition));
      
      // اعمال اسکرول
      if (this.$refs.storiesContainer) {
        this.$refs.storiesContainer.scrollLeft = this.scrollPosition;
      }
    },
    
    updateScrollInfo() {
      if (this.$refs.storiesContainer) {
        const container = this.$refs.storiesContainer;
        this.containerWidth = container.offsetWidth;
        const contentWidth = container.scrollWidth;
        this.maxScrollPosition = contentWidth - this.containerWidth;
        this.showScrollButtons = this.maxScrollPosition > 0;
      }
    },
    
    handleScroll() {
      if (this.$refs.storiesContainer) {
        this.scrollPosition = this.$refs.storiesContainer.scrollLeft;
      }
    }
  },
  
  mounted() {
    this.updateScrollInfo();
    window.addEventListener('resize', this.updateScrollInfo);
    
    // اضافه کردن event listener برای اسکرول
    if (this.$refs.storiesContainer) {
      this.$refs.storiesContainer.addEventListener('scroll', this.handleScroll);
    }
  },
  
  beforeUnmount() {
    this.clearTimer();
    window.removeEventListener('resize', this.updateScrollInfo);
    
    if (this.$refs.storiesContainer) {
      this.$refs.storiesContainer.removeEventListener('scroll', this.handleScroll);
    }
  },
  
  updated() {
    this.updateScrollInfo();
  }
};
</script>

<style scoped>
.business-stories-container {
  position: relative;
  padding: 0 30px; /* فضای کافی برای دکمه‌های اسکرول */
}

.business-stories {
  display: flex;
  overflow-x: scroll;
  padding: 15px 0;
  gap: 15px;
  border-bottom: 1px solid #e6ecf0;
  background: #fff;
  direction: ltr; /* جهت پیمایش ثابت برای دکمه‌های چپ/راست */
 
}

.business-stories::-webkit-scrollbar {
  display: none;
}

.scroll-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  z-index: 10;
  transition: all 0.3s ease;
}

.scroll-button:hover:not(:disabled) {
  background: #f0f0f0;
  transform: translateY(-50%) scale(1.1);
}

.scroll-button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.scroll-left {
  left: 5px;
}

.scroll-right {
  right: 5px;
}

.story {
  flex: 0 0 auto;
  width: 80px;
  text-align: center;
  cursor: pointer;
  position: relative;
}

.story-image {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid transparent;
  background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
  padding: 2px;
  transition: transform 0.3s ease;
}

.story-image:hover {
  transform: scale(1.1);
}

.story-name {
  margin-top: 5px;
  font-size: 0.75rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #333;
}

.story-new::after {
  content: "";
  position: absolute;
  top: 0;
  right: 5px;
  width: 12px;
  height: 12px;
  background: #dc2743;
  border: 2px solid white;
  border-radius: 50%;
}

.story-seen .story-image {
  border-color: #ccc !important;
  background: transparent;
  padding: 0;
  border-width: 2px;
}

/* استایل‌های فول‌اسکرین */
.full-screen-story {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  overflow: hidden;
}

.progress-bars {
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  display: flex;
  gap: 3px;
  z-index: 1001;
}

.progress-bar-container {
  flex: 1;
  height: 3px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: white;
  transition: width 0.1s linear;
  width: 0%;
}

.progress-fill.completed {
  width: 100%;
}

.close-button {
  position: absolute;
  top: 20px;
  right: 20px;
  color: #fff;
  font-size: 1.8rem;
  cursor: pointer;
  z-index: 1001;
  background: rgba(0, 0, 0, 0.3);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.control-button {
  position: absolute;
  top: 20px;
  right: 70px;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 1001;
  background: rgba(0, 0, 0, 0.3);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.story-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  transition: transform 0.4s cubic-bezier(0.4, 0.0, 0.2, 1);
}

.full-story {
  flex: 0 0 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  position: relative;
  opacity: 0;
  animation: fadeIn 0.3s ease-in-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(1.05); }
  to { opacity: 1; transform: scale(1); }
}

.story-media {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
}

.story-header {
  position: absolute;
  top: 50px;
  left: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 1002;
}

.header-logo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid white;
  object-fit: cover;
}

.header-info {
  color: white;
}

.business-name {
  font-weight: bold;
  font-size: 1.1rem;
}

.story-time {
  font-size: 0.8rem;
  opacity: 0.8;
}

.story-cta {
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1002;
}

.cta-button {
  background: #1da1f2;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.9rem;
}

.click-area {
  position: absolute;
  top: 0;
  height: 100%;
  width: 25%;
  z-index: 1000;
  cursor: pointer;
}

.click-area.left {
  left: 0;
}

.click-area.right {
  right: 0;
}

.reaction-buttons {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  z-index: 1002;
}

.reaction-button {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.2s, transform 0.2s;
}

.reaction-button:hover {
  opacity: 1;
  transform: scale(1.1);
}

.view-count {
  position: absolute;
  bottom: 20px;
  left: 20px;
  color: white;
  font-size: 0.8rem;
  opacity: 0.8;
  z-index: 1002;
}

/* رسپانسیو برای موبایل */
@media (max-width: 768px) {
  .business-stories-container {
    padding: 0 15px;
  }
  
  .scroll-button {
    width: 25px;
    height: 25px;
    font-size: 1rem;
  }
  
  .scroll-left {
    left: 2px;
  }
  
  .scroll-right {
    right: 2px;
  }
  
  .story {
    width: 70px;
  }
  
  .story-image {
    width: 60px;
    height: 60px;
  }
}
</style>