<template>
  <div class="reel-uploader">
    <!-- دکمه باز کردن آپلودر -->
    <button v-if="!showUploader" class="open-upload-btn" @click="showUploader = true">
      <span class="plus-icon">+</span>
      آپلود ریلز جدید
    </button>

    <!-- رابط آپلود -->
    <div v-if="showUploader" class="uploader-container">
      <div class="uploader-header">
        <h2>آپلود ریلز جدید</h2>
        <button class="close-btn" @click="closeUploader">×</button>
      </div>

      <div class="uploader-content">
        <!-- بخش آپلود فایل -->
        <div class="upload-section">
          <div 
            class="upload-area" 
            :class="{ 'dragover': isDragover, 'has-file': uploadedFile }"
            @drop="handleDrop"
            @dragover.prevent="isDragover = true"
            @dragleave="isDragover = false"
            @click="triggerFileInput"
          >
            <input 
              type="file" 
              ref="fileInput" 
              @change="handleFileSelect" 
              accept="video/*,image/*" 
              style="display: none"
            >
            
            <div v-if="!uploadedFile" class="upload-placeholder">
              <div class="upload-icon">📁</div>
              <p>فایل ویدیویی یا تصویری خود را اینجا رها کنید</p>
              <p>یا برای انتخاب فایل کلیک کنید</p>
              <span class="file-types">پشتیبانی از: MP4, MOV, AVI, JPEG, PNG</span>
            </div>

            <div v-else class="file-preview">
              <div class="preview-container">
                <img v-if="isImage" :src="previewUrl" alt="پیش‌نمایش" class="media-preview">
                <video v-else :src="previewUrl" controls class="media-preview"></video>
                <button class="remove-file" @click.stop="removeFile">×</button>
              </div>
              <div class="file-info">
                <p class="file-name">{{ uploadedFile.name }}</p>
                <p class="file-size">{{ formatFileSize(uploadedFile.size) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- فرم اطلاعات ریلز -->
        <div class="info-form">
          <div class="form-group">
            <label for="businessName">نام کسب‌وکار *</label>
            <input 
              type="text" 
              id="businessName" 
              v-model="reelData.businessName" 
              placeholder="نام کسب‌وکار خود را وارد کنید"
              :class="{ 'error': errors.businessName }"
            >
            <span v-if="errors.businessName" class="error-message">{{ errors.businessName }}</span>
          </div>

          <div class="form-group">
            <label for="description">توضیحات ریلز *</label>
            <textarea 
              id="description" 
              v-model="reelData.description" 
              placeholder="توضیحات جذابی برای ریلز خود بنویسید"
              maxlength="200"
              :class="{ 'error': errors.description }"
            ></textarea>
            <div class="char-counter">{{ reelData.description.length }}/200</div>
            <span v-if="errors.description" class="error-message">{{ errors.description }}</span>
          </div>

          <div class="form-group">
            <label for="contactInfo">اطلاعات تماس</label>
            <input 
              type="text" 
              id="contactInfo" 
              v-model="reelData.contactInfo" 
              placeholder="شماره تماس یا آدرس"
            >
          </div>

          <div class="form-group">
            <label>دسته‌بندی</label>
            <div class="category-tags">
              <span 
                v-for="category in categories" 
                :key="category.id"
                class="category-tag"
                :class="{ 'selected': reelData.category === category.id }"
                @click="reelData.category = category.id"
              >
                {{ category.name }}
              </span>
            </div>
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="reelData.hasSound">
              <span class="checkmark"></span>
              ریلز دارای صدا است
            </label>
          </div>
        </div>

        <!-- پیش‌نمایش ریلز -->
        <div class="preview-section" v-if="uploadedFile">
          <h3>پیش‌نمایش ریلز</h3>
          <div class="reel-preview-card">
            <div class="preview-thumbnail" :style="{ backgroundColor: previewColor }">
              <div class="preview-content">
                <span class="preview-business-name">{{ reelData.businessName || 'نام کسب‌وکار' }}</span>
              </div>
              
              <div class="preview-header">
                <div class="preview-business-info">
                  <div class="preview-avatar" :style="{ backgroundColor: previewAvatarColor }">
                    {{ getInitials(reelData.businessName) }}
                  </div>
                  <span class="preview-business">{{ reelData.businessName || 'نام کسب‌وکار' }}</span>
                </div>
              </div>
              
              <div class="preview-footer">
                <p class="preview-description">{{ truncateDescription(reelData.description) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- دکمه‌های اقدام -->
        <div class="action-buttons">
          <button class="cancel-btn" @click="closeUploader">لغو</button>
          <button 
            class="upload-btn" 
            @click="uploadReel" 
            :disabled="isUploading || !isFormValid"
            :class="{ 'loading': isUploading }"
          >
            <span v-if="isUploading" class="upload-spinner"></span>
            {{ isUploading ? 'در حال آپلود...' : 'آپلود ریلز' }}
          </button>
        </div>
      </div>
    </div>

    <!-- وضعیت آپلود موفق -->
    <div v-if="uploadSuccess" class="success-overlay">
      <div class="success-message">
        <div class="success-icon">✓</div>
        <h3>ریلز با موفقیت آپلود شد!</h3>
        <p>ریلز شما پس از تایید در اکسپلورر نمایش داده خواهد شد.</p>
        <button class="success-btn" @click="closeSuccess">متوجه شدم</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReelUploader',
  emits: ['reel-uploaded'],
  data() {
    return {
      showUploader: false,
      isUploading: false,
      uploadSuccess: false,
      isDragover: false,
      uploadedFile: null,
      previewUrl: null,
      previewColor: this.generateRandomColor(),
      previewAvatarColor: this.generateRandomColor(),
      errors: {
        businessName: '',
        description: ''
      },
      reelData: {
        businessName: '',
        description: '',
        contactInfo: '',
        category: '',
        hasSound: true
      },
      categories: [
        { id: 'restaurant', name: 'رستوران و کافی‌شاپ' },
        { id: 'beauty', name: 'آرایشی و زیبایی' },
        { id: 'fashion', name: 'پوشاک و مد' },
        { id: 'health', name: 'سلامت و ورزش' },
        { id: 'home', name: 'خانه و دکوراسیون' },
        { id: 'tech', name: 'فناوری و الکترونیک' },
        { id: 'education', name: 'آموزش و خدمات' },
        { id: 'other', name: 'سایر' }
      ]
    };
  },
  computed: {
    isImage() {
      if (!this.uploadedFile) return false;
      return this.uploadedFile.type.startsWith('image/');
    },
    isFormValid() {
      return this.uploadedFile && 
             this.reelData.businessName.trim() && 
             this.reelData.description.trim();
    }
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileSelect(event) {
      const file = event.target.files[0];
      if (file) {
        this.processFile(file);
      }
    },
    handleDrop(event) {
      event.preventDefault();
      this.isDragover = false;
      
      const files = event.dataTransfer.files;
      if (files.length > 0) {
        this.processFile(files[0]);
      }
    },
    processFile(file) {
      // بررسی نوع فایل
      const validTypes = ['image/jpeg', 'image/png', 'video/mp4', 'video/quicktime', 'video/avi'];
      if (!validTypes.includes(file.type)) {
        alert('لطفاً یک فایل ویدیویی یا تصویری معتبر انتخاب کنید.');
        return;
      }
      
      // بررسی حجم فایل (حداکثر 50MB)
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        alert('حجم فایل نباید بیشتر از 50 مگابایت باشد.');
        return;
      }
      
      this.uploadedFile = file;
      
      // ایجاد URL برای پیش‌نمایش
      this.previewUrl = URL.createObjectURL(file);
      
      // تولید رنگ‌های جدید برای پیش‌نمایش
      this.previewColor = this.generateRandomColor();
      this.previewAvatarColor = this.generateRandomColor();
    },
    removeFile() {
      this.uploadedFile = null;
      if (this.previewUrl) {
        URL.revokeObjectURL(this.previewUrl);
        this.previewUrl = null;
      }
    },
    validateForm() {
      this.errors = { businessName: '', description: '' };
      let isValid = true;
      
      if (!this.reelData.businessName.trim()) {
        this.errors.businessName = 'نام کسب‌وکار الزامی است';
        isValid = false;
      }
      
      if (!this.reelData.description.trim()) {
        this.errors.description = 'توضیحات ریلز الزامی است';
        isValid = false;
      } else if (this.reelData.description.length < 10) {
        this.errors.description = 'توضیحات باید حداقل 10 کاراکتر باشد';
        isValid = false;
      }
      
      return isValid;
    },
    async uploadReel() {
      if (!this.validateForm()) return;
      
      this.isUploading = true;
      
      try {
        // شبیه‌سازی آپلود به سرور
        await this.simulateUpload();
        
        // ایجاد آبجکت ریلز جدید مشابه نمونه‌های موجود
        const newReel = {
          id: Date.now(), // ID منحصر به فرد
          businessName: this.reelData.businessName,
          description: this.reelData.description,
          likes: 0,
          comments: 0,
          shares: 0,
          views: 0,
          isLiked: false,
          isBookmarked: false,
          color: this.previewColor,
          avatarColor: this.previewAvatarColor,
          // در حالت واقعی، این URL از سرور دریافت می‌شود
          mediaUrl: this.previewUrl,
          hasSound: this.reelData.hasSound,
          category: this.reelData.category,
          contactInfo: this.reelData.contactInfo,
          timestamp: new Date().toISOString()
        };
        
        // ارسال event به کامپوننت والد
        this.$emit('reel-uploaded', newReel);
        
        this.uploadSuccess = true;
        this.resetForm();
        
      } catch (error) {
        console.error('خطا در آپلود ریلز:', error);
        alert('متأسفانه در آپلود ریلز مشکلی پیش آمده است. لطفاً دوباره تلاش کنید.');
      } finally {
        this.isUploading = false;
      }
    },
    simulateUpload() {
      return new Promise((resolve) => {
        // شبیه‌سازی تاخیر آپلود
        setTimeout(() => {
          resolve();
        }, 2000);
      });
    },
    resetForm() {
      this.reelData = {
        businessName: '',
        description: '',
        contactInfo: '',
        category: '',
        hasSound: true
      };
      this.removeFile();
      this.errors = { businessName: '', description: '' };
    },
    closeUploader() {
      this.showUploader = false;
      this.resetForm();
    },
    closeSuccess() {
      this.uploadSuccess = false;
      this.showUploader = false;
    },
    generateRandomColor() {
      const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
        '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
        '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2',
        '#A9DFBF', '#F9E79F', '#D2B4DE', '#AED6F1', '#FAD7A0'
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    },
    getInitials(name) {
      if (!name) return '';
      return name.split(' ').map(word => word[0]).join('').substring(0, 2);
    },
    truncateDescription(desc, maxLength = 60) {
      if (!desc) return '';
      return desc.length > maxLength ? desc.substring(0, maxLength) + '...' : desc;
    },
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
  },
  beforeUnmount() {
    // آزاد کردن URL ایجاد شده برای پیش‌نمایش
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
    }
  }
};
</script>

<style scoped>
.reel-uploader {
  direction: rtl;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.open-upload-btn {
  background: linear-gradient(135deg, #ff385c, #ff6b6b);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 20px auto;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(255, 56, 92, 0.3);
}

.open-upload-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255, 56, 92, 0.4);
}

.plus-icon {
  font-size: 20px;
  font-weight: bold;
}

.uploader-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  z-index: 3000;
  overflow-y: auto;
}

.uploader-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.uploader-header h2 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #666;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.3s ease;
}

.close-btn:hover {
  background: #f5f5f5;
}

.uploader-content {
  padding: 20px;
}

.upload-section {
  margin-bottom: 24px;
}

.upload-area {
  border: 2px dashed #ddd;
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fafafa;
}

.upload-area:hover {
  border-color: #ff385c;
  background: #fff5f7;
}

.upload-area.dragover {
  border-color: #ff385c;
  background: #fff5f7;
  transform: scale(1.02);
}

.upload-area.has-file {
  border-style: solid;
  border-color: #4ECDC4;
  background: #f0fffe;
  padding: 20px;
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.upload-placeholder p {
  margin: 8px 0;
  color: #666;
}

.file-types {
  font-size: 12px;
  color: #999;
}

.file-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.preview-container {
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
}

.media-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-file {
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.file-info {
  text-align: center;
}

.file-name {
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #333;
}

.file-size {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.info-form {
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: inherit;
  font-size: 14px;
  transition: border 0.3s ease;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #ff385c;
}

.form-group input.error,
.form-group textarea.error {
  border-color: #ff6b6b;
}

.error-message {
  color: #ff6b6b;
  font-size: 12px;
  margin-top: 4px;
  display: block;
}

.char-counter {
  text-align: left;
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.category-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.category-tag {
  padding: 6px 12px;
  background: #f5f5f5;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-tag:hover {
  background: #e9e9e9;
}

.category-tag.selected {
  background: #ff385c;
  color: white;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-weight: normal;
}

.checkbox-label input {
  width: auto;
  margin-left: 8px;
}

.preview-section {
  margin-bottom: 24px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.preview-section h3 {
  margin: 0 0 16px 0;
  color: #333;
}

.reel-preview-card {
  max-width: 300px;
  margin: 0 auto;
}

.preview-thumbnail {
  width: 100%;
  height: 200px;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
}

.preview-content {
  z-index: 2;
}

.preview-business-name {
  font-size: 18px;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.preview-header {
  position: absolute;
  top: 8px;
  right: 8px;
  left: 8px;
}

.preview-business-info {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(0, 0, 0, 0.6);
  padding: 4px 8px;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  max-width: fit-content;
}

.preview-business {
  font-size: 12px;
  font-weight: 600;
}

.preview-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 10px;
}

.preview-footer {
  position: absolute;
  bottom: 8px;
  right: 8px;
  left: 8px;
}

.preview-description {
  margin: 0;
  font-size: 12px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
  line-height: 1.3;
}

.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.cancel-btn {
  padding: 12px 24px;
  background: #f5f5f5;
  color: #333;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background: #e9e9e9;
}

.upload-btn {
  padding: 12px 24px;
  background: #ff385c;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.upload-btn:hover:not(:disabled) {
  background: #e03150;
}

.upload-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.upload-btn.loading {
  pointer-events: none;
}

.upload-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.success-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  z-index: 4000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-message {
  background: white;
  padding: 40px;
  border-radius: 16px;
  text-align: center;
  max-width: 400px;
  width: 90%;
}

.success-icon {
  width: 60px;
  height: 60px;
  background: #4ECDC4;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin: 0 auto 20px;
}

.success-message h3 {
  margin: 0 0 12px 0;
  color: #333;
}

.success-message p {
  margin: 0 0 24px 0;
  color: #666;
  line-height: 1.5;
}

.success-btn {
  padding: 12px 24px;
  background: #ff385c;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.success-btn:hover {
  background: #e03150;
}

/* رسپانسیو */
@media (max-width: 768px) {
  .uploader-container {
    width: 95%;
    max-height: 95vh;
  }
  
  .uploader-content {
    padding: 16px;
  }
  
  .preview-container {
    width: 150px;
    height: 150px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .category-tags {
    justify-content: center;
  }
  
  .upload-area {
    padding: 30px 15px;
  }
  
  .upload-icon {
    font-size: 36px;
  }
}
</style>