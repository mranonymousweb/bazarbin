<template>
  <div>
    <!-- دکمه آپلود استوری جدید -->
    <div class="upload-story-container" v-if="!isUploading">
      <div class="upload-story-button" @click="startUpload">
        <div class="upload-icon">+</div>
        <div class="upload-text">آپلود استوری جدید</div>
      </div>
    </div>

    <!-- مودال آپلود استوری -->
    <div v-if="isUploading" class="upload-modal">
      <div class="upload-content">
        <div class="upload-header">
          <h2>آپلود استوری جدید</h2>
          <button class="close-button" @click="cancelUpload">✕</button>
        </div>

        <!-- فرم آپلود -->
        <div class="upload-form">
          <!-- پیش‌نمایش رسانه -->
          <div class="media-preview" v-if="previewUrl">
            <img v-if="mediaType === 'image'" :src="previewUrl" alt="Preview" class="preview-image" />
            <video v-else-if="mediaType === 'video'" :src="previewUrl" controls class="preview-video"></video>
            <button class="remove-preview" @click="removePreview">حذف</button>
          </div>

          <!-- ناحیه درگ و دراپ -->
          <div 
            class="drop-zone" 
            :class="{ 'drag-over': isDragOver }"
            @drop="onDrop"
            @dragover.prevent="onDragOver"
            @dragleave="onDragLeave"
            @click="triggerFileInput"
            v-if="!previewUrl"
          >
            <div class="drop-zone-content">
              <div class="upload-icon-large">📁</div>
              <p>فایل خود را اینجا رها کنید یا کلیک کنید</p>
              <p class="file-info">پشتیبانی از: JPG, PNG, MP4 (حداکثر ۱۰۰ مگابایت)</p>
            </div>
            <input 
              type="file" 
              ref="fileInput"
              @change="onFileSelect"
              accept="image/jpeg,image/png,video/mp4" 
              style="display: none"
            />
          </div>

          <!-- اطلاعات استوری -->
          <div class="story-info" v-if="previewUrl">
            <div class="form-group">
              <label for="businessName">نام کسب‌وکار:</label>
              <input 
                type="text" 
                id="businessName" 
                v-model="storyData.name" 
                placeholder="نام کسب‌وکار خود را وارد کنید"
              />
            </div>

            <div class="form-group">
              <label for="businessLogo">لوگوی کسب‌وکار (اختیاری):</label>
              <input 
                type="file" 
                id="businessLogo" 
                @change="onLogoSelect"
                accept="image/jpeg,image/png"
                class="logo-input"
              />
              <div class="logo-preview" v-if="logoPreview">
                <img :src="logoPreview" alt="Logo Preview" />
              </div>
            </div>

            <div class="form-group">
              <label for="ctaText">متن دکمه اقدام (CTA):</label>
              <input 
                type="text" 
                id="ctaText" 
                v-model="storyData.cta" 
                placeholder="مثلا: مشاهده منو، خرید آنلاین و..."
              />
            </div>

            <div class="form-group">
              <label>مدت نمایش: {{ storyData.duration / 1000 }} ثانیه</label>
              <input 
                type="range" 
                min="3" 
                max="15" 
                v-model="durationSeconds"
                class="duration-slider"
              />
              <div class="duration-info">
                <span>۳ ثانیه</span>
                <span>۱۵ ثانیه</span>
              </div>
            </div>

            <!-- اطلاعات فایل -->
            <div class="file-info-card" v-if="selectedFile">
              <h4>اطلاعات فایل:</h4>
              <p>نام: {{ selectedFile.name }}</p>
              <p>نوع: {{ mediaType === 'image' ? 'تصویر' : 'ویدیو' }}</p>
              <p>حجم: {{ formatFileSize(selectedFile.size) }}</p>
            </div>
          </div>

          <!-- دکمه‌های اقدام -->
          <div class="action-buttons">
            <button 
              class="btn btn-primary" 
              @click="uploadStory" 
              :disabled="!canUpload"
            >
              آپلود استوری
            </button>
            <button class="btn btn-secondary" @click="cancelUpload">انصراف</button>
          </div>

          <!-- وضعیت آپلود -->
          <div v-if="uploadProgress > 0" class="upload-progress">
            <div class="progress-bar">
              <div 
                class="progress-fill" 
                :style="{ width: uploadProgress + '%' }"
              ></div>
            </div>
            <span>{{ uploadProgress }}%</span>
          </div>

          <!-- پیام خطا -->
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
        </div>
      </div>
    </div>

    <!-- لیست استوری‌های آپلود شده -->
    <div class="uploaded-stories" v-if="uploadedStories.length > 0">
      <h3>استوری‌های آپلود شده (۲۴ ساعت فعال)</h3>
      <div class="stories-grid">
        <div 
          class="uploaded-story" 
          v-for="story in uploadedStories" 
          :key="story.id"
        >
          <div class="story-thumbnail">
            <img v-if="story.type === 'image'" :src="story.media" alt="Story" />
            <video v-else :src="story.media" muted></video>
            <div class="story-time-left">
              {{ getTimeLeft(story.uploadTime) }}
            </div>
          </div>
          <div class="story-details">
            <h4>{{ story.name }}</h4>
            <p>تعداد بازدید: {{ story.views }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "StoryUploader",
  data() {
    return {
      isUploading: false,
      isDragOver: false,
      selectedFile: null,
      previewUrl: null,
      mediaType: null,
      logoFile: null,
      logoPreview: null,
      durationSeconds: 5,
      uploadProgress: 0,
      errorMessage: "",
      
      storyData: {
        name: "",
        cta: "",
        duration: 5000
      },
      
      // لیست استوری‌های آپلود شده (در حالت واقعی از API گرفته می‌شود)
      uploadedStories: []
    };
  },
  computed: {
    canUpload() {
      return this.previewUrl && 
             this.storyData.name.trim() !== "" && 
             this.storyData.cta.trim() !== "" &&
             this.selectedFile &&
             this.selectedFile.size <= 100 * 1024 * 1024; // 100MB
    }
  },
  watch: {
    durationSeconds(newVal) {
      this.storyData.duration = newVal * 1000;
    }
  },
  methods: {
    startUpload() {
      this.isUploading = true;
      this.resetForm();
    },
    
    cancelUpload() {
      this.isUploading = false;
      this.resetForm();
    },
    
    resetForm() {
      this.selectedFile = null;
      this.previewUrl = null;
      this.mediaType = null;
      this.logoFile = null;
      this.logoPreview = null;
      this.uploadProgress = 0;
      this.errorMessage = "";
      this.durationSeconds = 5;
      
      this.storyData = {
        name: "",
        cta: "",
        duration: 5000
      };
    },
    
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    
    onFileSelect(event) {
      const file = event.target.files[0];
      if (file) {
        this.processFile(file);
      }
    },
    
    onDragOver(event) {
      this.isDragOver = true;
      event.preventDefault();
    },
    
    onDragLeave() {
      this.isDragOver = false;
    },
    
    onDrop(event) {
      this.isDragOver = false;
      event.preventDefault();
      
      const files = event.dataTransfer.files;
      if (files.length > 0) {
        this.processFile(files[0]);
      }
    },
    
    processFile(file) {
      // بررسی نوع فایل
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        this.errorMessage = "فقط فایل‌های تصویری و ویدیویی پشتیبانی می‌شوند";
        return;
      }
      
      // بررسی حجم فایل
      if (file.size > 100 * 1024 * 1024) {
        this.errorMessage = "حجم فایل باید کمتر از ۱۰۰ مگابایت باشد";
        return;
      }
      
      this.selectedFile = file;
      this.errorMessage = "";
      
      // تعیین نوع رسانه
      if (file.type.startsWith('image/')) {
        this.mediaType = 'image';
      } else if (file.type.startsWith('video/')) {
        this.mediaType = 'video';
        // برای ویدیوها مدت پیش‌فرض را ۱۰ ثانیه قرار می‌دهیم
        this.durationSeconds = 10;
      }
      
      // ایجاد پیش‌نمایش
      this.previewUrl = URL.createObjectURL(file);
    },
    
    removePreview() {
      this.previewUrl = null;
      this.selectedFile = null;
      this.mediaType = null;
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = '';
      }
    },
    
    onLogoSelect(event) {
      const file = event.target.files[0];
      if (file && file.type.startsWith('image/')) {
        this.logoFile = file;
        this.logoPreview = URL.createObjectURL(file);
      }
    },
    
    async uploadStory() {
      if (!this.canUpload) return;
      
      try {
        this.uploadProgress = 10;
        
        // شبیه‌سازی آپلود (در حالت واقعی باید به API ارسال شود)
        await this.simulateUpload();
        
        this.uploadProgress = 100;
        
        // ایجاد استوری جدید
        const newStory = {
          id: Date.now(),
          name: this.storyData.name,
          logo: this.logoPreview || "https://picsum.photos/100/100?random=" + Date.now(),
          type: this.mediaType,
          media: this.previewUrl,
          duration: this.storyData.duration,
          cta: this.storyData.cta,
          timestamp: new Date(),
          uploadTime: new Date(),
          views: 0,
          seen: false
        };
        
        // افزودن به لیست استوری‌های آپلود شده
        this.uploadedStories.unshift(newStory);
        
        // بستن مودال پس از ۱ ثانیه
        setTimeout(() => {
          this.isUploading = false;
          this.resetForm();
          
          // انتشار رویداد برای کامپوننت والد
          this.$emit('story-uploaded', newStory);
        }, 1000);
        
      } catch (error) {
        this.errorMessage = "خطا در آپلود استوری: " + error.message;
        this.uploadProgress = 0;
      }
    },
    
    simulateUpload() {
      return new Promise((resolve) => {
        // شبیه‌سازی فرآیند آپلود
        const interval = setInterval(() => {
          if (this.uploadProgress < 90) {
            this.uploadProgress += 10;
          } else {
            clearInterval(interval);
            resolve();
          }
        }, 200);
      });
    },
    
    formatFileSize(bytes) {
      if (bytes < 1024) return bytes + " بایت";
      else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " کیلوبایت";
      else return (bytes / 1048576).toFixed(1) + " مگابایت";
    },
    
    getTimeLeft(uploadTime) {
      const now = new Date();
      const uploadDate = new Date(uploadTime);
      const expireTime = new Date(uploadDate.getTime() + 24 * 60 * 60 * 1000); // 24 ساعت
      const timeLeft = expireTime - now;
      
      if (timeLeft <= 0) return "منقضی شده";
      
      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      
      return `${hours} ساعت و ${minutes} دقیقه`;
    }
  },
  
  beforeUnmount() {
    // آزاد کردن URLهای ایجاد شده
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
    }
    if (this.logoPreview) {
      URL.revokeObjectURL(this.logoPreview);
    }
  }
};
</script>

<style scoped>
.upload-story-container {
  margin-bottom: 20px;
  padding: 10px;
}

.upload-story-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80px;
  cursor: pointer;
  padding: 10px;
  border-radius: 10px;
  transition: background-color 0.3s;
}

.upload-story-button:hover {
  background-color: #f5f5f5;
}

.upload-icon {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 5px;
}

.upload-text {
  font-size: 0.75rem;
  text-align: center;
  color: #333;
}

/* مودال آپلود */
.upload-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.upload-content {
  background: white;
  width: 90%;
  max-width: 600px;
  border-radius: 10px;
  overflow: hidden;
  max-height: 90vh;
  overflow-y: auto;
}

.upload-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
}

.upload-header h2 {
  margin: 0;
  font-size: 1.2rem;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}

.upload-form {
  padding: 20px;
}

/* ناحیه درگ و دراپ */
.drop-zone {
  border: 2px dashed #ccc;
  border-radius: 10px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 20px;
}

.drop-zone:hover, .drop-zone.drag-over {
  border-color: #1da1f2;
  background-color: #f0f8ff;
}

.drop-zone-content {
  color: #666;
}

.upload-icon-large {
  font-size: 3rem;
  margin-bottom: 10px;
}

.file-info {
  font-size: 0.8rem;
  color: #999;
  margin-top: 5px;
}

/* پیش‌نمایش رسانه */
.media-preview {
  position: relative;
  margin-bottom: 20px;
  text-align: center;
}

.preview-image, .preview-video {
  max-width: 100%;
  max-height: 300px;
  border-radius: 10px;
}

.preview-video {
  width: 100%;
}

.remove-preview {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
}

/* فرم اطلاعات */
.story-info {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

.form-group input[type="text"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}

.logo-input {
  margin-top: 5px;
}

.logo-preview {
  margin-top: 10px;
}

.logo-preview img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.duration-slider {
  width: 100%;
  margin: 10px 0;
}

.duration-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #666;
}

.file-info-card {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 5px;
  margin-top: 15px;
}

.file-info-card h4 {
  margin: 0 0 10px 0;
}

.file-info-card p {
  margin: 5px 0;
  font-size: 0.9rem;
}

/* دکمه‌ها */
.action-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.btn-primary {
  background: #1da1f2;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #0d8bd9;
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f0f0f0;
  color: #333;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

/* پیشرفت آپلود */
.upload-progress {
  margin-top: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-bar {
  flex-grow: 1;
  height: 10px;
  background: #f0f0f0;
  border-radius: 5px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #1da1f2;
  transition: width 0.3s;
}

/* پیام خطا */
.error-message {
  background: #ffe6e6;
  color: #d00;
  padding: 10px;
  border-radius: 5px;
  margin-top: 15px;
  text-align: center;
}

/* استوری‌های آپلود شده */
.uploaded-stories {
  margin-top: 30px;
  padding: 15px;
  border-top: 1px solid #eee;
}

.uploaded-stories h3 {
  margin-bottom: 15px;
  font-size: 1.1rem;
}

.stories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
}

.uploaded-story {
  border: 1px solid #eee;
  border-radius: 10px;
  overflow: hidden;
}

.story-thumbnail {
  position: relative;
  height: 120px;
  overflow: hidden;
}

.story-thumbnail img, .story-thumbnail video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.story-time-left {
  position: absolute;
  top: 5px;
  left: 5px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 3px 6px;
  border-radius: 3px;
  font-size: 0.7rem;
}

.story-details {
  padding: 10px;
}

.story-details h4 {
  margin: 0 0 5px 0;
  font-size: 0.9rem;
}

.story-details p {
  margin: 0;
  font-size: 0.8rem;
  color: #666;
}

/* رسپانسیو */
@media (max-width: 768px) {
  .upload-content {
    width: 95%;
    margin: 10px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .stories-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
}
</style>