<template>
  <div class="business-product-form">
    <div class="mb-2 flex items-center mb-4">
      <i class="flaticon-063-picture ml-2 text-xl"></i>
      <span v-if="product" class="flex-grow font-bold">ویرایش محصول</span>
      <span v-else class="flex-grow font-bold">افزودن محصول</span>
    </div>

    <div>

      <p v-if="false" class="mb-12 font-medium">شما هر قسمت از اطلاعات این محصول را که بخواهید می توانید ویرایش کنید.</p>

      <div v-if="false" class="grid gap-4">
        <div :class="['text-center', picture ? 'opacity-20' : '']">
          <img
            v-if="generalProduct"
            :src="`${baseUrl}${generalProduct.picture}`" alt=""
            class="w-24 h-24 rounded-full border border-cyan-250 object-cover mx-auto">
          <div class="pt-4 mb-12 text-gray-500">تصویر آیکون</div>
        </div>
        <div>
          <authentication-avatar-field
            v-model="picture"
            :auto-upload="true"
            label="تغییر تصویر آیکون"
            class="whitespace-nowrap"
            border-color="cyan-250"
            label-class="font-medium pt-4 block mx-auto text-blue-450"
          />
        </div>
      </div>

      <div class="grid gap-4 pb-16 md:pb-28">
        <template v-if="generalProduct">
          <div v-for="image in generalProduct.gallery" :key="image">
            <div
              class="image-wrapper relative"
              :class="[gallery[0] && !selectedImages.includes(image) ? 'opacity-20' : '', gallery[0] ? 'cursor-pointer' : '']"
              @click="gallery[0] && toggleImage(image)"
            >
              <img :src="`${baseUrl}${image}`" alt=""
                   class="absolute top-0 right-0 h-full w-full overflow-hidden rounded">
            </div>
          </div>
        </template>
        <div
          v-for="(item, index) in gallery" :key="index"
        >
          <div class="relative image-wrapper">
            <div class="absolute top-0 right-0 w-full h-full">
              <add-image-btn
                v-model="gallery[index]"
                css-class="w-full h-full justify-evenly"
                root-class="w-full h-full"
                icon-class="w-14 h-14"
                label-class="font-semibold"
                :remove-btn="true"
              />
              <div v-if="!gallery[0]" class="text-blue-500 text-center pt-4">تغییر تصویر محصول</div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-wrap items-end mb-5 md:mb-8">
        <div class="w-full md:w-1/2 md:pl-3 pb-5 md:pb-0">
          <Input
            v-model="name"
            label="نام محصول"
          >
            <template
              v-if="generalProduct"
              #after-label
            >
              <div class="text-gray-400 pb-2 -mt-1">
                پیش فرض:
                {{ generalProduct.name }}
              </div>
            </template>
          </Input>
        </div>
        <div class="w-full md:w-1/2 md:pr-3">
          <Input
            v-model="code"
            label="کد محصول"
          />
        </div>
      </div>

      <Input v-model="description" label="توضیح محصول" type="textarea" rows="3" class="mb-5 md:mb-8">
        <template
          v-if="generalProduct"
          #after-label
        >
          <div class="text-gray-400 pb-2 -mt-1">
            پیش فرض:
            {{ generalProduct.description }}
          </div>
        </template>
      </Input>

      <tags-input v-model="tags" label="تگ ها" class="mb-8 md:mb-16">
        <template
          v-if="generalProduct"
          #after-label
        >
          پیش فرض:
          {{ generalProduct.tags.split(/(?:, ?|، ?)/).join('، ') }}
        </template>
      </tags-input>

      <div v-if="false">
        <div v-if="dateable" class="text-orange-500 text-center py-8">
          بعد از افزودن محصول می توانید قیمت و نوبت ها را تنظیم نمایید.
        </div>
        <div v-else class="text-orange-500 text-center py-8">
          بعد از افزودن محصول می توانید از همین قسمت قیمت ها را تنظیم نمایید.
        </div>

        <div class="flex justify-center pt-8">
          <submit-btn
            label="مرحله قبلی"
            icon="flaticon-065-right-arrow-1"
            class="mx-2"
            @click="$emit('click-prev')"
          />
          <submit-btn
            label="افزودن محصول"
            icon="flaticon-043-plus"
            class="mx-2" @click="submit"
          />
        </div>

      </div>
    </div>

    <PanelBusinessAppointments
      v-if="dateable && product"
      :product="product"
    />

    <PanelBusinessHolidays
      v-if="dateable && product"
      :product="product"
      class="my-24"
    />

    <div class="border-t pt-8 md:pt-16">

      <PanelBusinessPriceForm
        :dateable="dateable"
        :item="editingPrice"
        @submit="savePrice"
      />

      <PanelBusinessPricesTable
        :dateable="dateable"
        :prices="prices"
        @click-edit-btn="editingPrice = prices[$event]"
        @click-delete-btn="prices.splice($event,1)"
      />

      <div class="flex items-center mt-8 mb-4">
        <input id="made_in_iran-input" v-model="made_in_iran" type="checkbox"
               class="h-4 w-4 ml-2 text-blue-450 focus:ring-blue-450 border-gray-300 rounded">
        <label for="made_in_iran-input" class="ml-2 block text-sm text-gray-900">
          ساخت ایران
        </label>
      </div>

      <div class="flex items-center mb-4">
        <input id="active-input" v-model="active" type="checkbox"
               class="h-4 w-4 ml-2 text-blue-450 focus:ring-blue-450 border-gray-300 rounded">
        <label for="active-input" class="ml-2 block text-sm text-gray-900">
          وضعیت (فعال یا غیرفعال)
        </label>
      </div>

      <div class="flex justify-center pt-8">
        <submit-btn
          icon=""
          label-class="pr-3 md:pr-8"
          label="بستن"
          class="mx-2"
          @click="$emit('close')"
        />
        <submit-btn
          label="ذخیره"
          icon=""
          label-class="pr-3 md:pr-8"
          class="mx-2"
          @click="submit"
        />
      </div>

    </div>

  </div>
</template>

<script>
import SubmitBtn from "../../SubmitBtn";
import AuthenticationAvatarField from "../../authentication/AvatarField";
import AddImageBtn from "../../AddImageBtn";
import Input from "../../Input";
import TagsInput from "../../TagsInput";
import moment from "../../../mixins/moment";
import errorParser from "../../../mixins/error_parser";
import PanelBusinessHolidays from "./Holidays.vue";
import PanelBusinessPriceForm from "./PriceForm.vue";
import PanelBusinessPricesTable from "./PricesTable.vue";

export default {
  name: "PanelBusinessProductForm",
  components: {
    PanelBusinessHolidays,
    PanelBusinessPricesTable,
    PanelBusinessPriceForm,
    TagsInput, Input, AddImageBtn, AuthenticationAvatarField, SubmitBtn},
  mixins: [errorParser, moment],
  props: {
    generalProduct: {
      type: Object,
      default: null
    },
    product: {
      type: Object,
      required: true
    },
    category: {
      type: Object,
      default: null
    },
    dateable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      name: '',
      code: '',
      description: '',
      picture: '',
      tags: '',
      made_in_iran: false,
      active: true,
      prices: [],
      holidays: [],
      discount_expire_alt: '',
      gallery: [''],
      selectedImages: [],
      baseUrl: process.env.storagePath,
      editingPrice: null,
    }
  },
  watch: {
    gallery() {
      if (this.gallery[this.gallery.length - 1]) {
        this.gallery.push('')
      }
    }
  },
  created() {
    if (this.product) {
      this.picture = this.product.picture || ''
      this.gallery = !this.product.gallery
        ? ['']
        : this.generalProduct
          ? [...this.product.gallery.filter(x => !this.generalProduct.gallery.includes(x)), '']
          : this.product.gallery
      this.selectedImages = !this.product.gallery
        ? []
        : this.generalProduct
          ? [...this.product.gallery.filter(x => !!this.generalProduct.gallery.includes(x))]
          : []
      this.name = this.product.name || ''
      this.code = this.product.code || ''
      this.description = this.product.description || ''
      this.tags = this.product.tags || ''
      this.made_in_iran = this.product.made_in_iran || false
      this.prices = this.product.prices || []
      this.holidays = this.product.holidays || []
    }
  },
  methods: {
    toggleImage(image) {
      this.selectedImages.includes(image)
        ? this.selectedImages.splice(this.selectedImages.findIndex(x => x === image), 1)
        : this.selectedImages.push(image)
    },
    savePrice(data) {
      if (this.editingPrice === null) {
        this.prices.push({...data})
      } else {
        Object.keys(data).forEach(key => {
          this.editingPrice[key] = data[key]
        })
      }
    },
    submit() {

      const data = {
        code: this.code || null,
        picture: this.picture || null,
        gallery: this.gallery[0] ? [...this.gallery, ...this.selectedImages].filter(x => !!x) : null,
        name: this.name || null,
        description: this.description || null,
        tags: this.tags || null,
        prices: this.prices.map(x => ({
          id: x?.id,
          title: x.title,
          price: x.price,
          inventory: this.dateable ? 1 : x.inventory,
          discount: x.discount || 0,
          price_after_discount: x.price && x.discount
            ? x.price * (100 - x.discount) / 100
            : null,
          discount_expire: x.discount_expire && x.discount_expire.length > 16
            ? this.formatDate(x.discount_expire, 'YYYY/MM/DD HH:mm')
            : x.discount_expire,
          description: x.description,
        })),
        made_in_iran: this.made_in_iran,
        active: this.active,
        general_id: this.generalProduct ? this.generalProduct.id : null
      }

      const method = this.product ? '$put' : '$post'
      const url = this.product ? `/home/product/${this.product.id}` : `/home/categories/${this.category.id}/product`

      this.$axios[method](url, data)
        .then(response => {
          this.$emit(this.product ? 'update' : 'create', response.data)
          this.$store.commit(
            'notification/success',
            `محصول جدید با موفقیت ${this.product ? 'ویرایش' : 'ثبت'} شد.`
          );
        })
        .catch(error => {
          this.showError(error)
        })
    }
  }
}
</script>

<style lang="scss">
.business-product-form {
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));

    @media (min-width: 768px) {
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    }

    .image-wrapper {
      padding-top: 55%;

      img {
        object-fit: cover
      }
    }
  }
}
</style>
