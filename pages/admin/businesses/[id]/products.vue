<template>
  <div class="select-none">
    <div v-if="business">
      <panel-business-navigation :id="business.id" :has-category="business.has_category"/>

      <div class="bg-white rounded p-6">
        <div class="flex">
          <i class="flaticon-063-picture ml-2 text-xl"></i>
          <span class="flex-grow font-bold">دسته بندی ها</span>
          <span class="cursor-pointer text-blue-450" @click="open = !open">
            <i class="flaticon-043-plus"></i>
            <span>افزودن</span>
          </span>
        </div>

        <slide-down :open="open">
          <div class="flex flex-col items-center p-1">
            <add-image-btn v-model="form.picture"/>
            <Input
              v-model="form.name"
              placeholder="نام دسته بندی"
              class="w-80 py-4"
              input-class="pr-8"
            >
              <template #icon>
                <i class="flaticon-162-edit absolute right-2 top-2 text-gray-500"></i>
              </template>
            </Input>
            <submit-btn
              :label="editItemIndex !== null ? 'بروزرسانی' : 'افزودن'"
              :icon="editItemIndex !== null ? 'flaticon-162-edit' : 'flaticon-043-plus'"
              @click="submit"
            />
          </div>
        </slide-down>

      </div>
    </div>

    <delete-confirmation-modal :show="deleteModal" @close="deleteModal = false" @confirm="remove"/>

    <div v-if="business" class="mt-8 space-y-4" @drop="drop" @dragover="allowDrop">
      <panel-business-category
        v-for="(category, index) in business.categories"
        ref="category"
        :key="category.id"
        :category="category"
        :products="[]"
        @edit="editItemIndex = index"
        @delete="deleteItemIndex = index"
        @open="closeOther(index)"
        @start-drag="startDrag($event)"
        @end-drag="endDrag()"
      />
    </div>
  </div>
</template>

<script>
import SlideDown from "../../../../components/SlideDown";
import AddImageBtn from "../../../../components/AddImageBtn";
import Input from "../../../../components/Input";
import SubmitBtn from "../../../../components/SubmitBtn";
import PanelBusinessCategory from "../../../../components/panel/business/category";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";
import errorParser from "~/mixins/error_parser";

export default {
  name: "AdminEditBusinessProductsPage",
  components: {DeleteConfirmationModal, PanelBusinessCategory, SubmitBtn, Input, AddImageBtn, SlideDown},
  mixins: [errorParser],
  layout: 'admin',
  data() {
    return {
      business: null,
      imagePanelOpen: true,
      loading: false,
      open: false,
      deleteModal: false,
      deleteItemIndex: null,
      editItemIndex: null,
      form: {
        picture: '',
        name: '',
      }
    }
  },
  async fetch() {
    await this.$axios.$get(`admin/businesses/${this.$route.params.id}?products=1&categories=1`)
      .then(response => {
        this.business = response.data || null
      })
  },
  watch: {
    open(value) {
      value && this.closeAll()
    },
    deleteItemIndex(val) {
      this.deleteModal = val !== null
    },
    editItemIndex(val) {
      if (val !== null) {
        this.form.name = this.business.categories[val].name
        this.form.picture = this.business.categories[val].picture
        this.open = true
      }
    },
    deleteModal(val) {
      if (!val) {
        this.deleteItemIndex = null
      }
    }
  },
  methods: {
    submit() {
      this.editItemIndex !== null ? this.saveEdit() : this.saveNew()
    },
    saveNew() {
      const sortId = this.business.categories?.length || 0
      this.$axios.$post(`home/business/${this.$route.params.id}/categories`, {...this.form, sort_id: sortId})
        .then(response => {
          response.products = []
          this.business.categories.push(response)
          this.form.name = ''
          this.form.picture = ''
          this.$store.commit('notification/success', 'دسته بندی جدید با موفقیت ایجاد شد.')
        })
        .catch(error => {
          this.showError(error)
        })
    },
    saveEdit() {
      this.$axios.$put(`home/business/categories/${this.business.categories[this.editItemIndex].id}`, this.form)
        .then(response => {
          this.business.categories[this.editItemIndex].name = response.data.name
          this.business.categories[this.editItemIndex].picture = response.data.picture
          this.editItemIndex = null
          this.form.name = ''
          this.form.picture = ''
          this.$store.commit('notification/success', 'دسته بندی با موفقیت ویرایش شد.')
        })
        .catch(error => {
          this.showError(error)
        })
    },
    remove() {
      this.$axios.$delete(`home/business/categories/${this.business.categories[this.deleteItemIndex].id}`)
        .then(() => {
          this.business.categories.splice(this.deleteItemIndex, 1)
          this.$store.commit('notification/success', 'دسته بندی با موفقیت حذف شد.')
          this.deleteItemIndex = null
        })
        .catch(error => {
          this.showError(error)
        })
    },
    closeAll() {
      if (this.$refs.category) {
        this.$refs.category.forEach(el => {
          el.open = false
        })
      }
    },
    closeOther(index) {
      this.open = false
      this.$refs.category.forEach((el, i) => {
        if (index !== i) {
          el.open = false
        }
      })
    },
    startDrag(id) {
      this.$refs.category.forEach((el) => {
        if (el.category.id !== id) {
          el.$el.classList.add('opacity-50')
        }
      })
    },
    endDrag() {
      this.$refs.category.forEach((el) => {
        el.$el.classList.remove('opacity-50')
      })
    },
    allowDrop(event) {
      event.preventDefault();
    },
    drop(event) {
      event.preventDefault();
      const id = +event.dataTransfer.getData("text")
      const target = event.target.closest('.category-wrapper')
      const el = this.$refs.category.find(x => x.category.id === id).$el
      const moved = target && target !== el

      if (moved) {
        const elIndex = this.business.categories.findIndex(x => x.id === id)
        const targetId = this.$refs.category.find(x => x.$el === target).category.id;
        const targetIndex = this.business.categories.findIndex(x => x.id === targetId)
        this.business.categories.splice(targetIndex, 0, this.business.categories.splice(elIndex, 1)[0]);
        const orderIds = this.business.categories.map(x => x.id).join(',')
        this.$axios.$patch(`home/business/${this.$route.params.id}/categories/update_order`, {order_ids: orderIds})
          .then(response => {
            this.$store.commit('notification/success', 'ترتیب دسته بندی ها با موفقیت اصلاح شد.')
            this.business.categories = response
          })
      }

    },
  }
}
</script>
