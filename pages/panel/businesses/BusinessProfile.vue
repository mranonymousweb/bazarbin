<template>
  <div class="business-profile">
    <!-- هدر صفحه -->
    <header class="profile-header">
      <div class="cover-photo">
        <img :src="business.coverPhoto || '/default-cover.jpg'" alt="کاور بیزینس" class="cover-img" />
        <button v-if="isEditing" @click="changeCoverPhoto" class="edit-cover-btn">
          تغییر عکس کاور
        </button>
      </div>
    </header>

    <main class="profile-main">
      <!-- بخش اطلاعات کسب و کار -->
      <section class="business-info-section">
        <div class="business-image-container">
          <img 
            :src="business.profileImage || '/default-avatar.jpg'" 
            alt="پروفایل کسب و کار" 
            class="business-profile-image"
          />
          <button v-if="isEditing" @click="changeProfilePhoto" class="edit-profile-img-btn">
            تغییر عکس پروفایل
          </button>
        </div>
        
        <div class="business-details">
          <h1 class="business-name">{{ business.name }}</h1>
          <p class="join-date">عضو شده در: {{ formatDate(business.joinDate) }}</p>
          
          <div v-if="!isEditing" class="action-buttons">
            <button @click="isEditing = true" class="edit-btn">ویرایش پروفایل</button>
          </div>
        </div>
      </section>

      <!-- بخش استوری‌ها و ریل‌ها -->
      <section class="media-section">
        <h2>استوری‌ها و ریل‌ها</h2>
        <div class="media-container">
          <div v-for="(video, index) in business.videos" :key="index" class="video-item">
            <video controls class="business-video">
              <source :src="video.url" type="video/mp4">
              مرورگر شما از ویدیو پشتیبانی نمی‌کند.
            </video>
            <p class="video-date">{{ formatDate(video.uploadDate) }}</p>
          </div>
          
          <div v-if="isEditing" class="add-video-item" @click="addVideo">
            <span class="add-icon">+</span>
            <p>افزودن ویدیو جدید</p>
          </div>
        </div>
      </section>

      <!-- بخش ویرایش اطلاعات -->
      <section v-if="isEditing" class="edit-section">
        <h2>ویرایش اطلاعات حساب</h2>
        <form @submit.prevent="saveChanges" class="edit-form">
          <div class="form-group">
            <label for="businessName">نام کسب و کار:</label>
            <input 
              id="businessName" 
              v-model="editForm.name" 
              type="text" 
              required 
            />
          </div>
          
          <div class="form-group">
            <label for="businessDesc">توضیحات:</label>
            <textarea 
              id="businessDesc" 
              v-model="editForm.description" 
              rows="4"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label for="businessPhone">تلفن:</label>
            <input 
              id="businessPhone" 
              v-model="editForm.phone" 
              type="tel" 
            />
          </div>
          
          <div class="form-group">
            <label for="businessEmail">ایمیل:</label>
            <input 
              id="businessEmail" 
              v-model="editForm.email" 
              type="email" 
            />
          </div>
          
          <div class="form-actions">
            <button type="submit" class="save-btn">ذخیره تغییرات</button>
            <button type="button" @click="cancelEditing" class="cancel-btn">انصراف</button>
          </div>
        </form>
      </section>
    </main>

    <!-- مدال برای آپلود ویدیو -->
    <div v-if="showVideoModal" class="modal-overlay">
      <div class="modal-content">
        <h3>افزودن ویدیو جدید</h3>
        <input type="file" accept="video/*" ref="videoInput" @change="handleVideoUpload" />
        <div class="modal-actions">
          <button @click="showVideoModal = false" class="cancel-btn">لغو</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BusinessProfile',
  data() {
    return {
      isEditing: false,
      showVideoModal: false,
      business: {
        name: 'نام کسب و کار',
        joinDate: new Date('2023-01-15'),
        profileImage: '',
        coverPhoto: '',
        videos: [],
        description: '',
        phone: '',
        email: ''
      },
      editForm: {
        name: '',
        description: '',
        phone: '',
        email: ''
      }
    }
  },
  mounted() {
    // بارگذاری اطلاعات از localStorage یا API
    this.loadBusinessData();
  },
  methods: {
    loadBusinessData() {
      // در حالت واقعی، این اطلاعات از API دریافت می‌شود
      const savedData = localStorage.getItem('businessProfile');
      if (savedData) {
        this.business = { ...this.business, ...JSON.parse(savedData) };
      }
      
      // مقداردهی اولیه فرم ویرایش
      this.editForm = {
        name: this.business.name,
        description: this.business.description,
        phone: this.business.phone,
        email: this.business.email
      };
    },
    formatDate(date) {
      // فرمت تاریخ به صورت شمسی یا میلادی
      return new Date(date).toLocaleDateString('fa-IR');
    },
    changeProfilePhoto() {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            this.business.profileImage = event.target.result;
            this.saveToLocalStorage();
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    },
    changeCoverPhoto() {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            this.business.coverPhoto = event.target.result;
            this.saveToLocalStorage();
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    },
    addVideo() {
      this.showVideoModal = true;
    },
   async handleVideoUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  if (file.size > 60 * 1024 * 1024) {
    alert('حجم فایل باید کمتر از 60 مگابایت باشد.');
    return;
  }

  const formData = new FormData();
  formData.append('video', file);
  formData.append('business_name', this.business.name);
  formData.append('avatar', this.business.profileImage); // یا هر عکس آواتار مربوط به بیزینس
  formData.append('description', 'توضیح ویدیو ...'); // یا متن از فرم

  try {
    const response = await fetch('/api/reels/upload', {
      method: 'POST',
      body: formData
    });
    if (!response.ok) throw new Error('Upload failed');
    const newReel = await response.json();

    // اضافه کردن ریلز جدید به آرایه ریلزها
    this.reels.push(newReel);
    this.showVideoModal = false;
  } catch (error) {
    alert('خطا در آپلود ویدیو');
  }
},

    saveChanges() {
      this.business.name = this.editForm.name;
      this.business.description = this.editForm.description;
      this.business.phone = this.editForm.phone;
      this.business.email = this.editForm.email;
      
      this.saveToLocalStorage();
      this.isEditing = false;
    },
    cancelEditing() {
      this.editForm = {
        name: this.business.name,
        description: this.business.description,
        phone: this.business.phone,
        email: this.business.email
      };
      this.isEditing = false;
    },
    saveToLocalStorage() {
      localStorage.setItem('businessProfile', JSON.stringify(this.business));
    }
  }
}
</script>

<style scoped>
.business-profile {
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.profile-header {
  position: relative;
  margin-bottom: 100px;
}

.cover-photo {
  position: relative;
  height: 300px;
  overflow: hidden;
  border-radius: 8px;
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.edit-cover-btn {
  position: absolute;
  bottom: 15px;
  right: 15px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
}

.profile-main {
  padding: 0 20px;
}

.business-info-section {
  display: flex;
  align-items: flex-end;
  margin-bottom: 40px;
}

.business-image-container {
  position: relative;
  margin-left: 40px;
}

.business-profile-image {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  object-fit: cover;
  border: 5px solid white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.edit-profile-img-btn {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.business-details {
  flex: 1;
}

.business-name {
  font-size: 28px;
  margin: 0 0 10px 0;
  color: #333;
}

.join-date {
  color: #666;
  margin: 0 0 20px 0;
}

.action-buttons {
  display: flex;
  gap: 15px;
}

.edit-btn, .save-btn, .cancel-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.edit-btn {
  background-color: #4a90e2;
  color: white;
}

.save-btn {
  background-color: #4caf50;
  color: white;
}

.cancel-btn {
  background-color: #f44336;
  color: white;
}

.media-section {
  margin-bottom: 40px;
}

.media-section h2 {
  font-size: 22px;
  margin-bottom: 20px;
  color: #333;
}

.media-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.video-item, .add-video-item {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.business-video {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.video-date {
  padding: 10px;
  margin: 0;
  text-align: center;
  background: #f5f5f5;
}

.add-video-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  background: #f0f0f0;
  border: 2px dashed #ccc;
}

.add-icon {
  font-size: 40px;
  color: #666;
  margin-bottom: 10px;
}

.edit-section {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 40px;
}

.edit-section h2 {
  margin-top: 0;
  color: #333;
}

.edit-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 8px;
  font-weight: 600;
}

.form-group input, .form-group textarea {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.form-actions {
  grid-column: span 2;
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 20px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
}

.modal-content h3 {
  margin-top: 0;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  gap: 10px;
}

@media (max-width: 768px) {
  .business-info-section {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .business-image-container {
    margin-left: 0;
    margin-bottom: 20px;
  }
  
  .edit-form {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    grid-column: 1;
  }
  
  .media-container {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}
</style>