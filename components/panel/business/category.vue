<template>
  <div
    class="category-wrapper"
    :draggable="draggable"
    @dragstart="drag"
    @dragend="$emit('end-drag')"
  >
    <div ref="button" class=" flex items-center bg-white rounded px-3 md:px-6 py-2 md:py-4">
      <div
        @touchstart="touchstart"
        @touchend="touchend"
        @touchmove="touchmove"
        @touchcancel="touchcancel"
        @mouseenter="draggable = true"
        @mouseleave="draggable = false"
      >
        <i class="flaticon-023-move text-gray-400 cursor-move"></i>
      </div>
      <div class="mx-2 md:mx-2">
        <img :src="`${baseUrl}${category.picture}`" alt="" class="w-14 h-14 rounded object-contain">
      </div>
      <div class="hidden md:block" @click="open = !open">
        <span>{{ category.name }}</span>
        <br>
        <span class="text-gray-400">تعداد محصولات: {{ category.products.length }}</span>
      </div>
      <span class="flex-grow hidden md:block"></span>
      <div class="flex-grow md:flex-grow-0">
        <div class="md:hidden truncate" @click="open = !open">{{ category.name }}</div>
        <div class="flex items-center">
          <span class="text-gray-400 md:hidden flex-grow text-xs" @click="open = !open">تعداد محصولات: {{ category.products.length }}</span>
          <button @click="open = !open">
            <i v-if="open" class="flaticon-081-up-arrow-2"></i>
            <i v-else class="flaticon-080-down-arrow-2"></i>
          </button>
          <edit-button label="ویرایش" class="mx-4" @click="$emit('edit')"/>
          <delete-button label="حذف" @click="$emit('delete')"/>
        </div>
      </div>
    </div>

    <slide-down :open="open">
      <panel-business-category-products
        ref="products"
        :category="category"
        :dateable="dateable"
      />
    </slide-down>

  </div>
</template>

<script>
import EditButton from "../../EditButton";
import DeleteButton from "../../DeleteButton";
import SlideDown from "../../SlideDown";
import PanelBusinessCategoryProducts from "./CategoryProducts";
export default {
  name: "PanelBusinessCategory",
  components: {PanelBusinessCategoryProducts, SlideDown, DeleteButton, EditButton},
  props: {
    category: {
      type: Object,
      required: true,
    },
    products: {
      type: Array,
      required: true,
    },
    dateable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      open: false,
      draggable: false,
      baseUrl: process.env.storagePath,
    }
  },
  watch: {
    open(value) {
      if (value) {
        this.$emit('open')
      } else {
        this.$refs.products.open = false
      }
    }
  },
  methods: {
    drag(event) {
      this.$emit('start-drag', this.category.id)
      event.dataTransfer.setData("text", this.category.id)
      const {x: x1, y: y1} = this.$el.getBoundingClientRect()
      const {x: x2, y: y2} = this.$el.querySelector('.flaticon-023-move').getBoundingClientRect()
      event.dataTransfer.setDragImage(this.$refs.button, x2 - x1, y2 - y1)
    },
    touchstart(event) {
      this.$emit('start-drag', this.category.id)
      const rect = this.$el.getBoundingClientRect()
      const node = this.$refs.button.cloneNode(true)
      node.id = 'touch-move-element-copy'
      node.style.opacity = '.5'
      node.style.width = this.$el.clientWidth + 'px'
      node.dataset.yoffset = (rect.top - event.targetTouches[0].clientY).toString()
      node.dataset.xoffset = (rect.left - event.targetTouches[0].clientX).toString()
      node.style.top = event.targetTouches[0].clientY + (rect.top - event.targetTouches[0].clientY) + 'px'
      node.style.left = event.targetTouches[0].clientX + (rect.left - event.targetTouches[0].clientX) + 'px'
      node.style.position = 'fixed'
      this.$el.parentNode.append(node)
    },
    touchend(event) {
      this.$emit('end-drag')
      document.getElementById('touch-move-element-copy').remove()
      const changedTouch = event.changedTouches[0]
      const el = document.elementFromPoint(changedTouch.clientX, changedTouch.clientY)?.closest('.category-wrapper')
      if (el && el !== this.$el) {
        this.$emit('move', {id: this.category.id, target: el})
      }
    },
    touchmove(event) {
      event.preventDefault()
      const node = document.getElementById('touch-move-element-copy')
      node.style.top = (event.targetTouches[0].clientY + +node.dataset.yoffset) + 'px'
      node.style.left = (event.targetTouches[0].clientX + +node.dataset.xoffset) + 'px'
    },
    touchcancel() {
      this.$emit('end-drag')
      document.getElementById('touch-move-element-copy').remove()
    },
  }
}
</script>
