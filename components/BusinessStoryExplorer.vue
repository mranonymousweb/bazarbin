<template>
  <div class="reels-explorer">
    <!-- حالت گرید برای نمایش ریلزها -->
    <div v-if="!showFullScreen" class="reels-grid-container">
      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>در حال بارگذاری ریلزها...</p>
      </div>
      
      <div v-else class="reels-grid">
        <div 
          v-for="(reel, index) in reels" 
          :key="reel.id" 
          class="reel-card" 
          @click="openFullScreen(index)"
        >
          <div class="reel-thumbnail" :style="{ backgroundColor: reel.color }">
            <div class="reel-content">
              <span class="business-name-large">{{ reel.businessName }}</span>
            </div>
            
            <!-- هدر کارت ریلز -->
            <div class="card-header">
              <div class="business-info">
                <div class="avatar-placeholder" :style="{ backgroundColor: reel.avatarColor }">
                  {{ getInitials(reel.businessName) }}
                </div>
                <span class="business-name">{{ reel.businessName }}</span>
              </div>
              <button class="order-btn" @click.stop="openOrderModal(reel)">سفارش دهید</button>
            </div>
            
            <!-- فوتر کارت ریلز - بدون بک‌گراند سفید -->
            <div class="card-footer-overlay">
              <p class="card-description">{{ truncateDescription(reel.description) }}</p>
              <div class="engagement-stats">
                <span>❤️ {{ formatNumber(reel.likes) }}</span>
                <span>💬 {{ formatNumber(reel.comments) }}</span>
                <span>👁️ {{ formatNumber(reel.views || 0) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- حالت تمام صفحه -->
    <div v-if="showFullScreen" class="fullscreen-overlay">
      <button class="close-btn" @click="closeFullScreen">×</button>
      
      <!-- Progress bar -->
      <div class="progress-bar">
        <div 
          v-for="(reel, index) in reels" 
          :key="reel.id" 
          class="progress-segment"
          :class="{ 
            'active': index === currentIndex, 
            'completed': index < currentIndex
          }"
        >
          <div class="progress-fill" :style="{ width: index === currentIndex ? progress + '%' : '0%' }"></div>
        </div>
      </div>

      <div 
        class="fullscreen-reel" 
        @wheel="handleWheel" 
        @touchstart="handleTouchStart" 
        @touchmove="handleTouchMove" 
        @touchend="handleTouchEnd"
      >
        <!-- هدر در حالت تمام صفحه -->
        <div class="reel-header">
          <div class="business-info">
            <div class="avatar-placeholder" :style="{ backgroundColor: currentReel.avatarColor }">
              {{ getInitials(currentReel.businessName) }}
            </div>
            <span>{{ currentReel.businessName }}</span>
            <button class="follow-btn">دنبال کنید</button>
          </div>
          <button class="order-btn" @click.stop="openOrderModal(currentReel)">سفارش دهید</button>
        </div>

        <!-- محتوای ریلز -->
        <div class="reel-content-fullscreen" :style="{ backgroundColor: currentReel.color }">
          <div class="content-wrapper">
            <span class="business-name-fullscreen">{{ currentReel.businessName }}</span>
            <p class="fullscreen-description">{{ currentReel.description }}</p>
          </div>
        </div>

        <!-- فوتر در حالت تمام صفحه -->
        <div class="reel-footer">
          <p class="description">{{ currentReel.description }}</p>
          <div class="engagement-stats">
            <span>❤️ {{ formatNumber(currentReel.likes) }}</span>
            <span>💬 {{ formatNumber(currentReel.comments) }}</span>
            <span>🔄 {{ formatNumber(currentReel.shares) }}</span>
            <span>👁️ {{ formatNumber(currentReel.views || 0) }}</span>
          </div>
        </div>

        <!-- Actions عمودی در سمت چپ -->
        <div class="vertical-actions">
          <button class="action-btn" @click.stop="toggleLike" :class="{ 'liked': currentReel.isLiked }">
            <span class="icon">❤️</span>
            <span class="count">{{ formatNumber(currentReel.likes) }}</span>
          </button>
          
          <button class="action-btn" @click.stop="openComments">
            <span class="icon">💬</span>
            <span class="count">{{ formatNumber(currentReel.comments) }}</span>
          </button>
          
          <button class="action-btn" @click.stop="shareReel">
            <span class="icon">🔄</span>
            <span class="count">{{ formatNumber(currentReel.shares) }}</span>
          </button>
          
          <button class="action-btn" @click.stop="toggleBookmark" :class="{ 'bookmarked': currentReel.isBookmarked }">
            <span class="icon">🔖</span>
          </button>
          
          <button class="action-btn" @click.stop="toggleSound">
            <span class="icon">{{ isMuted ? '🔇' : '🔊' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal سفارش -->
    <div v-if="showOrderModal" class="modal-overlay" @click="closeOrderModal">
      <div class="modal-content" @click.stop>
        <h3>سفارش از {{ selectedBusiness?.businessName }}</h3>
        <div class="modal-business-info">
          <div class="avatar-placeholder large" :style="{ backgroundColor: selectedBusiness?.avatarColor }">
            {{ getInitials(selectedBusiness?.businessName) }}
          </div>
          <p>شماره تماس: ۰۹۱۲XXXXXX</p>
          <p>آدرس: تهران، خیابان نمونه</p>
        </div>
        <div class="modal-actions">
          <button class="modal-btn primary">تماس</button>
          <button class="modal-btn secondary">چت</button>
          <button class="modal-btn outline">ذخیره مخاطب</button>
        </div>
        <button class="close-modal" @click="closeOrderModal">بستن</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReelsExplorer',
  data() {
    return {
      reels: [],
      isLoading: true,
      showFullScreen: false,
      currentIndex: 0,
      progress: 0,
      startY: 0,
      currentY: 0,
      threshold: 50,
      imageTimer: null,
      imageDuration: 5000,
      showOrderModal: false,
      selectedBusiness: null,
      isMuted: true,
      colors: [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
        '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
        '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2',
        '#A9DFBF', '#F9E79F', '#D2B4DE', '#AED6F1', '#FAD7A0'
      ]
    };
  },

  mounted() {
    this.loadReels();
  },

  computed: {
    currentReel() {
      return this.reels[this.currentIndex] || {};
    }
  },

  watch: {
    currentIndex() {
      this.resetMedia();
      this.progress = 0;
    },
    showFullScreen(newVal) {
      if (!newVal) {
        this.resetMedia();
      }
    }
  },

  methods: {
    loadReels() {
      // شبیه‌سازی بارگذاری
      setTimeout(() => {
        this.reels = this.generateSampleReels();
        this.isLoading = false;
      }, 1000);
    },

    generateSampleReels() {
      const businesses = [
        {
          id: 1,
          businessName: "رستوران ایرانی",
          description: "غذاهای خوشمزه ایرانی با بهترین کیفیت و سرویس سریع",
          likes: 1230,
          comments: 45,
          shares: 12,
          views: 4500
        },
        {
          id: 2,
          businessName: "کافی شاپ مدرن",
          description: "قهوه‌های ویژه در فضایی دنج و آرامش بخش با وای فای رایگان",
          likes: 890,
          comments: 23,
          shares: 8,
          views: 3200
        },
        {
          id: 3,
          businessName: "سالن زیبایی",
          description: "جدیدترین خدمات آرایشی و بهداشتی با کادری مجرب و حرفه‌ای",
          likes: 2000,
          comments: 67,
          shares: 34,
          views: 8900
        },
        {
          id: 4,
          businessName: "فروشگاه پوشاک",
          description: "شیک‌ترین مدل‌های پاییزه ۲۰۲۴ با гаранتی کیفیت و قیمت مناسب",
          likes: 1500,
          comments: 89,
          shares: 45,
          views: 6700
        },
        {
          id: 5,
          businessName: "تعمیرگاه خودرو",
          description: "تعمیرات تخصصی انواع خودروهای داخلی و خارجی با ضمانت نامه",
          likes: 800,
          comments: 34,
          shares: 15,
          views: 2800
        },
        {
          id: 6,
          businessName: "آتلیه عکاسی",
          description: "عکاسی صنعتی، پرتره و مراسمات با جدیدترین تجهیزات",
          likes: 2100,
          comments: 78,
          shares: 42,
          views: 7500
        },
        {
          id: 7,
          businessName: "سالن ورزشی",
          description: "تمرینات تخصصی با مربیان حرفه‌ای و تجهیزات به روز",
          likes: 3200,
          comments: 156,
          shares: 67,
          views: 12000
        },
        {
          id: 8,
          businessName: "سفره خانه سنتی",
          description: "محیطی سنتی با غذاهای محلی و دکوراسیون اصیل ایرانی",
          likes: 1800,
          comments: 92,
          shares: 38,
          views: 8500
        },
        {
          id: 9,
          businessName: "آژانس مسافرتی",
          description: "تورهای داخلی و خارجی با بهترین قیمت و خدمات",
          likes: 950,
          comments: 41,
          shares: 23,
          views: 5200
        },
        {
          id: 10,
          businessName: "کلینیک دندانپزشکی",
          description: "خدمات تخصصی دندانپزشکی با پیشرفته‌ترین تجهیزات",
          likes: 2700,
          comments: 134,
          shares: 56,
          views: 9800
        },
        {
          id: 11,
          businessName: "نانوایی سنتی",
          description: "نان‌های محلی و سنتی با کیفیت عالی و قیمت مناسب",
          likes: 1200,
          comments: 67,
          shares: 29,
          views: 6100
        },
        {
          id: 12,
          businessName: "مشاور املاک",
          description: "خرید، فروش و رهن اجاره املاک در بهترین مناطق",
          likes: 890,
          comments: 38,
          shares: 17,
          views: 4300
        },
        {
          id: 13,
          businessName: "آرایشگاه مردانه",
          description: "مدل‌های روز دنیا با کادری مجرب و خدمات ویژه",
          likes: 1500,
          comments: 78,
          shares: 34,
          views: 7200
        },
        {
          id: 14,
          businessName: "لابراتوار عکاسی",
          description: "چاپ عکس با کیفیت بالا و خدمات دیجیتال عکاسی",
          likes: 1100,
          comments: 52,
          shares: 26,
          views: 5800
        },
        {
          id: 15,
          businessName: "تعمیرات موبایل",
          description: "تعمیرات تخصصی انواع موبایل با گارانتی معتبر",
          likes: 1350,
          comments: 63,
          shares: 31,
          views: 6900
        }
      ];

      return businesses.map((business, index) => ({
        ...business,
        isLiked: false,
        isBookmarked: false,
        color: this.colors[index % this.colors.length],
        avatarColor: this.colors[(index + 3) % this.colors.length]
      }));
    },

    getInitials(name) {
      if (!name) return '';
      return name.split(' ').map(word => word[0]).join('').substring(0, 2);
    },

    formatNumber(num) {
      if (!num && num !== 0) return '0';
      if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
      }
      if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
      }
      return num.toString();
    },

    truncateDescription(desc, maxLength = 60) {
      if (!desc) return '';
      return desc.length > maxLength ? desc.substring(0, maxLength) + '...' : desc;
    },

    openFullScreen(index) {
      this.currentIndex = index;
      this.showFullScreen = true;
      this.$nextTick(() => {
        this.startImageTimer();
      });
    },

    closeFullScreen() {
      this.showFullScreen = false;
    },

    resetMedia() {
      if (this.imageTimer) {
        clearTimeout(this.imageTimer);
      }
    },

    startImageTimer() {
      this.resetMedia();
      
      this.imageTimer = setTimeout(() => {
        this.progress = 100;
        setTimeout(() => {
          this.nextReel();
        }, 300);
      }, this.imageDuration);

      const startTime = Date.now();
      const updateProgress = () => {
        const elapsed = Date.now() - startTime;
        this.progress = Math.min((elapsed / this.imageDuration) * 100, 100);
        
        if (elapsed < this.imageDuration) {
          requestAnimationFrame(updateProgress);
        }
      };
      updateProgress();
    },

    handleWheel(event) {
      event.preventDefault();
      if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
        if (event.deltaY > 0) {
          this.nextReel();
        } else {
          this.prevReel();
        }
      }
    },

    handleTouchStart(event) {
      this.startY = event.touches[0].clientY;
    },

    handleTouchMove(event) {
      event.preventDefault();
      this.currentY = event.touches[0].clientY;
    },

    handleTouchEnd() {
      const deltaY = this.startY - this.currentY;
      if (Math.abs(deltaY) > this.threshold) {
        if (deltaY > 0) {
          this.nextReel();
        } else {
          this.prevReel();
        }
      }
    },

    nextReel() {
      if (this.reels.length === 0) return;
      
      if (this.currentIndex < this.reels.length - 1) {
        this.currentIndex++;
      } else {
        this.currentIndex = 0;
      }
    },

    prevReel() {
      if (this.reels.length === 0) return;
      
      if (this.currentIndex > 0) {
        this.currentIndex--;
      } else {
        this.currentIndex = this.reels.length - 1;
      }
    },

    toggleLike() {
      const reel = this.reels[this.currentIndex];
      if (reel) {
        reel.isLiked = !reel.isLiked;
        reel.likes += reel.isLiked ? 1 : -1;
      }
    },

    toggleBookmark() {
      const reel = this.reels[this.currentIndex];
      if (reel) {
        reel.isBookmarked = !reel.isBookmarked;
      }
    },

    toggleSound() {
      this.isMuted = !this.isMuted;
    },

    openComments() {
      alert('سیستم کامنت‌ها به زودی راه‌اندازی می‌شود...');
    },

    shareReel() {
      const reel = this.reels[this.currentIndex];
      if (reel) {
        reel.shares += 1;
        alert(`ریلز ${reel.businessName} به اشتراک گذاشته شد!`);
      }
    },

    openOrderModal(reel) {
      this.selectedBusiness = reel;
      this.showOrderModal = true;
    },

    closeOrderModal() {
      this.showOrderModal = false;
      this.selectedBusiness = null;
    }
  },

  beforeUnmount() {
    this.resetMedia();
  }
};
</script>

<style scoped>
.reels-explorer {
  direction: rtl;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #000; /* پس‌زمینه مشکی برای کل صفحه */
  min-height: 100vh;
  width: 100%;
  margin: 0;
  padding: 0;
}

/* استایل گرید */
.reels-grid-container {
  padding: 10px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}

.loading-state {
  text-align: center;
  padding: 60px 20px;
  color: #fff;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #ff385c;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.reels-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 5 ستون در دسکتاپ */
  gap: 8px;
  width: 100%;
  margin: 0 auto;
}

.reel-card {
  background: transparent;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;
  aspect-ratio: 9/16; /* نسبت ابعاد شبیه ریلز */
  position: relative;
}

.reel-card:hover {
  transform: scale(1.02);
}

.reel-thumbnail {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: bold;
}

.reel-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  z-index: 2;
  flex: 1;
}

.business-name-large {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

/* هدر کارت */
.card-header {
  position: absolute;
  top: 8px;
  right: 8px;
  left: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 3;
}

.business-info {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(0, 0, 0, 0.6);
  padding: 4px 8px;
  border-radius: 15px;
  backdrop-filter: blur(10px);
}

.business-name {
  color: white;
  font-weight: 600;
  font-size: 12px;
}

.avatar-placeholder {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 12px;
}

.order-btn {
  background: #ff385c;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 10px;
  white-space: nowrap;
}

.order-btn:hover {
  background: #e03150;
  transform: scale(1.05);
}

/* فوتر کارت - بدون بک‌گراند سفید */
.card-footer-overlay {
  position: absolute;
  bottom: 8px;
  right: 8px;
  left: 8px;
  z-index: 3;
  color: white;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  padding: 12px 8px 8px;
  border-radius: 0 0 8px 8px;
}

.card-description {
  margin: 0 0 6px 0;
  font-size: 12px;
  line-height: 1.3;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
}

.engagement-stats {
  display: flex;
  gap: 10px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.9);
}

/* حالت تمام صفحه */
.fullscreen-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: black;
  z-index: 1000;
  overflow: hidden;
}

.close-btn {
  position: absolute;
  top: 20px;
  left: 20px;
  font-size: 36px;
  color: white;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.7);
}

.progress-bar {
  position: absolute;
  top: 0;
  left: 20px;
  right: 20px;
  height: 3px;
  background: rgba(255, 255, 255, 0.3);
  z-index: 5;
  display: flex;
  gap: 4px;
}

.progress-segment {
  flex: 1;
  height: 100%;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  overflow: hidden;
}

.progress-segment.active {
  background: rgba(255, 255, 255, 0.5);
}

.progress-segment.completed {
  background: #ff385c;
}

.progress-fill {
  height: 100%;
  background: #ff385c;
  transition: width 0.1s ease;
}

.fullscreen-reel {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.reel-header {
  position: absolute;
  top: 80px;
  right: 20px;
  left: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 3;
}

.reel-header .business-info {
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
  font-size: 16px;
}

.follow-btn {
  background: transparent;
  color: white;
  border: 1px solid white;
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 12px;
  cursor: pointer;
  margin-right: 10px;
  transition: all 0.3s ease;
}

.follow-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.reel-content-fullscreen {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.content-wrapper {
  text-align: center;
  color: white;
  z-index: 2;
}

.business-name-fullscreen {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 16px;
  display: block;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.fullscreen-description {
  font-size: 18px;
  max-width: 80%;
  margin: 0 auto;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  line-height: 1.4;
}

.reel-footer {
  position: absolute;
  bottom: 20px;
  right: 20px;
  left: 100px;
  z-index: 3;
  color: white;
}

.description {
  margin: 0 0 12px 0;
  font-size: 16px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
  line-height: 1.4;
}

/* Actions عمودی */
.vertical-actions {
  position: absolute;
  left: 20px;
  bottom: 100px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  z-index: 3;
}

.action-btn {
  background: transparent;
  border: none;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 8px;
  transition: transform 0.2s ease;
}

.action-btn:hover {
  transform: scale(1.1);
}

.action-btn.liked .icon {
  color: #ff385c;
}

.action-btn.bookmarked .icon {
  color: #ffd700;
}

.icon {
  font-size: 24px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8));
}

.count {
  font-size: 12px;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 16px;
  max-width: 400px;
  width: 90%;
  text-align: center;
}

.modal-content h3 {
  margin: 0 0 20px 0;
  color: #333;
}

.modal-business-info {
  margin: 20px 0;
}

.modal-business-info p {
  margin: 8px 0;
  color: #666;
}

.avatar-placeholder.large {
  width: 80px;
  height: 80px;
  font-size: 24px;
  margin: 0 auto 15px;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin: 20px 0;
}

.modal-btn {
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.modal-btn.primary {
  background: #ff385c;
  color: white;
}

.modal-btn.secondary {
  background: #4ECDC4;
  color: white;
}

.modal-btn.outline {
  background: transparent;
  border: 2px solid #666;
  color: #666;
}

.close-modal {
  background: #666;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 10px;
}

/* رسپانسیو - دقیقاً مانند اکسپلورر اینستاگرام */
@media (max-width: 1200px) {
  .reels-grid {
    grid-template-columns: repeat(4, 1fr); /* 4 ستون در تبلت بزرگ */
  }
}

@media (max-width: 768px) {
  .reels-grid {
    grid-template-columns: repeat(3, 1fr); /* 3 ستون در تبلت */
    gap: 6px;
  }
  
  .reels-grid-container {
    padding: 8px;
  }
  
  .business-name-large {
    font-size: 16px;
  }
  
  .card-description {
    font-size: 11px;
  }
  
  .engagement-stats {
    font-size: 10px;
    gap: 8px;
  }
  
  .vertical-actions {
    left: 10px;
    bottom: 80px;
    gap: 15px;
  }
  
  .reel-footer {
    left: 80px;
  }
}

@media (max-width: 480px) {
  .reels-grid {
    grid-template-columns: repeat(2, 1fr); /* 2 ستون در موبایل */
    gap: 4px;
  }
  
  .reels-grid-container {
    padding: 4px;
  }
  
  .business-name {
    font-size: 10px;
  }
  
  .order-btn {
    padding: 4px 8px;
    font-size: 9px;
  }
  
  .avatar-placeholder {
    width: 24px;
    height: 24px;
    font-size: 10px;
  }
  
  .card-header {
    flex-direction: column;
    gap: 4px;
    align-items: flex-start;
  }
  
  .business-info {
    font-size: 10px;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}

@media (max-width: 320px) {
  .reels-grid {
    grid-template-columns: 1fr; /* 1 ستون در موبایل کوچک */
  }
}
</style>