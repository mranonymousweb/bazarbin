<template>
  <div class="bg-white rounded px-3 pb-3 lg:p-6 mt-24 lg:mt-0">
    <div class="flex flex-wrap lg:flex-nowrap justify-between">

      <div class="w-full lg:w-1/2">
        <div class="hidden lg:block mb-4">
          <i class="flaticon-063-picture ml-2"></i>
          <span class="flex-grow text-gray-500">تصویر آیکون</span>
        </div>

        <add-image-btn
          v-model="form.avatar"
          class="mb-3 lg:mb-8 -mt-12 lg:mt-0"
          css-class="rounded-full w-24 h-24 bg-white"
          icon-class="w-9 h-9"
          label-class="text-sm font-semibold"
          image-class="min-w-full min-h-full object-cover"
          @input="updateAvatar"
        />

        <div class="font-extrabold text-lg mb-2">{{ business ? business.name : '' }}</div>

        <div class="flex items-center mb-2 lg:mb-0">
          <div class="flex items-center">
            <span>{{ business ? business.views : 0 }}</span>
            <i class="flaticon-057-eye mr-2 text-xl"></i>
          </div>

          <div class="flex items-center mr-8">
            <span>{{ business ? business.likes : 0 }}</span>
            <i class="flaticon-053-heart mr-2 text-xl"></i>
          </div>

          <div class="flex items-center mr-8">
            <span>{{ business ? business.score : 0 }}</span>
            <icons-solid-star class="text-gold w-8 h-8 mr-2"/>
          </div>
        </div>

        <Input
          v-if="isAdmin"
          v-model="form.admin_note"
          type="textarea"
          label="یادداشت مدیر"
          rows="3"
          input-class="w-full"
          class="mb-4 lg:mb-0"
          @input="update"
        />
      </div>

      <div class="flex lg:flex-col flex-wrap items-end justify-between w-full">

        <div class="ml-8 lg:ml-0">
          <div class="text-xs lg:text-sm text-gray-500 font-medium mb-2">
            تاریخ عضویت:
            {{ business ? formatDate(business.created_at, 'jYYYY/jMM/jDD') : '' }}
          </div>

          <div class="flex items-start lg:items-center">
            <button v-if="isAdmin" class="-mr-6 lg:mr-0 mt-1 lg:mt-0 lg:ml-8 lg:mb-5 order-2 lg:order-1">
              <i class="flaticon-162-edit text-base text-gray-500 inline-block cursor-pointer"
                 @click="$refs.datePicker.focus()"></i>
            </button>
            <countdown :value="countdown"/>
          </div>

          <date-picker
            ref="datePicker"
            v-model="form.subscription"
            format="YYYY-MM-DD"
            display-format="jYYYY-jMM-jDD"
            simple
            custom-input=".datePicker-input"
            @input="update"
          />

          <input type="hidden" class="datePicker-input"/>
        </div>

        <div v-if="exist && isAdmin" class="flex items-end gap-20">
          <div class="flex gap-8 flex-grow">
            <div class="flex flex-col gap-3 items-center">
              <input
                id="features-views-input"
                v-model="form.features.views"
                type="checkbox"
                class="h-4 w-4 text-cyan-250 focus:ring-cyan-250 border-gray-300 rounded cursor-pointer"
                @input="update"
              >
              <label for="features-views-input" class="block cursor-pointer">
                <icons-outline-eye class="w-6 h-6"/>
              </label>
            </div>
            <div class="flex flex-col gap-3 items-center">
              <input
                id="features-score-input"
                v-model="form.features.score"
                type="checkbox"
                class="h-4 w-4 text-cyan-250 focus:ring-cyan-250 border-gray-300 rounded cursor-pointer"
                @input="update"
              >
              <label for="features-score-input" class="block cursor-pointer">
                <i class="flaticon-029-star text-2xl leading-none"></i>
              </label>
            </div>
            <div class="flex flex-col gap-3 items-center">
              <input
                id="features-chat-input"
                v-model="form.features.chat"
                type="checkbox"
                class="h-4 w-4 text-cyan-250 focus:ring-cyan-250 border-gray-300 rounded cursor-pointer"
                @input="update"
              >
              <label for="features-chat-input" class="block cursor-pointer">
                <icons-chat2 class="w-6 h-6" />
              </label>
            </div>
            <div class="flex flex-col gap-3 items-center">
              <input
                id="features-report-input"
                v-model="form.features.report"
                type="checkbox"
                class="h-4 w-4 text-cyan-250 focus:ring-cyan-250 border-gray-300 rounded cursor-pointer"
                @input="update"
              >
              <label for="features-report-input" class="block cursor-pointer">
                <IconsReport class="w-6 h-6"/>
              </label>
            </div>
            <div class="flex flex-col gap-3 items-center">
              <input
                id="features-share-input"
                v-model="form.features.share"
                type="checkbox"
                class="h-4 w-4 text-cyan-250 focus:ring-cyan-250 border-gray-300 rounded cursor-pointer"
                @input="update"
              >
              <label for="features-share-input" class="block cursor-pointer">
                <i class="flaticon-009-share text-2xl leading-none"></i>
              </label>
            </div>
            <div class="flex flex-col gap-3 items-center">
              <input
                id="features-qr_code-input"
                v-model="form.features.qr_code"
                type="checkbox"
                class="h-4 w-4 text-cyan-250 focus:ring-cyan-250 border-gray-300 rounded cursor-pointer"
                @input="update"
              >
              <label for="features-qr_code-input" class="block cursor-pointer">
                <i class="flaticon-086-qr-code text-2xl leading-none"></i>
              </label>
            </div>
            <div class="flex flex-col gap-3 items-center">
              <input
                id="features-bookmark-input"
                v-model="form.features.bookmark"
                type="checkbox"
                class="h-4 w-4 text-cyan-250 focus:ring-cyan-250 border-gray-300 rounded cursor-pointer"
                @input="update"
              >
              <label for="features-bookmark-input" class="block cursor-pointer">
                <i class="flaticon-154-bookmark text-2xl leading-none"></i>
              </label>
            </div>
          </div>
          <div class="flex gap-8 flex-grow">
            <div class="w-auto flex-grow flex flex-col items-center justify-center">
              <div class="">{{ business.products_count }}</div>
              <div class="text-gray-400 text-xs">
                <span v-if="business.custom_titles.products_count">
                  {{ business.custom_titles.products_count}}
                </span>
                <span v-else>کالا و خدمات</span>
              </div>
              <button>
                <i
                  class="flaticon-162-edit text-base text-gray-500 inline-block cursor-pointer"
                   @click="editTitle('products_count')"
                ></i>
              </button>
            </div>
            <div class="w-auto flex-grow flex flex-col items-center justify-center">
              <div class="">{{ business.likes }}</div>
              <div class="text-gray-400 text-xs">
                <span v-if="business.custom_titles.likes">
                  {{ business.custom_titles.likes}}
                </span>
                <span v-else>مشتری</span>
              </div>
              <button>
                <i
                  class="flaticon-162-edit text-base text-gray-500 inline-block cursor-pointer"
                  @click="editTitle('likes')"
                ></i>
              </button>
            </div>
            <div class="w-auto flex-grow flex flex-col items-center justify-center">
              <div class="">{{ business.done_invoices_count }}</div>
              <div class="text-gray-400 text-xs">
                <span v-if="business.custom_titles.done_invoices_count">
                  {{ business.custom_titles.done_invoices_count}}
                </span>
                <span v-else>ارسالی</span>
              </div>
              <button>
                <i
                  class="flaticon-162-edit text-base text-gray-500 inline-block cursor-pointer"
                  @click="editTitle('done_invoices_count')"
                ></i>
              </button>
            </div>
            <div class="w-auto flex-grow flex flex-col items-center justify-center">
              <div class="">{{ business.invoices_count }}</div>
              <div class="text-gray-400 text-xs">
                <span v-if="business.custom_titles.invoices_count">
                  {{ business.custom_titles.invoices_count}}
                </span>
                <span v-else>دریافتی</span>
              </div>
              <button>
                <i
                  class="flaticon-162-edit text-base text-gray-500 inline-block cursor-pointer"
                  @click="editTitle('invoices_count')"
                ></i>
              </button>
            </div>
          </div>
        </div>

        <div class="flex-grow lg:flex-grow-0 mt-6 sm:mt-0">
          <div class="flex gap-8">
            <div class="flex items-center mb-4 lg:mb-6 text-xs lg:text-base">
              <input
                id="enable-input"
                v-model="form.active"
                type="checkbox"
                class="h-4 w-4 ml-2 text-cyan-250 focus:ring-cyan-250 border-gray-300 rounded cursor-pointer"
                @input="update"
              >
              <label for="enable-input" class="block cursor-pointer">
                <span v-if="isAdmin">وضعیت مدیر</span>
                <span v-else>وضعیت (فعال یا غیرفعال)</span>
              </label>
            </div>
            <div v-if="isAdmin" class="flex items-center mb-4 lg:mb-6 text-xs lg:text-base">
              <input
                id="user-enable-input"
                v-model="form.user_active"
                type="checkbox"
                class="h-4 w-4 ml-2 text-cyan-250 focus:ring-cyan-250 border-gray-300 rounded cursor-pointer"
                @input="update"
              >
              <label for="user-enable-input" class="block cursor-pointer">
                وضعیت کاربر
              </label>
            </div>
          </div>

          <div class="flex flex-col items-end">
            <submit-btn
              v-if="business"
              @click="submit"
            />
          </div>
        </div>

      </div>

    </div>
    <Modal :show="editTitleModal" @close="editTitleModal = false">
      <div class="bg-white p-4">
        <div>
          تغییر عنوان
          <span v-if="titleForm.label" class="text-blue-450">
            {{ labels[titleForm.label] }}
          </span>
        </div>
        <div class="p-1 my-8">
          <p class="mb-1">
            عنوان جایگزین
          </p>
          <Input
            v-model="titleForm.title"
            :placeholder="`یک عنوان جایگزین برای '${titleForm.label ? labels[titleForm.label] : ''}' وارد نمایید`"
            @keyup.enter="submitTitle"
          />
        </div>
        <div class="flex justify-end">
          <submit-btn
            @click="submitTitle"
          />
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>

import Input from "../../Input";
import SubmitBtn from "../../SubmitBtn";
import AddImageBtn from "../../AddImageBtn";
import moment from "~/mixins/moment";
import errorParser from "~/mixins/error_parser";

export default {
  name: "PanelBusinessEditIcon",
  components: {AddImageBtn, SubmitBtn, Input},
  mixins: [moment, errorParser],
  props: {
    business: {
      type: Object,
      default: null
    },
    value: {
      type: Object,
      required: true
    },
    exist: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        admin_note: '',
        avatar: '',
        active: '',
        user_active: '',
        subscription: '',
        features: {
          views: true,
          score: true,
          chat: true,
          report: true,
          share: true,
          qr_code: true,
          bookmark: true,
        }
      },
      titleForm: {
        label: null,
        title: null,
      },
      labels: {
        products_count: 'کالا و خدمات',
        likes: 'مشتری',
        done_invoices_count: 'ارسالی',
        invoices_count: 'دریافتی'
      },
      editTitleModal: false,
      loading: false,
    }
  },
  computed: {
    isAdmin() {
      // return this.$store.state.user.data.roles.findIndex(x => x.name === 'super-admin') >= 0
      return this.$route.name.startsWith('admin-')
    },
    formData() {
      return this.isAdmin
        ? {
          avatar: this.form.avatar,
          status: this.form.active,
          features: Object.keys(this.form.features).filter(key => this.form.features[key]),
          active: this.form.user_active,
          admin_note: this.form.admin_note,
          subscription: this.form.subscription,
        }
        : {
          avatar: this.form.avatar,
          active: this.form.active,
        }
    },
    countdown() {
      return this.form.subscription
        ? Math.floor((new Date(this.form.subscription + ' 23:59:59') - new Date()) / 1000)
        : 0
    },
    url() {
      return this.isAdmin ? `admin/businesses/${this.$route.params.id}` : `home/business/${this.$route.params.id}`
    }
  },
  watch: {
    value() {
      this.parseValue()
    }
  },
  mounted() {
    this.parseValue()
  },
  methods: {
    editTitle(label) {
      this.titleForm.label = label
      this.titleForm.title = this.business.custom_titles[label] || ''
      this.editTitleModal = true
    },
    submitTitle() {
      if (!this.titleForm.label) {
        return
      }
      this.$axios.$post(`admin/businesses/${this.$route.params.id}/custom_title`, this.titleForm)
        .then((response) => {
          this.$emit('update-title', {label: this.titleForm.label, title: response.data})
          this.$store.commit('notification/success', 'اطلاعات کسب و کار با موفقیت بروزرسانی شد.')
          this.editTitleModal = false
        })
        .catch(error => this.showError(error))
    },
    parseValue() {
      this.form.avatar = this.value.avatar
      if (this.isAdmin) {
        this.form.active = this.value.status
        this.form.features = this.value.features
        this.form.features = {
          views: this.value.features ? this.value.features.includes('views') : false,
          score: this.value.features ? this.value.features.includes('score') : false,
          chat: this.value.features ? this.value.features.includes('chat') : false,
          report: this.value.features ? this.value.features.includes('report') : false,
          share: this.value.features ? this.value.features.includes('share') : false,
          qr_code: this.value.features ? this.value.features.includes('qr_code') : false,
          bookmark: this.value.features ? this.value.features.includes('bookmark') : false,
        }
        this.form.user_active = this.value.active
        this.form.admin_note = this.value.admin_note
        this.form.subscription = this.value.subscription
      } else {
        this.form.active = this.value.active
      }
    },
    update() {
      this.$emit('input', this.formData)
    },
    updateAvatar() {
      if (!this.business) {
        this.$emit('input', this.formData)
        return
      }
      if (this.form.avatar && this.business) {
        this.$axios.$put(this.url, {avatar: this.form.avatar})
          .then(() => {
            this.$store.commit('notification/success', 'تصویر آیکون با موفقیت بروزرسانی شد.')
          })
          .catch(error => this.showError(error))
      }
    },
    submit() {
      this.$axios.$put(this.url, this.formData)
        .then(() => {
          this.$store.commit('notification/success', 'اطلاعات کسب و کار با موفقیت بروزرسانی شد.')
        })
        .catch(error => this.showError(error))
    }
  }
}
</script>
