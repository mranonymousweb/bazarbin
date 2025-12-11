<template>
  <div class="instagram-profile">
    <!-- نوبار بالای صفحه -->
    <div class="navs">
      <div class="right2">
        <div class="back1">-0</div>
        <div class="logo-container">
          <img src="../assets/images/logo.png" alt="Master Right Logo" class="logo-img" />
        </div>
      </div>
      
      <!-- آیکون‌های سمت چپ -->
      <div class="nav-icons">
        <button class="nav-icon" @click="search">
          <i class="fas fa-search"></i>
        </button>
        <button v-if="loggedIn" class="nav-icon">
          <i class="fas fa-shopping-cart"></i>
        </button>
        <button v-if="loggedIn" class="nav-icon">
          <i class="fas fa-bell"></i>
        </button>
        <button class="nav-icon">
          <i class="fas fa-bars"></i>
        </button>
      </div>
    </div>

    <!-- هدر صفحه پروفایل -->
    <header class="profile-header">
      <div class="profile-container">
        <!-- عکس پروفایل و استوری‌ها -->
        <div class="profile-image-section">
          <div class="profile-image-container"
               @click="changeProfilePhoto"
               @dragover="handleDragOver"
               @dragleave="handleDragLeave"
               @drop="handleDrop">
            <img 
              :src="business.profileImage || defaultAvatar" 
              alt="پروفایل کسب و کار" 
              class="profile-image"
              :class="{ 'dragover': isDragging }"
            />
            <button v-if="isEditing" class="edit-profile-img-btn">
              تغییر عکس
            </button>
          </div>
          
          <!-- آمار پروفایل در موبایل -->
          <div class="mobile-stats">
            <div class="stat">
              <span class="stat-number">{{ business.servicesCount || 0 }}</span>
              <span class="stat-label">خدمات</span>
            </div>
            <div class="stat">
              <span class="stat-number">{{ business.receivedFollowers || 0 }}</span>
              <span class="stat-label">دنبال‌کننده دریافتی</span>
            </div>
            <div class="stat">
              <span class="stat-number">{{ business.sentFollowers || 0 }}</span>
              <span class="stat-label">دنبال‌کننده ارسالی</span>
            </div>
          </div>

          <!-- استوری‌ها -->
          <div class="stories-sidebar">
            <div v-for="(story, index) in business.stories" :key="index" class="story-item">
              <div class="story-circle">
                <img :src="story.image" :alt="'استوری ' + (index + 1)" class="story-image">
              </div>
              <span class="story-title">{{ story.title }}</span>
            </div>
            
            <div v-if="isEditing" class="story-item" @click="addStory">
              <div class="story-circle add-story-circle">
                <span class="add-icon">+</span>
              </div>
              <span class="story-title">افزودن استوری</span>
            </div>
          </div>
        </div>

        <!-- اطلاعات پروفایل -->
        <div class="profile-info-section">
          <div class="profile-info-top">
            <h1 class="profile-username">{{ business.name }}</h1>
            <div class="profile-actions">
              <button v-if="!isEditing" @click="isEditing = true" class="edit-profile-btn">
                ویرایش پروفایل
              </button>
              <button class="tools-btn">ابزارها</button>
            </div>
          </div>

          <!-- آمار پروفایل در دسکتاپ -->
          <div class="desktop-stats">
            <div class="stat">
              <span class="stat-number">{{ business.servicesCount || 0 }}</span>
              <span class="stat-label">خدمات</span>
            </div>
            <div class="stat">
              <span class="stat-number">{{ business.receivedFollowers || 0 }}</span>
              <span class="stat-label">دنبال‌کننده دریافتی</span>
            </div>
            <div class="stat">
              <span class="stat-number">{{ business.sentFollowers || 0 }}</span>
              <span class="stat-label">دنبال‌کننده ارسالی</span>
            </div>
          </div>

          <!-- دکمه‌های فالو و تماس -->
          <div class="action-buttons">
            <button class="follow-btn" :class="{ 'following': isFollowing }" @click="toggleFollow">
              {{ isFollowing ? 'دنبال شده' : 'دنبال کنید' }}
            </button>
            <button class="contact-btn" @click="contactBusiness">
              <i class="fas fa-phone"></i>
              تماس بگیرید
            </button>
          </div>

          <!-- اطلاعات تماس -->
          <div class="contact-info">
            <p v-if="business.phone" class="contact-item">📞 {{ business.phone }}</p>
            <p v-if="business.email" class="contact-item">✉️ {{ business.email }}</p>
            <a v-if="business.website" :href="business.website" class="contact-item bio-website">
              🌐 {{ business.website }}
            </a>
          </div>

          <!-- بیوگرافی -->
          <div class="profile-bio">
            <p class="bio-text">{{ business.description || 'توضیحاتی درباره کسب و کار' }}</p>
          </div>
        </div>
      </div>

      <!-- تب‌های پروفایل -->
      <div class="profile-tabs">
        <button class="tab-btn" :class="{ 'active': activeTab === 'discounts' }" @click="activeTab = 'discounts'">
          <span>تخفیف‌ها</span>
        </button>
        <button class="tab-btn" :class="{ 'active': activeTab === 'new' }" @click="activeTab = 'new'">
          <span>جدیدها</span>
        </button>
        <button class="tab-btn" :class="{ 'active': activeTab === 'posts' }" @click="activeTab = 'posts'">
          <span>پست‌ها</span>
        </button>
        <button class="tab-btn" :class="{ 'active': activeTab === 'stories' }" @click="activeTab = 'stories'">
          <span>استوری</span>
        </button>
      </div>
    </header>

    <!-- بخش آیکون‌های اشتراک‌گذاری -->
    <div class="share-section">
      <div class="share-container">
        <h3 class="share-title">اشتراک‌گذاری پروفایل</h3>
        <div class="share-icons">
          <button class="share-icon" @click="shareProfile('whatsapp')">
            <i class="fab fa-whatsapp"></i>
            <span>واتس‌اپ</span>
          </button>
          <button class="share-icon" @click="shareProfile('telegram')">
            <i class="fab fa-telegram"></i>
            <span>تلگرام</span>
          </button>
          <button class="share-icon" @click="shareProfile('link')">
            <i class="fas fa-link"></i>
            <span>کپی لینک</span>
          </button>
          <button class="share-icon" @click="showQrCode = true">
            <i class="fas fa-qrcode"></i>
            <span>QR کد</span>
          </button>
        </div>
      </div>
    </div>

    <!-- بخش اطلاعات کسب‌وکار -->
    <div class="business-info-section">
      <div class="info-container">
        <!-- منو اطلاعات -->
        <div class="info-menu">
          <button class="info-tab" :class="{ 'active': infoTab === 'activity' }" @click="infoTab = 'activity'">
            شرح فعالیت
          </button>
          <button class="info-tab" :class="{ 'active': infoTab === 'contact' }" @click="infoTab = 'contact'">
            اطلاعات تماس
          </button>
          <button class="info-tab" :class="{ 'active': infoTab === 'hours' }" @click="infoTab = 'hours'">
            ساعت کاری
          </button>
        </div>

        <!-- محتوای اطلاعات -->
        <div class="info-content">
          <!-- شرح فعالیت -->
          <div v-if="infoTab === 'activity'" class="activity-info">
            <h4>شرح فعالیت کسب‌وکار</h4>
            <p>{{ business.activityDescription || 'توضیحات فعالیت کسب‌وکار در اینجا نمایش داده می‌شود.' }}</p>
            <div class="activity-tags">
              <span class="tag" v-for="(tag, index) in business.tags" :key="index">{{ tag }}</span>
            </div>
          </div>

          <!-- اطلاعات تماس -->
          <div v-if="infoTab === 'contact'" class="contact-details">
            <h4>اطلاعات تماس</h4>
            <div class="contact-item-detail">
              <i class="fas fa-phone"></i>
              <span>{{ business.phone || 'تعریف نشده' }}</span>
            </div>
            <div class="contact-item-detail">
              <i class="fas fa-envelope"></i>
              <span>{{ business.email || 'تعریف نشده' }}</span>
            </div>
            <div class="contact-item-detail">
              <i class="fas fa-globe"></i>
              <a :href="business.website" v-if="business.website">{{ business.website }}</a>
              <span v-else>تعریف نشده</span>
            </div>
            <div class="contact-item-detail">
              <i class="fas fa-map-marker-alt"></i>
              <span>{{ business.address || 'تعریف نشده' }}</span>
            </div>
          </div>

          <!-- ساعت کاری -->
          <div v-if="infoTab === 'hours'" class="working-hours">
            <h4>ساعت کاری</h4>
            <div class="hours-list">
              <div class="hour-item" v-for="(hour, day) in business.workingHours" :key="day">
                <span class="day">{{ getDayName(day) }}</span>
                <span class="time">{{ hour || 'تعطیل' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- کامپوننت آپلود ریل -->
    <ReelUploader @reel-uploaded="handleNewReel" />

    <!-- محتوای پروفایل -->
    <main class="profile-content">
      <!-- بخش پست‌ها -->
      <section class="posts-section" v-if="activeTab === 'posts'">
        <div class="posts-grid">
          <div v-for="(post, index) in business.posts" :key="index" class="post-item">
            <img :src="post.image" :alt="'پست ' + (index + 1)" class="post-image">
            <div class="post-overlay">
              <div class="post-stats">
                <span class="stat">❤️ {{ post.likes || 0 }}</span>
                <span class="stat">💬 {{ post.comments || 0 }}</span>
              </div>
            </div>
          </div>
          
          <div v-if="isEditing" class="add-post-item" @click="addPost">
            <span class="add-icon">+</span>
            <p>افزودن پست جدید</p>
          </div>
        </div>
      </section>

      <!-- بخش تخفیف‌ها -->
      <section class="discounts-section" v-if="activeTab === 'discounts'">
        <div class="discounts-grid">
          <div v-for="(discount, index) in business.discounts" :key="index" class="discount-item">
            <img :src="discount.image" :alt="'تخفیف ' + (index + 1)" class="discount-image">
            <div class="discount-overlay">
              <div class="discount-info">
                <span class="discount-title">{{ discount.title }}</span>
                <span class="discount-percent">{{ discount.percent }}%</span>
              </div>
            </div>
          </div>
          
          <div v-if="isEditing" class="add-discount-item" @click="addDiscount">
            <span class="add-icon">+</span>
            <p>افزودن تخفیف جدید</p>
          </div>
        </div>
      </section>

      <!-- بخش جدیدها -->
      <section class="new-section" v-if="activeTab === 'new'">
        <div class="new-grid">
          <div v-for="(item, index) in business.newItems" :key="index" class="new-item">
            <img :src="item.image" :alt="'جدید ' + (index + 1)" class="new-image">
            <div class="new-overlay">
              <div class="new-info">
                <span class="new-title">{{ item.title }}</span>
              </div>
            </div>
          </div>
          
          <div v-if="isEditing" class="add-new-item" @click="addNewItem">
            <span class="add-icon">+</span>
            <p>افزودن آیتم جدید</p>
          </div>
        </div>
      </section>

      <!-- بخش استوری -->
      <section class="stories-section" v-if="activeTab === 'stories'">
        <div class="stories-container">
          <div class="stories-scroll">
            <div v-for="(story, index) in business.stories" :key="index" class="story-item">
              <div class="story-circle">
                <img :src="story.image" :alt="'استوری ' + (index + 1)" class="story-image">
              </div>
              <span class="story-title">{{ story.title }}</span>
            </div>
            
            <div v-if="isEditing" class="add-story-item" @click="addStory">
              <div class="story-circle add-story-circle">
                <span class="add-icon">+</span>
              </div>
              <span class="story-title">افزودن استوری</span>
            </div>
          </div>
        </div>
      </section>

      <!-- بخش ویرایش اطلاعات -->
      <section v-if="isEditing" class="edit-section">
        <h2>ویرایش اطلاعات حساب</h2>
        <form @submit.prevent="saveChanges" class="edit-form">
          <div class="form-group">
            <label for="businessName">نام کاربری:</label>
            <input 
              id="businessName" 
              v-model="editForm.name" 
              type="text" 
              required 
            />
          </div>
          
          <div class="form-group">
            <label for="businessDesc">بیوگرافی:</label>
            <textarea 
              id="businessDesc" 
              v-model="editForm.description" 
              rows="4"
              maxlength="150"
            ></textarea>
            <span class="char-count">{{ editForm.description.length }}/150</span>
          </div>

          <div class="form-group">
            <label for="businessActivity">شرح فعالیت:</label>
            <textarea 
              id="businessActivity" 
              v-model="editForm.activityDescription" 
              rows="3"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="businessAddress">آدرس:</label>
            <input 
              id="businessAddress" 
              v-model="editForm.address" 
              type="text" 
            />
          </div>
          
          <div class="form-group">
            <label for="businessWebsite">وب‌سایت:</label>
            <input 
              id="businessWebsite" 
              v-model="editForm.website" 
              type="url" 
            />
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

    <!-- مدال QR کد -->
    <div v-if="showQrCode" class="modal-overlay" @click="showQrCode = false">
      <div class="modal-content qr-modal" @click.stop>
        <h3>QR کد پروفایل</h3>
        <div class="qr-code">
          <img :src="business.qrCode || '/default-qr.png'" alt="QR Code" />
        </div>
        <p>اسکن کنید برای دسترسی به پروفایل</p>
        <button @click="showQrCode = false" class="close-btn">بستن</button>
      </div>
    </div>

    <!-- سایر مدال‌ها -->
    <div v-if="showPostModal" class="modal-overlay">
      <div class="modal-content">
        <h3>افزودن پست جدید</h3>
        <input type="file" accept="image/*" ref="postInput" @change="handlePostUpload" />
        <div class="modal-actions">
          <button @click="showPostModal = false" class="cancel-btn">لغو</button>
        </div>
      </div>
    </div>

    <div v-if="showDiscountModal" class="modal-overlay">
      <div class="modal-content">
        <h3>افزودن تخفیف جدید</h3>
        <input type="file" accept="image/*" ref="discountInput" @change="handleDiscountUpload" />
        <div class="modal-actions">
          <button @click="showDiscountModal = false" class="cancel-btn">لغو</button>
        </div>
      </div>
    </div>

    <div v-if="showNewItemModal" class="modal-overlay">
      <div class="modal-content">
        <h3>افزودن آیتم جدید</h3>
        <input type="file" accept="image/*" ref="newItemInput" @change="handleNewItemUpload" />
        <div class="modal-actions">
          <button @click="showNewItemModal = false" class="cancel-btn">لغو</button>
        </div>
      </div>
    </div>

    <div v-if="showStoryModal" class="modal-overlay">
      <div class="modal-content">
        <h3>افزودن استوری جدید</h3>
        <input type="file" accept="image/*" ref="storyInput" @change="handleStoryUpload" />
        <div class="modal-actions">
          <button @click="showStoryModal = false" class="cancel-btn">لغو</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ReelUploader from '../components/ReelUploader.vue';

export default {
  name: 'InstagramProfile',
  components: {
    ReelUploader
  },
  data() {
    return {
      isEditing: false,
      isFollowing: false,
      activeTab: 'posts',
      infoTab: 'activity',
      showPostModal: false,
      showDiscountModal: false,
      showNewItemModal: false,
      showStoryModal: false,
      showQrCode: false,
      isDragging: false,
      loggedIn: true,
      defaultAvatar: '/default-avatar.jpg',
      business: {
        name: 'کسب و کار نمونه',
        profileImage: '',
        posts: [
          {
            image: 'https://via.placeholder.com/300x300/ff6b6b/ffffff?text=پست+1',
            likes: 125,
            comments: 15
          }
        ],
        discounts: [
          {
            image: 'https://via.placeholder.com/300x300/96ceb4/ffffff?text=تخفیف+ویژه',
            title: 'تخفیف ویژه',
            percent: 20
          }
        ],
        newItems: [
          {
            image: 'https://via.placeholder.com/300x300/ff9ff3/ffffff?text=خدمت+جدید',
            title: 'خدمت جدید'
          }
        ],
        stories: [
          {
            image: 'https://via.placeholder.com/300x300/5f27cd/ffffff?text=رویداد',
            title: 'رویداد'
          }
        ],
        description: 'این یک بیزینس نمونه است که خدمات مختلفی ارائه می‌دهد',
        activityDescription: 'ما در زمینه طراحی وب‌سایت، اپلیکیشن موبایل و سئو تخصص داریم. با بیش از 5 سال تجربه در زمینه فناوری اطلاعات.',
        phone: '۰۹۱۲۳۴۵۶۷۸۹',
        email: 'business@example.com',
        website: 'https://example.com',
        address: 'تهران، خیابان ولیعصر، پلاک 123',
        servicesCount: 5,
        receivedFollowers: 1250,
        sentFollowers: 350,
        tags: ['طراحی وب', 'اپلیکیشن موبایل', 'سئو', 'دیجیتال مارکتینگ'],
        workingHours: {
          saturday: '8:00 - 17:00',
          sunday: '8:00 - 17:00',
          monday: '8:00 - 17:00',
          tuesday: '8:00 - 17:00',
          wednesday: '8:00 - 17:00',
          thursday: '8:00 - 14:00',
          friday: 'تعطیل'
        },
        qrCode: '/default-qr.png'
      },
      editForm: {
        name: '',
        description: '',
        activityDescription: '',
        address: '',
        phone: '',
        email: '',
        website: ''
      }
    }
  },
  mounted() {
    this.loadBusinessData();
  },
  methods: {
    loadBusinessData() {
      const savedData = localStorage.getItem('instagramBusinessProfile');
      if (savedData) {
        this.business = { ...this.business, ...JSON.parse(savedData) };
      }
      
      this.editForm = {
        name: this.business.name,
        description: this.business.description,
        activityDescription: this.business.activityDescription,
        address: this.business.address,
        phone: this.business.phone,
        email: this.business.email,
        website: this.business.website
      };
    },
    toggleFollow() {
      this.isFollowing = !this.isFollowing;
    },
    contactBusiness() {
      if (this.business.phone) {
        window.location.href = `tel:${this.business.phone}`;
      }
    },
    shareProfile(platform) {
      const profileUrl = window.location.href;
      switch (platform) {
        case 'whatsapp':
          window.open(`https://wa.me/?text=${encodeURIComponent(profileUrl)}`, '_blank');
          break;
        case 'telegram':
          window.open(`https://t.me/share/url?url=${encodeURIComponent(profileUrl)}`, '_blank');
          break;
        case 'link':
          navigator.clipboard.writeText(profileUrl);
          alert('لینک کپی شد!');
          break;
      }
    },
    getDayName(day) {
      const days = {
        saturday: 'شنبه',
        sunday: 'یکشنبه',
        monday: 'دوشنبه',
        tuesday: 'سه‌شنبه',
        wednesday: 'چهارشنبه',
        thursday: 'پنجشنبه',
        friday: 'جمعه'
      };
      return days[day] || day;
    },
    // سایر متدها مانند قبل...
    handleDragOver(e) {
      e.preventDefault();
      this.isDragging = true;
    },
    handleDragLeave() {
      this.isDragging = false;
    },
    handleDrop(e) {
      e.preventDefault();
      this.isDragging = false;
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        this.uploadProfileImage(files[0]);
      }
    },
    changeProfilePhoto() {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          this.uploadProfileImage(file);
        }
      };
      input.click();
    },
    uploadProfileImage(file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        this.business.profileImage = event.target.result;
        this.saveToLocalStorage();
      };
      reader.readAsDataURL(file);
    },
    handleNewReel(reelData) {
      console.log('ریل جدید آپلود شد:', reelData);
    },
    addPost() {
      this.showPostModal = true;
    },
    addDiscount() {
      this.showDiscountModal = true;
    },
    addNewItem() {
      this.showNewItemModal = true;
    },
    addStory() {
      this.showStoryModal = true;
    },
    handlePostUpload(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          this.business.posts.push({
            image: event.target.result,
            uploadDate: new Date(),
            likes: 0,
            comments: 0
          });
          this.saveToLocalStorage();
          this.showPostModal = false;
        };
        reader.readAsDataURL(file);
      }
    },
    handleDiscountUpload(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          this.business.discounts.push({
            image: event.target.result,
            title: 'تخفیف جدید',
            percent: 10
          });
          this.saveToLocalStorage();
          this.showDiscountModal = false;
        };
        reader.readAsDataURL(file);
      }
    },
    handleNewItemUpload(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          this.business.newItems.push({
            image: event.target.result,
            title: 'آیتم جدید'
          });
          this.saveToLocalStorage();
          this.showNewItemModal = false;
        };
        reader.readAsDataURL(file);
      }
    },
    handleStoryUpload(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          this.business.stories.push({
            image: event.target.result,
            title: 'استوری جدید'
          });
          this.saveToLocalStorage();
          this.showStoryModal = false;
        };
        reader.readAsDataURL(file);
      }
    },
    saveChanges() {
      this.business.name = this.editForm.name;
      this.business.description = this.editForm.description;
      this.business.activityDescription = this.editForm.activityDescription;
      this.business.address = this.editForm.address;
      this.business.phone = this.editForm.phone;
      this.business.email = this.editForm.email;
      this.business.website = this.editForm.website;
      
      this.saveToLocalStorage();
      this.isEditing = false;
    },
    cancelEditing() {
      this.editForm = {
        name: this.business.name,
        description: this.business.description,
        activityDescription: this.business.activityDescription,
        address: this.business.address,
        phone: this.business.phone,
        email: this.business.email,
        website: this.business.website
      };
      this.isEditing = false;
    },
    saveToLocalStorage() {
      localStorage.setItem('instagramBusinessProfile', JSON.stringify(this.business));
    },
    search() {
      console.log('جستجو...');
    }
  }
}
</script>

<style scoped>
<style scoped>
.instagram-profile {
  direction: rtl;
  font-family: 'Vazir', sans-serif;
  background-color: #fafafa;
  min-height: 100vh;
}

/* نوبار بالای صفحه */
.navs {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background: white;
  border-bottom: 1px solid #dbdbdb;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.right2 {
  display: flex;
  align-items: center;
  gap: 15px;
}

.back1 {
  font-size: 24px;
  cursor: pointer;
}

.logo-container {
  width: 120px;
}

.logo-img {
  width: 100%;
  height: auto;
}

.nav-icons {
  display: flex;
  gap: 15px;
}

.nav-icon {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #262626;
  padding: 8px;
}

/* هدر پروفایل */
.profile-header {
  background: white;
  border-bottom: 1px solid #dbdbdb;
}

.profile-container {
  max-width: 935px;
  margin: 0 auto;
  padding: 30px 20px;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 50px;
  align-items: start;
}

.profile-image-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.profile-image-container {
  position: relative;
  cursor: pointer;
}

.profile-image {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #e1306c;
}

.profile-image.dragover {
  border-color: #405de6;
  opacity: 0.7;
}

.edit-profile-img-btn {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  background: #405de6;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 12px;
  cursor: pointer;
}

/* آمار */
.mobile-stats {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.desktop-stats {
  display: none;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-weight: bold;
  font-size: 16px;
}

.stat-label {
  font-size: 12px;
  color: #8e8e8e;
}

/* استوری‌ها */
.stories-sidebar {
  display: flex;
  gap: 15px;
  overflow-x: auto;
  padding: 10px 0;
}

.story-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.story-circle {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
  padding: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.story-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;
}

.add-story-circle {
  background: #dbdbdb;
  border: 2px dashed #8e8e8e;
}

.add-icon {
  font-size: 24px;
  color: #8e8e8e;
}

.story-title {
  font-size: 12px;
  color: #262626;
}

/* اطلاعات پروفایل */
.profile-info-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.profile-info-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.profile-username {
  font-size: 28px;
  font-weight: 300;
  margin: 0;
  color: #262626;
}

.profile-actions {
  display: flex;
  gap: 10px;
}

.edit-profile-btn, .tools-btn {
  padding: 8px 16px;
  border: 1px solid #dbdbdb;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.edit-profile-btn:hover {
  background: #fafafa;
}

/* دکمه‌های عمل */
.action-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.follow-btn {
  padding: 8px 24px;
  background: #0095f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.follow-btn.following {
  background: #dbdbdb;
  color: #262626;
}

.contact-btn {
  padding: 8px 16px;
  background: #f0f0f0;
  border: 1px solid #dbdbdb;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
}

/* اطلاعات تماس */
.contact-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.contact-item {
  margin: 0;
  font-size: 14px;
  color: #262626;
}

.bio-website {
  color: #0095f6;
  text-decoration: none;
}

/* بیوگرافی */
.profile-bio {
  margin-top: 10px;
}

.bio-text {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: #262626;
}

/* تب‌های پروفایل */
.profile-tabs {
  display: flex;
  justify-content: center;
  border-top: 1px solid #dbdbdb;
}

.tab-btn {
  padding: 15px 0;
  margin: 0 20px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 12px;
  color: #8e8e8e;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
}

.tab-btn.active {
  color: #262626;
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  top: -1px;
  left: 0;
  right: 0;
  height: 1px;
  background: #262626;
}

/* بخش اشتراک‌گذاری */
.share-section {
  background: white;
  margin: 20px 0;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #dbdbdb;
}

.share-container {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

.share-title {
  margin-bottom: 20px;
  color: #262626;
}

.share-icons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.share-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 15px;
  background: #fafafa;
  border: 1px solid #dbdbdb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.share-icon:hover {
  background: #f0f0f0;
  transform: translateY(-2px);
}

/* اطلاعات کسب‌وکار */
.business-info-section {
  background: white;
  margin: 20px 0;
  border-radius: 10px;
  border: 1px solid #dbdbdb;
}

.info-container {
  padding: 20px;
}

.info-menu {
  display: flex;
  border-bottom: 1px solid #dbdbdb;
  margin-bottom: 20px;
}

.info-tab {
  padding: 15px 20px;
  background: none;
  border: none;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
}

.info-tab.active {
  border-bottom-color: #0095f6;
  color: #0095f6;
}

.info-content {
  min-height: 200px;
}

.activity-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 15px;
}

.tag {
  background: #f0f0f0;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 12px;
}

.contact-item-detail {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  padding: 10px;
  background: #fafafa;
  border-radius: 5px;
}

.hours-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.hour-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: #fafafa;
  border-radius: 5px;
}

/* محتوای پروفایل */
.profile-content {
  max-width: 935px;
  margin: 0 auto;
  padding: 20px;
}

/* گرید پست‌ها */
.posts-grid, .discounts-grid, .new-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3px;
}

.post-item, .discount-item, .new-item {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
}

.post-image, .discount-image, .new-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.post-item:hover .post-image {
  transform: scale(1.05);
}

.post-overlay, .discount-overlay, .new-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.post-item:hover .post-overlay {
  opacity: 1;
}

.post-stats {
  color: white;
  display: flex;
  gap: 15px;
}

.add-post-item, .add-discount-item, .add-new-item {
  aspect-ratio: 1;
  border: 2px dashed #dbdbdb;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-post-item:hover {
  border-color: #0095f6;
  background: #fafafa;
}

/* استایل‌های ویرایش */
.edit-section {
  background: white;
  padding: 30px;
  border-radius: 10px;
  border: 1px solid #dbdbdb;
  margin-top: 30px;
}

.edit-form {
  display: grid;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 5px;
  font-weight: bold;
  color: #262626;
}

.form-group input, .form-group textarea {
  padding: 10px;
  border: 1px solid #dbdbdb;
  border-radius: 4px;
  font-size: 14px;
}

.char-count {
  text-align: left;
  font-size: 12px;
  color: #8e8e8e;
  margin-top: 5px;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.save-btn {
  background: #0095f6;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-btn {
  background: #dbdbdb;
  color: #262626;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

/* مدال */
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
  border-radius: 10px;
  max-width: 400px;
  width: 90%;
  text-align: center;
}

.qr-code img {
  max-width: 200px;
  margin: 20px 0;
}

.close-btn {
  background: #dbdbdb;
  color: #262626;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
}

</style>