<template>
  <div>

    <div class="rounded pt-4 p-8 mb-4 bg-white">

      <div class="flex justify-between">

        <div>
          <h3 class="mb-4 hidden md:block">
            <i class="pl-2 flaticon-063-picture"></i>
            <span class="font-semibold">تصویر آیکون</span>
          </h3>

          <div>
            <authentication-avatar-field
              v-model="form.picture"
              :auto-upload="true"
            />
          </div>

        </div>

        <div>

          <h3 class="mb-4 hidden md:block">
            <i class="pl-2 flaticon-151-check"></i>
            <span v-if="isItemPage" class="font-semibold">ویرایش</span>
            <span v-else class="font-semibold">ثبت</span>
          </h3>

          <div class="flex items-center mb-4">
            <input id="enable-input" v-model="form.active" type="checkbox"
                   class="h-4 w-4 ml-2 text-blue-450 focus:ring-blue-450 border-gray-300 rounded">
            <label for="enable-input" class="ml-2 block text-sm text-gray-900">
              وضعیت (فعال یا غیرفعال)
            </label>
          </div>

          <div class="flex md:flex-wrap justify-center">
            <button
              :class="[
              'flex items-center bg-blue-450 text-white rounded py-2',
              'md:w-full md:mb-4 md:justify-center',
              'lg:w-auto lg:mb-0 lg:justify-start',
            ]"
              @click="submit"
            >
              <i v-if="!loading" class="flaticon-151-check font-bold px-4 xl:px-3 2xl:px-4"></i>
              <span v-if="!loading && isItemPage" class="pl-8 xl:pl-6 2xl:pl-8">بروزرسانی</span>
              <span v-else-if="!loading" class="pl-8">ثبت</span>
              <span v-else class="loader mx-8 w-5 h-5 border-2 rounded-full border-blue-300"></span>
            </button>
            <nuxt-link
              to="/admin/products"
              :class="[
              'flex items-center border border-blue-450 text-blue-450 rounded py-2 ',
              'px-8 xl:px-6 2xl:px-8 mr-4 md:w-full lg:w-auto md:justify-center lg:justify-start md:mr-0 lg:mr-4'
            ]"
            >
              <span>انصراف</span>
            </nuxt-link>
          </div>

        </div>

      </div>

      <div class="flex flex-wrap -mb-6">

        <div v-for="(image, index) in form.gallery" :key="image" class="ml-6 mb-6">
          <add-image-btn
            v-model="form.gallery[index]"
            css-class="w-32 h-32 rounded-xl object-contain"
            root-class="w-full h-full"
            icon-class="w-14 h-14"
            label-class="font-semibold"
            :remove-btn="true"
          />
        </div>

        <add-image-btn
          ref="imageBtn"
          :value="null"
          class="ml-6 mb-6"
          css-class="w-32 h-32"
          icon-class="w-14 h-14 mb-3"
          label-class="font-medium"
          @input="addImageToGallery"
        />

        <template v-if="5 - form.gallery.length >= 0">
          <div v-for="i in 5 - form.gallery.length" :key="i" class="ml-6 mb-6">
            <div
              class="w-32 h-32 border-2 border-dashed border-gray-400 rounded-xl flex flex-col justify-center items-center text-gray-400"
            >
              <i class="flaticon-063-picture text-5xl mb-2"></i>
              <span class="text-lg font-medium">عکس</span>
            </div>
          </div>
        </template>

      </div>

    </div>

    <div class="rounded pt-4 p-8 bg-white">
      <h3 class="mb-4 hidden md:block">
        <i class="pl-2 flaticon-063-picture"></i>
        <span class="font-semibold">اطلاعات محصول</span>
      </h3>

      <Input
        v-model="form.name"
        class="mb-4"
        label="نام محصول"
        :errors="errors.hasOwnProperty('name') ? errors.name : []"
        @keyup="enterKey"
      />

      <tags-input
        v-model="form.tags"
        class="mb-4"
        label="تگ ها"
        :errors="errors.hasOwnProperty('tags') ? errors.tags : []"
      />

      <Input
        v-model="form.description"
        type="textarea"
        class="mb-4"
        label="شرح محصول"
        :errors="errors.hasOwnProperty('description') ? errors.description : []"
        @keyup="enterKey"
      />

      <div class="flex items-center mb-4">
        <input id="made_in_iran-input" v-model="form.made_in_iran" type="checkbox"
               class="h-4 w-4 ml-2 text-blue-450 focus:ring-blue-450 border-gray-300 rounded">
        <label for="made_in_iran-input" class="ml-2">
          ساخت ایران
        </label>
      </div>

    </div>

  </div>
</template>

<script>
import AuthenticationAvatarField from "../../authentication/AvatarField";
import AddImageBtn from "../../AddImageBtn";
import Item from "~/mixins/item"

export default {
  name: "AdminProductsForm",
  components: {AddImageBtn, AuthenticationAvatarField},
  mixins: [Item],
  data() {
    return {
      url: 'admin/general_products',
      listPage: '/admin/products',
      form: {
        picture: "",
        name: "",
        tags: "",
        description: "",
        active: true,
        made_in_iran: false,
        gallery: [],
      },
    }
  },
  methods: {
    addImageToGallery(value) {
      if (value) {
        this.form.gallery.push(value)
        this.$refs.imageBtn.src = ""
      }
    },
    getFormData() {
      const data = {...this.form}
      data.gallery = this.form.gallery.filter(x => !!x)
      return data
    }
  }
}
</script>
